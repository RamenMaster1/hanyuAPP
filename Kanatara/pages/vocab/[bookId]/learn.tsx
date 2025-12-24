import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { getVocabBook, getVocabEntries, type VocabBook, type VocabEntry } from "../../../lib/vocabBooks";
// 建议使用您在 lib/prisma.ts 中定义的单例，避免开发环境下连接数过多
import prisma from "../../../lib/prisma"; 
import redis from "../../../lib/redis"; 
import { getUserIdFromSession } from "../../../lib/auth";

type Props = {
  book: VocabBook;
  entries: VocabEntry[];
  total: number;
  page: number;
  pageSize: number;
  files: string[];
  selectedFile: string | null;
  initialStatus: Record<string, string>; // 从数据库和缓存读取的初始状态

};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const bookId = context.params?.bookId as string;
  const page = Math.max(1, parseInt(String(context.query.page ?? "1"), 10) || 1);
  const pageSize = Math.max(1, Math.min(50, parseInt(String(context.query.pageSize ?? "20"), 10) || 20));
  const selectedFileParam = typeof context.query.file === "string" ? context.query.file : null;

  const book = getVocabBook(bookId);
  if (!book) return { notFound: true };

  const entriesAll = getVocabEntries(bookId).filter((e) => {
    if (!selectedFileParam) return true;
    return e.sourceFile === selectedFileParam;
  });

  const start = (page - 1) * pageSize;
  const entries = entriesAll.slice(start, start + pageSize);

  // --- 持久化与缓存读取逻辑 ---
  const userId = await getUserIdFromSession(context.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const initialStatus: Record<string, string> = {};

  try {
    // 1. 从 MySQL 获取已持久化的进度
    if (prisma) {
      const progressRecords = await prisma.wordProgress.findMany({
        where: {
          userId: userId,
          bookId: bookId,
        },
        select: {
          wordId: true,
          status: true,
        },
      });

      progressRecords.forEach((record) => {
        // 这里的 key 格式需与前端卡片渲染使用的 key (bookId-wordId) 保持一致
        initialStatus[`${bookId}-${record.wordId}`] = record.status;
      });
    }

    // 2. 从 Redis 读取最新的“热数据”并覆盖数据库数据
    // 这样即便数据还没来得及同步到 MySQL，刷新页面后状态依然是准确的
    const redisKey = `user_progress:${userId}`;
    const redisData = await redis.hgetall(redisKey);

    Object.entries(redisData).forEach(([field, status]) => {
      // Redis 存储的 field 格式为 "bookId:wordId"
      if (field.startsWith(`${bookId}:`)) {
        const wordId = field.split(':')[1];
        // 映射到前端使用的 key 格式: "bookId-wordId"
        initialStatus[`${bookId}-${wordId}`] = status;
      }
    });
  } catch (error) {
    console.error("Error fetching progress from MySQL or Redis:", error);
    // 出错时依然返回已获取的部分数据或空对象，确保页面不崩溃
  }

  return {
    props: {
      book,
      entries,
      total: entriesAll.length,
      page,
      pageSize,
      files: book.files ?? [],
      selectedFile: selectedFileParam,
      initialStatus,

    },
  };
};

const LearnPage = ({
  book,
  entries,
  total,
  page,
  pageSize,
  files,
  selectedFile,
  initialStatus,
  // userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  
  // 状态管理
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({});
  // 使用服务器传来的 initialStatus 进行初始化，实现刷新不丢失
  const [statusMap, setStatusMap] = useState<Record<string, string>>(initialStatus);
  const [statusFilter, setStatusFilter] = useState<"all" | "known" | "fuzzy" | "unknown">("all");

  // 更新单词状态的核心函数
  const handleStatusUpdate = async (wordId: string, status: "known" | "fuzzy" | "unknown") => {
    const key = `${book.id}-${wordId}`;
    
    // 1. 乐观更新：立即改变本地 UI 状态，用户体验最流畅
    setStatusMap((prev) => ({ ...prev, [key]: status }));

    // 2. 异步请求：发送到后端 API 写入 Redis
    try {
      const response = await fetch('/api/vocab/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // userId,
          bookId: book.id,
          wordId,
          status
        }),
      });

      if (!response.ok) {
        console.error("Failed to sync status to server");
      }
    } catch (error) {
      console.error("Network error while updating status:", error);
    }
  };

  const toggleHidden = (id: string) => {
    setHiddenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const koreanOnly = (text: string) => {
    const matched = text.match(/[\uac00-\ud7a3\s]+/g);
    if (!matched) return "";
    return matched.join(" ").trim();
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !text) return;
    const payload = koreanOnly(text);
    if (!payload) return;
    const u = new SpeechSynthesisUtterance(payload);
    u.lang = "ko-KR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const collocationsOf = (entry: VocabEntry): string[] => {
    const items: string[] = [];
    if (entry.related) items.push(entry.related);
    if (entry.example) items.push(entry.example);
    return items;
  };

  const buildFileLink = (file: string) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    if (file) params.set("file", file);
    return `/vocab/${encodeURIComponent(book.id)}/learn?${params.toString()}`;
  };

  const pageLink = (target: number) => {
    const params = new URLSearchParams();
    params.set("page", String(target));
    params.set("pageSize", String(pageSize));
    if (selectedFile) params.set("file", selectedFile);
    return `/vocab/${encodeURIComponent(book.id)}/learn?${params.toString()}`;
  };

  return (
    <>
      <Head>
        <title>{book.title} · 单词记忆</title>
      </Head>
      <div className="min-h-screen bg-white text-gray-900">
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">单词记忆</h1>
              <p className="text-xs text-gray-500 mt-1">{book.title}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">分卷：</span>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  value={selectedFile ?? ""}
                  onChange={(e) => {
                    const file = e.target.value;
                    window.location.href = buildFileLink(file);
                  }}
                >
                  <option value="">全部</option>
                  {files.map((file) => (
                    <option key={file} value={file}>
                      {file.replace(".json", "")}
                    </option>
                  ))}
                </select>
              </div>
              <Link href={`/vocab/${encodeURIComponent(book.id)}/review`} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800">
                进入复习
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
          {/* 筛选栏 */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-gray-600">词表筛选：</span>
            {[
              { key: "all", label: "全部" },
              { key: "known", label: "认识" },
              { key: "fuzzy", label: "模糊" },
              { key: "unknown", label: "不认识" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setStatusFilter(item.key as any)}
                className={`px-3 py-2 rounded-full border ${
                  statusFilter === item.key
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 单词卡片网格 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {entries
              .filter((entry) => {
                if (statusFilter === "all") return true;
                const status = statusMap[`${entry.bookId}-${entry.id}`];
                return status === statusFilter;
              })
              .map((entry) => {
              const key = `${entry.bookId}-${entry.id}`;
              const hide = hiddenMap[key];
              const status = statusMap[key];
              const collocations = collocationsOf(entry);
              
              // 根据状态计算卡片色调
              const cardTone =
                status === "known"
                  ? "bg-emerald-50 border-emerald-200"
                  : status === "unknown"
                    ? "bg-rose-50 border-rose-200"
                    : status === "fuzzy"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-white border-gray-200";

              return (
                <div
                  key={key}
                  className={`group relative rounded-2xl p-4 pb-14 shadow-sm hover:shadow-md transition border ${cardTone}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xl font-semibold text-gray-900">{entry.term}</p>
                        {entry.pos && <span className="text-xs text-gray-500">{entry.pos}</span>}
                        {status && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full ${
                              status === "known"
                                ? "bg-emerald-100 text-emerald-600"
                                : status === "unknown"
                                  ? "bg-rose-100 text-rose-600"
                                  : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            {status === "known" ? "认识" : status === "unknown" ? "不认识" : "模糊"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{entry.unit ?? "默认单元"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => speak(entry.term)}
                        className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 bg-white/50"
                        aria-label="播放读音"
                      >
                        🔊
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleHidden(key)}
                        className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 bg-white/50"
                        aria-label="显示/隐藏译文"
                      >
                        {hide ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-3 text-sm">
                    {collocations.length > 0 && (
                      <div className="space-y-2">
                        {collocations.map((text, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="font-semibold text-gray-500 shrink-0">
                              搭配{idx + 1}
                            </span>
                            <span className="text-gray-800">{text}</span>
                            <button
                              type="button"
                              onClick={() => speak(text)}
                              className="ml-auto h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 bg-white/50"
                            >
                              🔊
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={`text-gray-800 ${hide ? "opacity-40 select-none" : ""}`}>
                      <span className="font-semibold text-gray-500">释义：</span>
                      <span>{hide ? "已隐藏" : entry.definition}</span>
                    </div>
                  </div>

                  {/* 悬浮操作栏 */}
                  <div className="absolute inset-x-4 bottom-3 flex items-center gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(entry.id, "known")}
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm"
                    >
                      认识
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(entry.id, "fuzzy")}
                      className="text-xs px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-sm"
                    >
                      模糊
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(entry.id, "unknown")}
                      className="text-xs px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 shadow-sm"
                    >
                      不认识
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 分页栏 */}
          <div className="flex items-center justify-between text-sm text-gray-700 py-4">
            <div>
              第 {page} / {totalPages} 页 · 共 {total} 词
            </div>
            <div className="flex gap-2">
              <Link
                href={pageLink(Math.max(1, page - 1))}
                className={`px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 ${page === 1 ? "opacity-50 pointer-events-none" : ""}`}
              >
                上一页
              </Link>
              <Link
                href={pageLink(Math.min(totalPages, page + 1))}
                className={`px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 ${page >= totalPages ? "opacity-50 pointer-events-none" : ""}`}
              >
                下一页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnPage;
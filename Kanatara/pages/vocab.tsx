import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { getVocabBooks, type VocabBook } from "../lib/vocabBooks";
import { useAuthGuard } from "../hooks/useAuthGuard";

type Props = {
  books: VocabBook[];
};

const sections = [
  { title: "系统词库", subtitle: "高频词书 · 官方词表", key: "system" },
  { title: "生词和错词", subtitle: "标记/日历/纠错", key: "new" },
  { title: "我的词库", subtitle: "自定义 & 用户共享", key: "mine" },
];

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const books = getVocabBooks();
  return { props: { books } };
};

const VocabLanding = ({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { user, initializing } = useAuthGuard();
  if (!user && !initializing) return null;

  const systemBooks = books;
  const placeholderCards = [
    { title: "生词本", desc: "网站标记不认识的单词", icon: "🙈" },
    { title: "生词日历", desc: "按日期查看生词记录", icon: "📅" },
    { title: "错词本", desc: "听写出错的单词", icon: "😵" },
    { title: "新建自定义词库", desc: "个人词库 · 后端待接入", icon: "➕" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">继续学习</p>
          <h1 className="text-3xl font-bold mt-1 text-gray-900">词汇学习 · 词库总览</h1>
        </div>
        <div className="text-sm text-gray-600">共 {books.length} 本词库</div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-10 space-y-10">
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">{sections[0].title}</h2>
          <p className="text-sm text-gray-500 mb-4">{sections[0].subtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systemBooks.map((book, idx) => (
              <Link
                key={book.id}
                href={`/vocab/${encodeURIComponent(book.id)}/learn`}
                className="group bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-1 hover:border-primary transition"
              >
                <div className="h-14 w-14 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">
                  {String.fromCodePoint(0x1f4d6 + (idx % 4))}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{book.title}</p>
                  <p className="text-xs text-gray-600 mt-1">词条 {book.total} · 单元 {book.units.length || "-"} </p>
                  <p className="text-[11px] text-primary mt-1">进入记忆 / 复习</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">{sections[1].title}</h2>
          <p className="text-sm text-gray-500 mb-4">{sections[1].subtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {placeholderCards.slice(0, 3).map((card) => (
              <div
                key={card.title}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">
                  {card.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">{sections[2].title}</h2>
          <p className="text-sm text-gray-500 mb-4">{sections[2].subtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">
                {placeholderCards[3].icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{placeholderCards[3].title}</p>
                <p className="text-xs text-gray-600 mt-1">{placeholderCards[3].desc}</p>
                <p className="text-[11px] text-primary mt-1">TODO：后端创建/共享接口</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VocabLanding;

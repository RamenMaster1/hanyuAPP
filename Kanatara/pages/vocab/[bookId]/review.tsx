import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { getVocabBook, getVocabEntries, type VocabBook, type VocabEntry } from "../../../lib/vocabBooks";

type Props = {
  book: VocabBook;
  entries: VocabEntry[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const bookId = context.params?.bookId as string;
  const book = getVocabBook(bookId);
  if (!book) return { notFound: true };
  const all = getVocabEntries(bookId);
  const entries = all.slice(0, 80); // load a chunk for review
  return { props: { book, entries } };
};

type Question = {
  entry: VocabEntry;
  options: string[];
};

const buildQuestion = (entries: VocabEntry[]): Question => {
  const entry = entries[Math.floor(Math.random() * entries.length)];
  const options = [entry.definition];
  while (options.length < 4 && options.length < entries.length) {
    const candidate = entries[Math.floor(Math.random() * entries.length)];
    if (!options.includes(candidate.definition)) options.push(candidate.definition);
  }
  return { entry, options: options.sort(() => Math.random() - 0.5) };
};

const ReviewPage = ({ book, entries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [question, setQuestion] = useState<Question>(() => buildQuestion(entries));
  const [selected, setSelected] = useState<string | null>(null);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  useEffect(() => {
    setQuestion(buildQuestion(entries));
    setSelected(null);
  }, [entries]);

  const isCorrect = useMemo(() => selected && selected === question.entry.definition, [selected, question]);

  const nextQuestion = () => {
    setQuestion(buildQuestion(entries));
    setSelected(null);
  };

  const markUnknown = () => {
    setUnknown((n) => n + 1);
    nextQuestion();
  };

  const markKnown = () => {
    setKnown((n) => n + 1);
    nextQuestion();
  };

  return (
    <>
      <Head>
        <title>{book.title} · 单词复习</title>
      </Head>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">{book.title}</span>
              <span className="text-xs text-gray-500">复习 · 四选一</span>
            </div>
            <div className="flex gap-3 text-gray-700">
              <span>认识 {known}</span>
              <span>不认识 {unknown}</span>
            </div>
          </div>

          <div className="rounded-3xl p-6 shadow-md border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <p className="text-4xl font-semibold text-gray-900">{question.entry.term}</p>
              <button
                onClick={markUnknown}
                className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              >
                不认识
              </button>
            </div>
            {question.entry.example && (
              <p className="text-sm text-gray-600 mb-4">{question.entry.example}</p>
            )}
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const label = String.fromCharCode(65 + idx);
                const active = selected === opt;
                const correct = selected && opt === question.entry.definition;
                return (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      active
                        ? correct
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : "border-rose-400 bg-rose-50 text-rose-800"
                        : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                  >
                    <span className="font-semibold mr-2">{label}.</span> {opt}
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className="flex items-center justify-between mt-6 text-sm text-gray-700">
                <span>{isCorrect ? "答对了！" : `正确答案：${question.entry.definition}`}</span>
                <div className="flex gap-2">
                  <button
                    onClick={markKnown}
                    className="px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    记住了
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                  >
                    下一题
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            TODO：与后端接通艾宾浩斯复习计划与笔记储存（当前为前端演示）。
          </p>
        </div>
      </div>
    </>
  );
};

export default ReviewPage;

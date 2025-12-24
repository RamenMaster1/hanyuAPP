import type { NextApiRequest, NextApiResponse } from "next";
import { getVocabEntries } from "../../../lib/vocabBooks";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { book = "" } = req.query;
  const entries = typeof book === "string" && book ? getVocabEntries(book) : [];
  const sample = entries.slice(0, 20);

  // TODO: Replace with backend-calculated Ebbinghaus schedule per user & book
  return res.status(200).json({
    plan: {
      book: book || null,
      date: new Date().toISOString(),
      words: sample.map((e) => e.term),
      tip: "当前为演示复习计划。待接入用户记忆曲线与服务端存储。",
    },
  });
};

export default handler;

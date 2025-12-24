import type { NextApiRequest, NextApiResponse } from "next";
import { getVocabEntries } from "../../../lib/vocabBooks";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { book, page = "1", pageSize = "20" } = req.query;
  if (typeof book !== "string") {
    return res.status(400).json({ message: "Missing book id" });
  }
  const entries = getVocabEntries(book);
  const p = Math.max(1, parseInt(String(page), 10) || 1);
  const size = Math.max(1, Math.min(100, parseInt(String(pageSize), 10) || 20));
  const start = (p - 1) * size;
  const slice = entries.slice(start, start + size);
  return res.status(200).json({
    book,
    page: p,
    pageSize: size,
    total: entries.length,
    entries: slice,
  });
};

export default handler;

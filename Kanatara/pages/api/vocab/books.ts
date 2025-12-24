import type { NextApiRequest, NextApiResponse } from "next";
import { getVocabBooks } from "../../../lib/vocabBooks";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  const books = getVocabBooks();
  return res.status(200).json({ books });
};

export default handler;

import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookId, entryId, noteDataUrl } = req.body || {};

  // TODO: Persist noteDataUrl (image/blob) to storage tied to user/book/entry.
  // This endpoint is intentionally a stub to mark where backend storage should be added.

  if (!bookId || !entryId || !noteDataUrl) {
    return res.status(400).json({ message: "缺少必要字段 bookId/entryId/noteDataUrl" });
  }

  return res.status(202).json({ message: "已接收笔记（存储 TODO：落盘/对象存储/数据库）" });
};

export default handler;

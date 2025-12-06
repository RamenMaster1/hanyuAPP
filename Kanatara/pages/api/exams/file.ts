import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { resolveExamAssetPath } from "../../../lib/exams";

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".wma": "audio/x-ms-wma",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { exam, file } = req.query;
  if (typeof exam !== "string" || typeof file !== "string") {
    return res.status(400).json({ message: "Missing exam or file" });
  }

  const targetPath = resolveExamAssetPath(exam, file);
  if (!targetPath) {
    return res.status(400).json({ message: "Invalid path" });
  }

  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return res.status(404).json({ message: "File not found" });
  }

  const stat = fs.statSync(targetPath);
  const ext = path.extname(targetPath).toLowerCase();
  const contentType = CONTENT_TYPE_MAP[ext] ?? "application/octet-stream";
  const range = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = Number.parseInt(startStr, 10);
    const end = endStr ? Number.parseInt(endStr, 10) : stat.size - 1;
    if (Number.isNaN(start) || start >= stat.size) {
      res.status(416).end();
      return;
    }
    const chunkEnd = Math.min(end, stat.size - 1);
    const chunkSize = chunkEnd - start + 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${chunkEnd}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": contentType,
    });
    const stream = fs.createReadStream(targetPath, { start, end: chunkEnd });
    stream.pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Length": stat.size,
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
  });
  const stream = fs.createReadStream(targetPath);
  stream.pipe(res);
};

export default handler;

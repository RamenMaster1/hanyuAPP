import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { listExamManifests, makeExamTitle } from "../../../lib/exams";

const buildFileUrl = (examId: string, relativePath?: string | null) => {
  if (!relativePath) return null;
  const normalized = relativePath.replace(/\\/g, "/");
  return `/api/exams/file?exam=${encodeURIComponent(examId)}&file=${encodeURIComponent(normalized)}`;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const manifests = listExamManifests();
  const exams = manifests.map((manifest) => ({
    id: manifest.id,
    title: makeExamTitle(manifest),
    pdfUrl: buildFileUrl(manifest.id, manifest.pdfFile),
    answerUrl: buildFileUrl(manifest.id, manifest.answerFile),
    audioFiles: manifest.audioFiles.map((file) => ({
      name: file,
      url: buildFileUrl(manifest.id, path.join(manifest.audioFolder ?? "", file)),
    })),
    answerKey: manifest.answerKey,
    meta: manifest.examInfo,
    questionCount: manifest.answerKey.length,
    hasPdf: Boolean(manifest.pdfFile),
    hasAnswer: Boolean(manifest.answerFile),
  }));

  return res.status(200).json({ exams });
};

export default handler;

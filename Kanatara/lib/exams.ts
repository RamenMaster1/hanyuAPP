import fs from "fs";
import path from "path";

export const EXAMS_ROOT = path.join(process.cwd(), "exams");
const AUDIO_EXTS = [".mp3", ".wma", ".wav", ".m4a"];

export type AnswerKeyItem = {
  questionNumber: number;
  answer: number;
  points?: number;
  section?: string;
};

export type ExamManifest = {
  id: string;
  folderPath: string;
  pdfFile?: string;
  answerFile?: string;
  audioFolder?: string;
  audioFiles: string[];
  answerKey: AnswerKeyItem[];
  examInfo?: {
    year?: string;
    session?: string;
    level?: string;
    type?: string;
  };
};

const normalizeNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

export const isAudioFile = (fileName: string): boolean =>
  AUDIO_EXTS.includes(path.extname(fileName).toLowerCase());

const readAnswerFile = (filePath: string): { answerKey: AnswerKeyItem[]; examInfo?: Record<string, string> } => {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    if (!raw.trim()) {
      return { answerKey: [] };
    }
    const data = JSON.parse(raw);
    const examInfo = data.exam_info ?? undefined;
    const combined: AnswerKeyItem[] = [];

    const append = (question: unknown, answer: unknown, section?: string, points?: unknown) => {
      const qNum = normalizeNumber(question);
      const ans = normalizeNumber(answer);
      if (qNum === null || ans === null) return;
      const pointValue = normalizeNumber(points) ?? undefined;
      combined.push({ questionNumber: qNum, answer: ans, section, points: pointValue });
    };

    const extractFromArray = (items: unknown, label: string) => {
      if (!Array.isArray(items)) return;
      items.forEach((item: any) => {
        append(item.question_number ?? item.question, item.answer, label, item.points);
      });
    };

    extractFromArray(data.listening_answers, "听力");
    extractFromArray(data.reading_answers, "阅读");

    if (Array.isArray(data.sections)) {
      data.sections.forEach((section: any) => {
        const sectionLabel = section.section_info?.area ?? section.section_info?.round ?? "Section";
        if (Array.isArray(section.answers)) {
          section.answers.forEach((entry: any) => {
            append(entry.question ?? entry.question_number, entry.answer, sectionLabel, entry.points);
          });
        }
      });
    }

    return { answerKey: combined, examInfo };
  } catch (error) {
    console.error("Failed to read answer file", filePath, error);
    return { answerKey: [] };
  }
};

const buildExamManifest = (examId: string): ExamManifest | null => {
  const folderPath = path.join(EXAMS_ROOT, examId);
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return null;
  }

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const pdfFile = entries.find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))?.name;
  const answerFile = entries.find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))?.name;
  const audioFolder = entries.find(
    (entry) =>
      entry.isDirectory() &&
      fs
        .readdirSync(path.join(folderPath, entry.name))
        .some((fileName) => isAudioFile(fileName)),
  )?.name;

  const audioFiles =
    audioFolder && fs.existsSync(path.join(folderPath, audioFolder))
      ? fs
          .readdirSync(path.join(folderPath, audioFolder))
          .filter((name) => isAudioFile(name))
          .sort((a, b) => a.localeCompare(b, "en"))
      : [];

  const { answerKey, examInfo } = answerFile
    ? readAnswerFile(path.join(folderPath, answerFile))
    : { answerKey: [], examInfo: undefined };

  return {
    id: examId,
    folderPath,
    pdfFile,
    answerFile,
    audioFolder,
    audioFiles,
    answerKey,
    examInfo,
  };
};

export const listExamManifests = (): ExamManifest[] => {
  if (!fs.existsSync(EXAMS_ROOT)) return [];
  const dirs = fs.readdirSync(EXAMS_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());
  return dirs
    .map((dir) => buildExamManifest(dir.name))
    .filter((item): item is ExamManifest => Boolean(item))
    .sort((a, b) => a.id.localeCompare(b.id, "en"));
};

export const makeExamTitle = (manifest: ExamManifest): string => {
  const { examInfo } = manifest;
  if (examInfo) {
    const parts: string[] = [];
    if (examInfo.year) {
      const prefix = examInfo.session ? `${examInfo.year}-${examInfo.session}` : examInfo.year;
      parts.push(prefix);
    } else if (examInfo.session) {
      parts.push(examInfo.session);
    }
    if (examInfo.level) parts.push(examInfo.level);
    if (examInfo.type) parts.push(examInfo.type);
    const title = parts.filter(Boolean).join(" ");
    if (title) return title;
  }
  return manifest.id;
};

export const resolveExamAssetPath = (examId: string, relativePath: string): string | null => {
  const sanitizedExam = examId.replace(/[/\\]/g, "");
  const safeRelative = relativePath
    .split(/[\\/]/)
    .filter((part) => part && part !== "." && part !== "..")
    .join(path.sep);
  const absolute = path.resolve(path.join(EXAMS_ROOT, sanitizedExam, safeRelative));
  const examRoot = path.resolve(path.join(EXAMS_ROOT, sanitizedExam));
  if (!absolute.startsWith(examRoot)) {
    return null;
  }
  return absolute;
};

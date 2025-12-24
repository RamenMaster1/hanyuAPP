import fs from "fs";
import path from "path";

export const VOCAB_ROOT = path.join(process.cwd(), "vocabularies");

export type VocabEntry = {
  id: string;
  term: string;
  definition: string;
  example: string | null;
  synonyms: string[];
  antonyms: string[];
  related: string | null;
  unit: string | null;
  pos: string | null;
  bookId: string;
  sourceFile: string;
};

export type VocabBook = {
  id: string;
  title: string;
  files: string[];
  total: number;
  units: string[];
};

const trimToBalancedRoot = (input: string): string => {
  let depth = 0;
  let inString = false;
  let escape = false;
  let lastBalanced = -1;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{" || ch === "[") {
      depth += 1;
    } else if (ch === "}" || ch === "]") {
      if (depth > 0) depth -= 1;
    }

    if (depth === 0) {
      lastBalanced = i;
    }
  }

  if (lastBalanced !== -1 && lastBalanced < input.length - 1) {
    return input.slice(0, lastBalanced + 1);
  }
  return input;
};

const appendMissingClosings = (input: string): string => {
  const stack: string[] = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === "{" || ch === "[") {
      stack.push(ch);
    } else if (ch === "}" || ch === "]") {
      const expected = ch === "}" ? "{" : "[";
      if (stack[stack.length - 1] === expected) {
        stack.pop();
      }
    }
  }

  if (!stack.length) return input;

  const closings = stack
    .reverse()
    .map((ch) => (ch === "{" ? "}" : "]"))
    .join("");

  return input + closings;
};

const sanitizeJsonText = (text: string): string => {
  let sanitized = text.replace(/\uFEFF/g, ""); // BOM
  sanitized = sanitized.replace(/\uFF0C/g, ",").replace(/\uFF1B/g, ";").replace(/\uFF1A/g, ":"); // full-width punctuation

  // Drop inline cite/note markers and trailing markdown/code fences
  sanitized = sanitized.replace(/\[cite[^\]]*]/gi, "");
  sanitized = sanitized.replace(/\[note[^\]]*]/gi, "");
  sanitized = sanitized.replace(/```[\s\S]*/g, "");

  // Repair common structural issues
  sanitized = sanitized.replace(/}\s*{/g, "},{");
  sanitized = sanitized.replace(/]\s*{/g, "],{");
  sanitized = sanitized.replace(/}\s*\[/g, "},{[");
  sanitized = sanitized.replace(/,(?=\s*[}\]])/g, "");

  const trimmed = sanitized.trimStart();
  if (trimmed.startsWith('"vocabulary_units"')) {
    sanitized = `{${sanitized}`;
  }

  sanitized = trimToBalancedRoot(sanitized);
  sanitized = appendMissingClosings(sanitized);
  sanitized = sanitized.replace(/,(?=\s*[}\]])/g, "");

  return sanitized;
};

const safeParse = (text: string, filePath: string): any => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse vocab json", filePath, error);
    return null;
  }
};

const normalizeEntry = (raw: any, bookId: string, sourceFile: string, unit?: string): VocabEntry | null => {
  if (!raw) return null;
  const id = String(raw.id ?? raw.term ?? raw.word ?? raw.korean ?? raw.word_id ?? raw.wordId ?? Math.random());
  const term = raw.term ?? raw.word ?? raw.korean ?? raw.vocab ?? raw.entry ?? "";
  const definition = raw.definition ?? raw.meaning ?? raw.chinese ?? raw.translation ?? raw.gloss ?? "";
  if (!term || !definition) return null;
  const example = raw.example ?? raw.examples ?? raw.sample ?? raw.sentence ?? null;
  const pos = raw.pos ?? raw.type ?? raw.word_type ?? raw.part_of_speech ?? null;
  const synonyms = raw.synonym ? String(raw.synonym).split(/[,，、/]/).filter(Boolean) : [];
  const antonyms = raw.antonym ? String(raw.antonym).split(/[,，、/]/).filter(Boolean) : [];
  const related = raw.related ?? raw.hanja_loan ?? raw.origin ?? raw.note ?? null;

  return {
    id,
    term,
    definition,
    example,
    synonyms,
    antonyms,
    related,
    unit: unit ?? null,
    pos,
    bookId,
    sourceFile,
  };
};

const loadBookFile = (bookId: string, filePath: string): VocabEntry[] => {
  const rawText = fs.readFileSync(filePath, "utf-8");
  const sanitized = sanitizeJsonText(rawText);
  const parsed = safeParse(sanitized, filePath);
  if (!parsed) return [];

  const entries: VocabEntry[] = [];
  const fileName = path.basename(filePath);

  const pushAll = (items: any[], unit?: string) => {
    items.forEach((item) => {
      const norm = normalizeEntry(item, bookId, fileName, unit);
      if (norm) entries.push(norm);
    });
  };

  if (Array.isArray(parsed)) {
    // e.g., TOPIK, 首尔大教材 (with nested words)
    if (parsed.length && parsed[0].words) {
      parsed.forEach((lesson: any) => pushAll(lesson.words ?? [], lesson.lesson ?? lesson.book));
    } else if (parsed.length && parsed[0].vocabulary) {
      parsed.forEach((chapter: any) => pushAll(chapter.vocabulary ?? [], chapter.chapter_title));
    } else {
      pushAll(parsed);
    }
  } else if (parsed.vocabulary_units) {
    parsed.vocabulary_units.forEach((unit: any) => pushAll(unit.words ?? [], unit.unit_id ?? unit.title));
  } else if (parsed.content && typeof parsed.content === "object") {
    Object.entries(parsed.content).forEach(([unitKey, items]: any) => {
      if (Array.isArray(items)) pushAll(items, unitKey);
    });
  }

  return entries;
};

export const loadAllVocabBooks = (): { books: VocabBook[]; entries: Record<string, VocabEntry[]> } => {
  const books: VocabBook[] = [];
  const entriesByBook: Record<string, VocabEntry[]> = {};

  if (!fs.existsSync(VOCAB_ROOT)) return { books, entries: entriesByBook };

  const dirs = fs.readdirSync(VOCAB_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());
  dirs.forEach((dir) => {
    const bookId = dir.name;
    const folder = path.join(VOCAB_ROOT, dir.name);
    const files = fs.readdirSync(folder).filter((f) => f.toLowerCase().endsWith(".json"));

    let bookEntries: VocabEntry[] = [];
    files.forEach((file) => {
      const full = path.join(folder, file);
      bookEntries = bookEntries.concat(loadBookFile(bookId, full));
    });

    const units = Array.from(new Set(bookEntries.map((e) => e.unit).filter(Boolean))) as string[];
    books.push({
      id: bookId,
      title: bookId,
      files,
      total: bookEntries.length,
      units,
    });
    entriesByBook[bookId] = bookEntries;
  });

  return { books, entries: entriesByBook };
};

let cachedBooks: VocabBook[] | null = null;
let cachedEntries: Record<string, VocabEntry[]> | null = null;

export const getVocabBooks = (): VocabBook[] => {
  if (!cachedBooks || !cachedEntries) {
    const { books, entries } = loadAllVocabBooks();
    cachedBooks = books;
    cachedEntries = entries;
  }
  return cachedBooks;
};

export const getVocabEntries = (bookId: string): VocabEntry[] => {
  if (!cachedEntries || !cachedBooks) {
    const { books, entries } = loadAllVocabBooks();
    cachedBooks = books;
    cachedEntries = entries;
  }
  return cachedEntries?.[bookId] ?? [];
};

export const getVocabBook = (bookId: string): VocabBook | undefined => {
  return getVocabBooks().find((b) => b.id === bookId);
};

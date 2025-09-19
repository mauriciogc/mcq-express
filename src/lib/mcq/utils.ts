// src/lib/mcq/utils.ts
import type {
  MCQPool,
  MCQQuestion,
  QuizSettings,
  UserAnswerMap,
} from '@/lib/types';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  const s = Math.max(1, size);
  for (let i = 0; i < arr.length; i += s) out.push(arr.slice(i, i + s));
  return out;
}

export function buildBlocks(
  pool: MCQPool | null,
  settings: QuizSettings
): MCQQuestion[][] {
  if (!pool) return [];
  const list = settings.shuffleEnabled
    ? shuffle(pool.questions)
    : pool.questions;
  return chunk(list, settings.blockSize);
}

export interface GradedResult {
  id: string;
  isCorrect: boolean;
  chosen: string[];
  correct: string[];
}

export function gradeBlock(
  questions: MCQQuestion[],
  answers: UserAnswerMap
): GradedResult[] {
  return questions.map((q) => {
    const chosen = new Set(answers[q.id] ?? []);
    const correct = new Set(q.answer);
    const isCorrect =
      chosen.size === correct.size && [...correct].every((x) => chosen.has(x));
    return { id: q.id, isCorrect, chosen: [...chosen], correct: [...correct] };
  });
}

export function safeExtractQuestions(raw: string): MCQQuestion[] {
  try {
    const i = raw.indexOf('[');
    if (i >= 0) return JSON.parse(raw.slice(i)) as MCQQuestion[];
    return [];
  } catch {
    return [];
  }
}

type AIResponse =
  | MCQQuestion[]
  | { questions: MCQQuestion[] }
  | { raw: string };

export function normalizeAIExtras(
  pool: MCQPool,
  data: AIResponse
): MCQQuestion[] {
  const base: unknown = Array.isArray(data)
    ? data
    : 'questions' in data
    ? data.questions
    : 'raw' in data && typeof data.raw === 'string'
    ? safeExtractQuestions(data.raw)
    : [];

  const arr: unknown[] = Array.isArray(base) ? base : [];

  const existingIds = new Set(pool.questions.map((q) => q.id));
  const extraCoerced = arr
    .map((q, idx) => coerceAIQuestion(q, idx, existingIds))
    .filter((q): q is MCQQuestion => q !== null);

  return extraCoerced;
}

function coerceAIQuestion(
  q: unknown,
  idx: number,
  existingIds: Set<string>
): MCQQuestion | null {
  if (typeof q !== 'object' || q === null) return null;
  const obj = q as Partial<MCQQuestion> & {
    options?: Array<Partial<{ id: string; text: string }>>;
    answer?: unknown[];
    type?: unknown;
    explanation?: unknown;
  };

  const baseId =
    typeof obj.id === 'string' && obj.id.trim()
      ? obj.id.trim()
      : `ai-${Date.now()}-${idx}`;
  let id = baseId;
  let n = 1;
  while (existingIds.has(id)) id = `${baseId}-${n++}`;
  existingIds.add(id);

  const options = Array.isArray(obj.options)
    ? obj.options
        .map((o, j) => ({
          id: String(o?.id ?? `opt-${j}`),
          text: String(o?.text ?? `Opción ${j + 1}`),
        }))
        .filter((o) => !!o.text)
    : [];

  const answer = Array.isArray(obj.answer)
    ? obj.answer.map((x) => String(x))
    : [];

  const prompt =
    typeof obj.prompt === 'string' && obj.prompt.trim()
      ? obj.prompt.trim()
      : `Pregunta generada #${idx + 1}`;

  const type: 'radio' | 'checkbox' =
    obj.type === 'checkbox' ? 'checkbox' : 'radio';

  if (!prompt || options.length < 2 || answer.length < 1) return null;

  return {
    id,
    type,
    prompt,
    options,
    answer,
    explanation:
      typeof obj.explanation === 'string' ? obj.explanation : undefined,
    source: 'ai',
  };
}

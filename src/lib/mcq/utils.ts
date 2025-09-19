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

export function gradeBlock(questions: MCQQuestion[], answers: UserAnswerMap) {
  return questions.map((q) => {
    const chosen = new Set(answers[q.id] ?? []);
    const correct = new Set(q.answer);
    const isCorrect =
      chosen.size === correct.size && [...correct].every((x) => chosen.has(x));
    return { id: q.id, isCorrect, chosen: [...chosen], correct: [...correct] };
  });
}

export function safeExtractQuestions(raw: string): any[] {
  try {
    const i = raw.indexOf('[');
    if (i >= 0) return JSON.parse(raw.slice(i));
    return [];
  } catch {
    return [];
  }
}

export function normalizeAIExtras(pool: MCQPool, data: any): MCQQuestion[] {
  const normalizeArray = (maybe: any): any[] =>
    Array.isArray(maybe) ? maybe : [];
  const base = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.questions)
    ? (data as any).questions
    : typeof (data as any)?.raw === 'string'
    ? safeExtractQuestions((data as any).raw)
    : [];

  const existingIds = new Set(pool.questions.map((q) => q.id));
  const extraCoerced = normalizeArray(base)
    .map((q: any, idx: number) => coerceAIQuestion(q, idx, existingIds))
    .filter(Boolean) as MCQQuestion[];

  return extraCoerced;
}

function coerceAIQuestion(
  q: any,
  idx: number,
  existingIds: Set<string>
): MCQQuestion | null {
  const baseId =
    typeof q?.id === 'string' && q.id.trim()
      ? q.id.trim()
      : `ai-${Date.now()}-${idx}`;
  let id = baseId;
  let n = 1;
  while (existingIds.has(id)) id = `${baseId}-${n++}`;
  existingIds.add(id);

  const options = Array.isArray(q?.options)
    ? q.options
        .map((o: any, j: number) => ({
          id: String(o?.id ?? `opt-${j}`),
          text: String(o?.text ?? `Opción ${j + 1}`),
        }))
        .filter((o: any) => o.text)
    : [];

  const answer = Array.isArray(q?.answer)
    ? q.answer.map((x: any) => String(x))
    : [];
  const prompt =
    String(q?.prompt ?? '').trim() || `Pregunta generada #${idx + 1}`;
  const type: 'radio' | 'checkbox' =
    q?.type === 'checkbox' ? 'checkbox' : 'radio';

  if (!prompt || options.length < 2 || answer.length < 1) return null;

  return {
    id,
    type,
    prompt,
    options,
    answer,
    explanation: q?.explanation ? String(q.explanation) : undefined,
    source: 'ai',
  };
}

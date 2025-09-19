// src/lib/mcq/ai.ts
import type { MCQPool, MCQQuestion } from '@/lib/types';

// --- Tipos auxiliares ---
export interface AIMistake {
  id: string;
  chosen: string[];
  correct: string[];
  // si tu gradeBlock retorna más props (ej. isCorrect), agrega aquí
}

export interface AIExplainResponse {
  explanations?: Record<string, string>;
}

// --- Funciones ---

export async function aiAugment(
  pool: MCQPool,
  count: number
): Promise<MCQQuestion[]> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'augment', pool, augmentCount: count }),
  });
  if (!res.ok) throw new Error('AI augment error');
  return res.json() as Promise<MCQQuestion[]>;
}

export async function aiExplain(
  mistakes: AIMistake[],
  questionsPool: { questions: MCQQuestion[] }
): Promise<AIExplainResponse> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'explain', mistakes, pool: questionsPool }),
  });
  if (!res.ok) throw new Error('AI explain error');
  return res.json() as Promise<AIExplainResponse>;
}

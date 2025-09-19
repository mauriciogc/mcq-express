// src/lib/mcq/ai.ts
import type { MCQPool } from '@/lib/types';

export async function aiAugment(pool: MCQPool, count: number) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'augment', pool, augmentCount: count }),
  });
  if (!res.ok) throw new Error('AI augment error');
  return res.json();
}

export async function aiExplain(
  mistakes: any[],
  questionsPool: { questions: any[] }
) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'explain', mistakes, pool: questionsPool }),
  });
  if (!res.ok) throw new Error('AI explain error');
  return res.json();
}

// src/components/mcq/FinalResultsPanel.tsx
'use client';
import React, { useMemo } from 'react';
import type { MCQQuestion, UserAnswerMap } from '@/lib/types';
import { RankingIcon } from '@phosphor-icons/react';

interface Props {
  allQuestions: MCQQuestion[];
  answers: UserAnswerMap;
}

export default function FinalResultsPanel({ allQuestions, answers }: Props) {
  const { total, correct, pct } = useMemo(() => {
    let total = allQuestions.length;
    let correct = 0;
    for (const q of allQuestions) {
      const chosen = new Set(answers[q.id] ?? []);
      const ans = new Set(q.answer);
      const ok =
        chosen.size === ans.size && Array.from(ans).every((x) => chosen.has(x));
      if (ok) correct += 1;
    }
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return { total, correct, pct };
  }, [allQuestions, answers]);

  const scoreVariant = pct >= 80 ? 'mint' : 'coral';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[var(--color-card)] p-5 shadow">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <RankingIcon size={32} aria-hidden />
          <span>Resultados finales</span>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-3xl font-bold">{correct}</p>
            <p className="text-sm opacity-80">Respuestas correctas</p>
          </div>
          <div className="card">
            <p className="text-3xl font-bold">{total - correct}</p>
            <p className="text-sm opacity-80">Respuestas incorrectas</p>
          </div>
          <div className="card">
            <div
              className="progress"
              data-variant={scoreVariant}
              aria-label="Porcentaje total"
            >
              <div className="bar" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-sm opacity-80">Puntaje: {pct}%</p>
          </div>
        </div>
      </div>

      <p className="text-sm opacity-80">
        Puedes reiniciar desde el botón de arriba para comenzar de nuevo o
        ajustar la configuración en Setup.
      </p>
    </div>
  );
}

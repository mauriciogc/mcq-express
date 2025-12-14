// src/components/mcq/ResultsPanel.tsx
'use client';
import React, { useMemo } from 'react';
import type { MCQQuestion, UserAnswerMap } from '@/lib/types';
import { ChatCenteredDotsIcon, RobotIcon } from '@phosphor-icons/react';
import { FrostedModal } from '../ui/FrostedModal';

interface Props {
  questions: MCQQuestion[];
  answers: UserAnswerMap;
  explanations: Record<string, string> | null;
  loadingAI: boolean;
}

export default function ResultsPanel({
  questions,
  answers,
  explanations,
  loadingAI,
}: Props) {
  const rows = useMemo(() => {
    return questions.map((q) => {
      const chosen = new Set(answers[q.id] ?? []);
      const correct = new Set(q.answer);
      const ok =
        chosen.size === correct.size &&
        [...correct].every((x) => chosen.has(x));
      return { q, chosen, correct, ok };
    });
  }, [questions, answers]);

  const score = rows.filter((r) => r.ok).length;
  const total = rows.length || 1;
  const pct = Math.round((score / total) * 100);
  const scoreVariant = pct >= 80 ? 'mint' : 'coral';

  const optionBase =
    'w-full flex items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-sm transition-colors';
  const optionNeutral = 'bg-[var(--color-card)] text-[var(--color-text)]';
  const optionRight = 'bg-[var(--mint-500)] text-[var(--mint-900)]';
  const optionWrong = 'bg-[var(--coral-50)] text-[var(--coral-900)]';

  return (
    <div className="space-y-6 text-text">
      <div className="header-card bg-card/90 p-6 space-y-2 border-0">
        <div className="progress" data-variant={scoreVariant}>
          <span className="bar" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted">
          Preguntas: <strong>{rows.length}</strong> · Puntaje:{' '}
          <strong>{score}</strong>/{rows.length} (<strong>{pct}%</strong>)
        </p>
      </div>

      {loadingAI && (
        <FrostedModal
          title="Generando explicaciones con la IA."
          description="Espera un momento..."
          icon={
            <RobotIcon
              size={96}
              className="text-(--lilac-500)/80"
              weight="thin"
            />
          }
        />
      )}

      <ul className="space-y-5">
        {rows.map(({ q, chosen, correct, ok }) => {
          const chosenIds = [...chosen];
          const correctIds = [...correct];
          const textById = new Map(q.options.map((o) => [o.id, o.text]));
          const failed =
            chosenIds.some((id) => !correct.has(id)) ||
            chosen.size !== correct.size;

          // Card base con radio correcto y barra superior redondeada
          const cardBase =
            'relative overflow-hidden rounded-[var(--radius-xl)] p-4 bg-[var(--color-card)] header-card shadow-xl border-0';

          return (
            <li key={q.id} className={cardBase}>
              {/* Barra superior (gradiente y respeta el radio) */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-3 w-full"
                style={{
                  background: ok
                    ? 'linear-gradient(90deg, var(--mint-200), var(--mint-400))'
                    : 'linear-gradient(90deg, var(--coral-200), var(--coral-400))',
                }}
              />

              {/* Prompt */}
              <p className="font-medium">{q.prompt}</p>

              {/* Opciones */}
              <div className="mt-3 space-y-2 bord" role="list">
                {q.options.map((opt) => {
                  const checked = chosen.has(opt.id);
                  const isRight = correct.has(opt.id);

                  let cls = optionNeutral;
                  if (checked && isRight) cls = optionRight;
                  // correcto seleccionado: pastel + contorno mint
                  else if (checked && !isRight) cls = optionWrong; // incorrecto seleccionado: SOLO contorno coral

                  return (
                    <div
                      key={opt.id}
                      role="listitem"
                      className={`${optionBase} ${cls}`}
                    >
                      <span>{textById.get(opt.id) ?? opt.id}</span>
                    </div>
                  );
                })}
              </div>

              {failed && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs tracking-wide text-muted">
                    Respuesta correcta
                  </div>
                  {correctIds.map((id) => (
                    <div
                      key={`correct-${id}`}
                      className={`${optionBase} ${optionRight}`}
                    >
                      <span>{textById.get(id) ?? id}</span>
                    </div>
                  ))}
                </div>
              )}

              {(q.explanation || explanations?.[q.id]) && (
                <div className="mt-3 flex flex-col text-sm gap-3">
                  {q.explanation && (
                    <p className="flex gap-2 items-center bg-[var(--sky-50)] p-2 rounded-lg">
                      <ChatCenteredDotsIcon
                        size={24}
                        className="min-w-10 text-[var(--sky-500)]"
                      />
                      {q.explanation}
                    </p>
                  )}
                  {explanations?.[q.id] && (
                    <p className="flex gap-2 items-center bg-[var(--lilac-50)] p-2 rounded-lg">
                      <RobotIcon
                        size={24}
                        className="min-w-10 text-[var(--lilac-500)]"
                      />
                      {explanations?.[q.id]}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="h-30" aria-hidden />
    </div>
  );
}

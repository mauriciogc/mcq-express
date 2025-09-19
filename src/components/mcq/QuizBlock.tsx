// src/components/mcq/QuizBlock.tsx
'use client';
import React from 'react';
import type { MCQQuestion, UserAnswerMap } from '@/lib/types';
import QuestionCard from './QuestionCard';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr';

interface Props {
  activeQuestions: MCQQuestion[];
  answers: UserAnswerMap;
  onAnswer: (q: MCQQuestion, optionId: string, checked: boolean) => void;
  blocksCount: number;
  currentBlock: number;
  setCurrentBlock: (fn: (b: number) => number) => void;
}

export default function QuizBlock({
  activeQuestions,
  answers,
  onAnswer,
  blocksCount,
  currentBlock,
  setCurrentBlock,
}: Props) {
  const hasPrev = currentBlock > 0;
  const hasNext = currentBlock < blocksCount - 1;

  return (
    <div className="space-y-6 text-[var(--color-text)]">
      <ul className="space-y-5">
        {activeQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            q={q}
            answers={answers}
            onAnswer={onAnswer}
          />
        ))}
      </ul>
      <div className="flex items-center justify-between">
        {hasPrev ? (
          <button
            type="button"
            onClick={() => setCurrentBlock((b) => Math.max(0, b - 1))}
            className="btn-secondary"
            title="Anterior"
          >
            <ArrowLeftIcon size={18} aria-hidden />
            <span>Anterior</span>
          </button>
        ) : (
          <span />
        )}
        {hasNext ? (
          <button
            type="button"
            onClick={() =>
              setCurrentBlock((b) => Math.min(blocksCount - 1, b + 1))
            }
            className="btn-secondary"
            title="Siguiente"
          >
            <ArrowRightIcon size={18} aria-hidden />
            <span>Siguiente</span>
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

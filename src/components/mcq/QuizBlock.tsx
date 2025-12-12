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
}

export default function QuizBlock({
  activeQuestions,
  answers,
  onAnswer,
}: Props) {
  return (
    <div className="space-y-6 text-text">
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
      <div className="h-30" aria-hidden />
    </div>
  );
}

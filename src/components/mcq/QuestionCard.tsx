// src/components/mcq/QuestionCard.tsx
'use client';
import React from 'react';
import type { MCQQuestion, UserAnswerMap } from '@/lib/types';
import { Checkbox, Radio } from '@/components/ui/Choice';
import { RobotIcon } from '@phosphor-icons/react';

interface Props {
  q: MCQQuestion;
  answers: UserAnswerMap;
  onAnswer: (q: MCQQuestion, optionId: string, checked: boolean) => void;
}

export default function QuestionCard({ q, answers, onAnswer }: Props) {
  const selected = new Set(answers[q.id] ?? []);
  const isRadio = q.type === 'radio';

  return (
    <li className=" header-card shadow-xl p-6 bg-card">
      <p className="font-medium mb-3 text-text">
        {q.prompt}
        {q.source == 'ai' && (
          <span className="ml-2 text-xs px-3 py-0.5 rounded-lg bg-[var(--lilac-200)] text-[var(--lilac-800)] inline-flex items-center gap-1">
            <RobotIcon size={12} />
            IA
          </span>
        )}
      </p>

      <div className="space-y-2">
        {q.options.map((opt) => {
          const isChecked = selected.has(opt.id);
          const name = `q-${q.id}`;

          return isRadio ? (
            <Radio
              key={opt.id}
              name={name}
              checked={isChecked}
              onChange={() => onAnswer(q, opt.id, true)}
              label={opt.text}
            />
          ) : (
            <Checkbox
              key={opt.id}
              checked={isChecked}
              onChange={(v) => onAnswer(q, opt.id, v)}
              label={opt.text}
            />
          );
        })}
      </div>
    </li>
  );
}

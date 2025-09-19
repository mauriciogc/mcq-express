// src/components/mcq/SetupPanel.tsx
'use client';
import React, { useRef, useState } from 'react';
import type { MCQPool, QuizSettings } from '@/lib/types';
import SetupPanelPretty from '@/components/mcq/SetupPanelPretty';

import { CloudArrowUpIcon, RobotIcon } from '@phosphor-icons/react';
import { FrostedModal } from '../ui/FrostedModal';

interface Props {
  pool: MCQPool | null;
  settings: QuizSettings;
  setSettings: (updater: (s: QuizSettings) => QuizSettings) => void;
  onLoadFile: (file: File) => Promise<void>;
  loadingAI: boolean;
  hasAI: boolean;
}

export default function SetupPanel({
  pool,
  settings,
  setSettings,
  onLoadFile,
  loadingAI,
  hasAI,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const handleFile = async (f?: File) => {
    if (!f) return;
    await onLoadFile(f);
    setDragging(false);
  };

  const clsDragging = isDragging
    ? 'border-[var(--lilac-300)] bg-[var(--lilac-50)]'
    : 'border-[var(--color-border)]';

  return (
    <div className="space-y-6 text-[var(--color-text)]">
      {loadingAI && (
        <FrostedModal
          title="Generando nuevas preguntas con IA."
          description="Espera un momento..."
          icon={
            <RobotIcon
              size={96}
              className="text-[var(--lilac-500)]/80"
              weight="thin"
            />
          }
        />
      )}
      {!pool && (
        <div
          className={`header-card p-6 sm:p-8 bg-[var(--color-card)]/80  ${clsDragging} transition-colors cursor-pointer`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-1 text-center text-[var(--color-text)]">
            <CloudArrowUpIcon aria-hidden size={32} />

            <p className="font-medium inline-flex items-center gap-2">
              Haz clic aquí para subir tu archivo o arrástralo
            </p>
            <p className="text-xs text-[var(--color-muted)]">
              Formato soportado: .json
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        </div>
      )}
      {pool && (
        <div className="mt-8">
          <SetupPanelPretty
            settings={settings}
            setSettings={setSettings}
            hasAI={hasAI}
          />
        </div>
      )}
    </div>
  );
}

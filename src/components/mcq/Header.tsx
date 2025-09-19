'use client';
import React from 'react';
import type { MCQPool, QuizSettings } from '@/lib/types';
import {
  PlayIcon,
  ArrowLeftIcon,
  ReadCvLogoIcon,
  ArrowsClockwiseIcon,
  CarrotIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import { FriendlySummary } from './FriendlySummary';

type Phase = 'setup' | 'quiz' | 'results';

const LABEL_PHASE = {
  setup: 'Setup',
  quiz: 'En curso',
  results: 'Resultados',
};

interface Props {
  phase: Phase;
  pool: MCQPool | null;
  total: number;
  baseCount: number;
  aiCount: number;
  loadingAI: boolean;
  settings: QuizSettings;
  onStart: () => void;
  onBackToSetup: () => void;
  onFinishBlock: () => void;
  onBackToBlock: () => void;
  onReset: () => void;
}

const phaseBadgeClass: Record<Phase, string> = {
  setup: 'badge badge-lilac',
  quiz: 'badge badge-sky',
  results: 'badge badge-mint',
};

export default function MCQHeader({
  phase,
  pool,
  total,
  baseCount,
  aiCount,
  loadingAI,
  settings,
  onStart,
  onBackToSetup,
  onFinishBlock,
  onBackToBlock,
  onReset,
}: Props) {
  const Title = () => (
    <div className="flex items-center gap-2.5 justify-between">
      <div className="flex items-center ">
        <div
          className="grid place-items-center text-[var(--coral-400)] p-2"
          aria-hidden
        >
          <CarrotIcon size={32} aria-hidden />
        </div>
        <div className=" text-[var(--color-text)]">
          <h1 className="text-3xl ">Questify</h1>
          <p className="mt-0.5 text-sm">
            La forma más rápida de aprender respondiendo
          </p>
        </div>
      </div>
      <span className={`${phaseBadgeClass[phase]} badge-compact`}>
        {LABEL_PHASE[phase] ?? phase}
      </span>
    </div>
  );

  const RightActions = () => {
    if (phase == 'setup' && !pool) {
      return (
        <div className="flex items-center justify-center">
          <a href="/sample-pool.json" download className="btn">
            <DownloadSimpleIcon size={22} aria-hidden />
            <span>Ejemplo</span>
          </a>
        </div>
      );
    }

    if (phase === 'setup') {
      return (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="btn"
            title="Reiniciar"
          >
            <ArrowsClockwiseIcon size={22} aria-hidden />
            <span>Reiniciar</span>
          </button>
          <button
            type="button"
            onClick={onStart}
            disabled={loadingAI}
            className="btn"
          >
            <PlayIcon size={22} aria-hidden />
            <span>{loadingAI ? 'Prep…' : 'Comenzar'}</span>
          </button>
        </div>
      );
    }

    if (phase === 'quiz') {
      return (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBackToSetup}
            className="btn"
            title="Volver a configuración"
          >
            <ArrowLeftIcon size={22} aria-hidden />
            Config
          </button>
          <button
            type="button"
            onClick={onFinishBlock}
            className="btn"
            title="Finalizar bloque actual"
          >
            <ReadCvLogoIcon size={22} aria-hidden />
            Evaluar
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBackToBlock}
          className="btn"
          title="Finalizar bloque actual"
        >
          <ArrowLeftIcon size={22} aria-hidden />
          <span>Volver</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="btn"
          title="Reiniciar"
        >
          <ArrowsClockwiseIcon size={22} aria-hidden />
          <span>Reiniciar</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <Title />
      <div className="w-full header-card p-3">
        <div className="flex flex-col md:flex-row items-center gap-3.5 md:gap-5">
          {pool && (
            <div className="rounded-lg bg-white shadow-lg p-2">
              <FriendlySummary
                total={total}
                baseCount={baseCount}
                aiCount={aiCount}
                blockSize={settings.blockSize}
                shuffleEnabled={settings.shuffleEnabled}
                allowAIExplain={settings.allowAIExplain}
              />
            </div>
          )}
          <div className="md:ml-auto">
            <RightActions />
          </div>
        </div>
      </div>
    </>
  );
}

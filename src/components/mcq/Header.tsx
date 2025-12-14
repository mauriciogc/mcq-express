'use client';
import React from 'react';
import type { MCQPool, QuizSettings } from '@/lib/types';
import {
  PlayIcon,
  SlidersIcon,
  ReadCvLogoIcon,
  ArrowsClockwiseIcon,
  CarrotIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import { FriendlySummary } from './FriendlySummary';

type Phase = 'setup' | 'quiz' | 'results' | 'final';

const LABEL_PHASE = {
  setup: 'Setup',
  quiz: 'En curso',
  results: 'Resultados',
  final: 'Final',
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
  setup: 'lilac',
  quiz: 'sky',
  results: 'mint',
  final: 'coral',
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
          className="grid place-items-center text-(--coral-400) p-2"
          aria-hidden
        >
          <CarrotIcon size={32} aria-hidden />
        </div>
        <div className="text-text">
          <h1 className="text-3xl ">Questify</h1>
        </div>
      </div>
      <span className="badge" data-variant={phaseBadgeClass[phase]}>
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

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onBackToSetup}
          className="btn"
          title="Finalizar bloque actual"
        >
          <SlidersIcon size={22} aria-hidden />
          <span>Setup</span>
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

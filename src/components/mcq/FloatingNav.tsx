'use client';
import React from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RankingIcon,
} from '@phosphor-icons/react';

type Phase = 'setup' | 'quiz' | 'results' | 'final';

interface Props {
  phase: Phase;
  blocksCount: number;
  currentBlock: number;
  onBack: () => void;
  onNext: () => void;
}

export default function FloatingNav({
  phase,
  blocksCount,
  currentBlock,
  onBack,
  onNext,
}: Props) {
  const isFirstBlock = currentBlock === 0;
  const isLastBlock = blocksCount > 0 && currentBlock === blocksCount - 1;
  const showBack = !(phase === 'quiz' && isFirstBlock);
  const nextIsFinal = phase === 'results' && isLastBlock;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-0 pointer-events-non"
      role="navigation"
      aria-label="Navegación del bloque"
    >
      <div className="floating-nav pointer-events-auto w-full border-0">
        <div className="max-w-4xl mx-auto px-10">
          <div className="flex items-center justify-between px-3 py-4">
            {showBack ? (
              <button
                type="button"
                onClick={onBack}
                className="btn"
                title="Atrás"
              >
                <ArrowLeftIcon size={24} />
                <span className="inline">Atrás</span>
              </button>
            ) : (
              <span className="w-21" />
            )}

            <div className="badge opacity-80" data-variant="lilac">
              Bloque {Math.max(1, currentBlock + 1)} /{' '}
              {Math.max(1, blocksCount)}
            </div>

            <button
              type="button"
              onClick={onNext}
              className="btn"
              title={nextIsFinal ? 'Ir a resultados finales' : 'Siguiente'}
            >
              {nextIsFinal ? (
                <>
                  <RankingIcon size={24} />
                  <span className="inline">Resultados</span>
                </>
              ) : (
                <>
                  <ArrowRightIcon size={24} />
                  <span className="inline">Siguiente</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

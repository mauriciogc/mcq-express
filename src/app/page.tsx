'use client';
import React from 'react';
import { useMCQ } from '@/hooks/useMCQ';
import type { MCQPool } from '@/lib/types';

import SetupPanel from '@/components/mcq/SetupPanel';
import QuizBlock from '@/components/mcq/QuizBlock';
import ResultsPanel from '@/components/mcq/ResultsPanel';
import FinalResultsPanel from '@/components/mcq/FinalResultsPanel';
import FloatingNav from '@/components/mcq/FloatingNav';
import Header from '@/components/mcq/Header';

export default function MCQAi() {
  const {
    // state
    pool,
    settings,
    currentBlock,
    userAnswers,
    phase,
    explanations,
    loadingAI,
    // derived
    total,
    aiCount,
    baseCount,
    blocks,
    activeQuestions,
    // actions
    setSettings,
    setPhase,
    setCurrentBlock,
    loadFile,
    handleAnswer,
    startQuiz,
    finishBlock,
    resetAll,
    hasAI,
    // nav helpers
    goSetup,
    backFromQuiz,
    nextFromQuiz,
    backFromResults,
    nextFromResults,
  } = useMCQ();

  return (
    <>
      <div className="relative p-6 max-w-4xl mx-auto space-y-6 text-[var(--color-text)]">
        <div className="bg-gradient"></div>
        <Header
          phase={phase as 'setup' | 'quiz' | 'results' | 'final'}
          pool={pool as MCQPool | null}
          total={total}
          baseCount={baseCount}
          aiCount={aiCount}
          loadingAI={loadingAI}
          settings={settings}
          onStart={startQuiz}
          onBackToSetup={() => setPhase('setup')}
          onFinishBlock={finishBlock}
          onBackToBlock={() => setPhase('quiz')}
          onReset={resetAll}
        />

        {phase === 'setup' && (
          <SetupPanel
            pool={pool as MCQPool | null}
            settings={settings}
            setSettings={(fn) => setSettings((s) => fn(s))}
            onLoadFile={loadFile}
            loadingAI={loadingAI}
            hasAI={hasAI}
          />
        )}

        {phase === 'quiz' && (
          <QuizBlock
            activeQuestions={activeQuestions}
            answers={userAnswers}
            onAnswer={handleAnswer}
            blocksCount={blocks.length}
            currentBlock={currentBlock}
            setCurrentBlock={setCurrentBlock}
          />
        )}

        {phase === 'results' && (
          <ResultsPanel
            questions={activeQuestions}
            answers={userAnswers}
            explanations={explanations}
            loadingAI={loadingAI}
          />
        )}

        {phase === 'final' && pool && (
          <FinalResultsPanel
            allQuestions={pool.questions}
            answers={userAnswers}
          />
        )}
      </div>
      {(phase === 'quiz' || phase === 'results') && (
        <FloatingNav
          phase={phase}
          blocksCount={blocks.length}
          currentBlock={currentBlock}
          onBack={phase === 'quiz' ? backFromQuiz : backFromResults}
          onNext={phase === 'quiz' ? nextFromQuiz : nextFromResults}
        />
      )}
    </>
  );
}

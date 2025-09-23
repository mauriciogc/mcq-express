// src/hooks/useMCQ.ts
'use client';
import { useMemo, useState } from 'react';
import type {
  MCQPool,
  MCQQuestion,
  QuizSettings,
  UserAnswerMap,
} from '@/lib/types';
import { buildBlocks, gradeBlock, normalizeAIExtras } from '@/lib/mcq/utils';
import { aiAugment, aiExplain } from '@/lib/mcq/ai';
import { useHasAI } from './useHasAI';

export type Phase = 'setup' | 'quiz' | 'results' | 'final';

type AIExplainResponse = {
  explanations?: Record<string, string>;
};

function isAIExplainResponse(value: unknown): value is AIExplainResponse {
  if (typeof value !== 'object' || value === null) return false;
  if (!('explanations' in value)) return true;
  const ex = (value as { explanations?: unknown }).explanations;
  return ex === undefined || (typeof ex === 'object' && ex !== null);
}

export function useMCQ(initialSettings?: Partial<QuizSettings>) {
  const hasAI = useHasAI();
  const [pool, setPool] = useState<MCQPool | null>(null);
  const [settings, setSettings] = useState<QuizSettings>({
    blockSize: 10,
    allowAIAugment: false,
    allowAIExplain: false,
    aiAugmentCount: 10,
    shuffleEnabled: true,
    ...initialSettings,
  });
  const [currentBlock, setCurrentBlock] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerMap>({});
  const [phase, setPhase] = useState<Phase>('setup');
  const [explanations, setExplanations] = useState<Record<
    string,
    string
  > | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const total = pool?.questions.length ?? 0;
  const aiCount = pool
    ? pool.questions.filter((q) => q.source === 'ai').length
    : 0;
  const baseCount = total - aiCount;

  const blocks = useMemo(() => buildBlocks(pool, settings), [pool, settings]);
  const activeQuestions: MCQQuestion[] = blocks[currentBlock] ?? [];

  async function loadFile(file: File) {
    const text = await file.text();
    const json = JSON.parse(text) as MCQPool;
    json.questions = json.questions.map((q) => ({
      ...q,
      source: 'base' as const,
    }));
    setPool(json);
    setPhase('setup');
    setUserAnswers({});
    setCurrentBlock(0);
    setExplanations(null);
  }

  async function startQuiz() {
    if (!pool) return;
    let finalPool = pool;

    if (settings.allowAIAugment) {
      setLoadingAI(true);
      try {
        const data = await aiAugment(pool, settings.aiAugmentCount ?? 10);
        const extraCoerced = normalizeAIExtras(pool, data);
        if (extraCoerced.length) {
          finalPool = {
            ...pool,
            questions: [...pool.questions, ...extraCoerced],
          };
          setPool(finalPool);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAI(false);
      }
    }

    setPhase('quiz');
  }

  function handleAnswer(q: MCQQuestion, optionId: string, checked: boolean) {
    setUserAnswers((prev) => {
      const curr = prev[q.id] ?? [];
      if (q.type === 'radio') return { ...prev, [q.id]: [optionId] };
      const set = new Set(curr);
      if (checked) set.add(optionId);
      else set.delete(optionId);
      return { ...prev, [q.id]: Array.from(set) };
    });
  }

  async function finishBlock() {
    setPhase('results');

    if (!settings.allowAIExplain) return;

    const results = gradeBlock(activeQuestions, userAnswers);
    const mistakes = results.filter((r) => !r.isCorrect);
    if (!mistakes.length) return;

    setLoadingAI(true);
    try {
      const data = await aiExplain(mistakes, { questions: activeQuestions });

      if (isAIExplainResponse(data) && data.explanations) {
        setExplanations(data.explanations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  }

  function resetAll() {
    setUserAnswers({});
    setPhase('setup');
    setExplanations(null);
    setCurrentBlock(0);
    setPool(null);
    setSettings({
      blockSize: 10,
      allowAIAugment: false,
      allowAIExplain: false,
      aiAugmentCount: 10,
      shuffleEnabled: true,
      ...initialSettings,
    });
  }

  

function goSetup() {
  setPhase('setup');
}

function backFromQuiz() {
  // go to previous block if possible
  setCurrentBlock((b) => Math.max(0, b - 1));
}

function nextFromQuiz() {
  // from quiz, "siguiente" means evaluate current block
  setPhase('results');
}

function backFromResults() {
  // back to quiz for the same block
  setPhase('quiz');
}

function nextFromResults() {
  // if there is another block, go to next block in quiz; if not, go to final
  if (currentBlock < blocks.length - 1) {
    setCurrentBlock((b) => Math.min(blocks.length - 1, b + 1));
    setPhase('quiz');
  } else {
    setPhase('final');
  }
}

  return {
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
    goSetup,
    backFromQuiz,
    nextFromQuiz,
    backFromResults,
    nextFromResults,
    hasAI,
  };
}

// src/hooks/useMCQ.ts
'use client';
import { useMemo, useState, useEffect } from 'react';
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

function scrollToTop() {
  if (typeof window === 'undefined') return; // por seguridad en Next
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

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
    shuffleQuestionEnabled: true,
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

  useEffect(() => {
    // Solo si estás en una fase “de pantalla grande”
    if (phase === 'quiz' || phase === 'results' || phase === 'final') {
      scrollToTop();
    }
  }, [phase, currentBlock]);

  const total = pool?.questions.length ?? 0;
  const aiCount = pool
    ? pool.questions.filter((q) => q.source === 'ai').length
    : 0;
  const baseCount = total - aiCount;

  const blocks = useMemo(() => buildBlocks(pool, settings), [pool, settings]);
  const activeQuestions: MCQQuestion[] = useMemo(() => {
    const qs = blocks[currentBlock] ?? [];

    if (!settings.shuffleQuestionEnabled) {
      return qs;
    }

    return qs.map((q) => {
      if (!Array.isArray(q.options)) return q;

      return {
        ...q,
        options: shuffleArray(q.options),
      };
    });
  }, [blocks, currentBlock, settings.shuffleQuestionEnabled]);

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
      shuffleQuestionEnabled: true,
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

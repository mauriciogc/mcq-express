export type MCQOption = {
  id: string;
  text: string;
};

export type MCQQuestion = {
  id: string;
  type: 'radio' | 'checkbox';
  prompt: string;
  options: MCQOption[];
  answer: string[];
  explanation?: string;
  tags?: string[];
  meta?: Record<string, unknown>;
  source?: 'base' | 'ai';
};

export type MCQPool = {
  title?: string;
  version?: string;
  questions: MCQQuestion[];
};

export type QuizSettings = {
  blockSize: number;
  allowAIAugment: boolean;
  allowAIExplain: boolean;
  aiAugmentCount?: number;
  shuffleEnabled: boolean;
  shuffleQuestionEnabled: boolean;
};

export type UserAnswerMap = Record<string, string[]>;

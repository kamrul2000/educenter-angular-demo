export interface QuizQuestion {
  id: string;
  subjectId: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0–3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  type: 'mcq' | 'cq';
}

export interface CQQuestion {
  id: string;
  subjectId: string;
  chapterId: string;
  stimulusText: string; // uddipak
  questions: CQSubQuestion[];
  board: string;
  year: number;
}

export interface CQSubQuestion {
  part: 'ka' | 'kha' | 'ga' | 'gha'; // ক, খ, গ, ঘ
  question: string;
  marks: number;
  modelAnswer: string;
  writingTips: string[];
}

export interface QuizResult {
  id: string;
  userId: string;
  subjectId: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // seconds
  date: string;
  type: 'chapter' | 'topic' | 'mock' | 'weekly';
}

export interface MockTest {
  id: string;
  title: string;
  subjectId: string;
  class: number;
  duration: number; // minutes
  totalMarks: number;
  questions: QuizQuestion[];
  type: 'full-subject' | 'chapter' | 'weekly';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  accuracy: number;
  timeTaken: number;
}

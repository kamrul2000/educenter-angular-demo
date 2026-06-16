export interface StudyProgress {
  userId: string;
  subjectId: string;
  chapterId: string;
  completionPercent: number;
  lastStudied: string;
  videoProgress: { [videoId: string]: number };
  notesRead: boolean;
  mcqCompleted: boolean;
}

export interface StudyStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  studyDates: string[];
}

export interface Analytics {
  userId: string;
  averageScore: number;
  totalStudyHours: number;
  strongChapters: string[];
  weakChapters: string[];
  accuracyPercent: number;
  weeklyScores: number[];
  monthlyScores: number[];
  subjectScores: { [subjectId: string]: number };
}

export interface PdfResource {
  id: string;
  title: string;
  subjectId: string;
  chapterId?: string;
  class: number;
  type: 'notes' | 'summary' | 'formula' | 'suggestion' | 'model-test';
  fileSize: string;
  pages: number;
  downloadCount: number;
  isPremium: boolean;
}

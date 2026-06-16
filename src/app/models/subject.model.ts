export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
  classes: number[]; // which classes have this subject
  chapters: Chapter[];
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  titleBn: string;
  number: number;
  description: string;
  keyPoints: string[];
  formulas: string[];
  notes: string;
  infographicUrl?: string;
  mindMapUrl?: string;
  videoCount: number;
  mcqCount: number;
  pdfAvailable: boolean;
  estimatedTime: number; // minutes
}

export interface Video {
  id: string;
  subjectId: string;
  chapterId: string;
  title: string;
  duration: string;
  thumbnail: string;
  type: 'concept' | 'full-chapter' | 'exam-prep';
  youtubeId?: string;
  watched: boolean;
  progress: number; // 0–100
}

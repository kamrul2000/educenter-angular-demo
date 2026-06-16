import { Injectable } from '@angular/core';
import { StudyProgress, StudyStreak, Analytics } from '../models/progress.model';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProgressService {

  constructor(private ls: LocalStorageService, private auth: AuthService) {}

  private get userId(): string {
    return this.auth.getCurrentUser()?.id || 'guest';
  }

  updateProgress(subjectId: string, chapterId: string, percent: number): void {
    const key = `progress_${this.userId}`;
    const allProgress = this.ls.get<StudyProgress[]>(key) || [];
    const idx = allProgress.findIndex(p => p.subjectId === subjectId && p.chapterId === chapterId);
    const item: StudyProgress = {
      userId: this.userId, subjectId, chapterId,
      completionPercent: percent,
      lastStudied: new Date().toISOString(),
      videoProgress: {}, notesRead: percent > 30, mcqCompleted: percent >= 80
    };
    if (idx > -1) allProgress[idx] = { ...allProgress[idx], ...item };
    else allProgress.push(item);
    this.ls.set(key, allProgress);
    this.updateStreak();
  }

  getProgress(subjectId?: string): StudyProgress[] {
    const all = this.ls.get<StudyProgress[]>(`progress_${this.userId}`) || [];
    return subjectId ? all.filter(p => p.subjectId === subjectId) : all;
  }

  getChapterProgress(subjectId: string, chapterId: string): number {
    const all = this.getProgress(subjectId);
    return all.find(p => p.chapterId === chapterId)?.completionPercent || 0;
  }

  updateStreak(): void {
    const key = `streak_${this.userId}`;
    const streak = this.ls.get<StudyStreak>(key) || { userId: this.userId, currentStreak: 0, longestStreak: 0, lastStudyDate: '', studyDates: [] };
    const today = new Date().toDateString();
    if (streak.lastStudyDate === today) return; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak.currentStreak = streak.lastStudyDate === yesterday ? streak.currentStreak + 1 : 1;
    streak.longestStreak = Math.max(streak.currentStreak, streak.longestStreak);
    streak.lastStudyDate = today;
    if (!streak.studyDates.includes(today)) streak.studyDates.push(today);
    this.ls.set(key, streak);
  }

  getStreak(): StudyStreak {
    return this.ls.get<StudyStreak>(`streak_${this.userId}`) || { userId: this.userId, currentStreak: 0, longestStreak: 0, lastStudyDate: '', studyDates: [] };
  }

  /** Generate demo analytics for the current user */
  getAnalytics(): Analytics {
    return {
      userId: this.userId,
      averageScore: 72,
      totalStudyHours: 48,
      strongChapters: ['Real Numbers', 'Cell Biology', 'ICT Basics'],
      weakChapters: ['Polynomials', 'Newton\'s Laws'],
      accuracyPercent: 68,
      weeklyScores: [65, 70, 68, 75, 72, 80, 77],
      monthlyScores: [60, 65, 70, 72, 75, 78, 72, 80, 82, 79, 83, 85],
      subjectScores: { math: 70, science: 75, english: 80, physics: 65, ict: 85, bangla: 78 }
    };
  }
}

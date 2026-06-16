import { Injectable } from '@angular/core';
import { QuizQuestion, QuizResult } from '../models/quiz.model';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class QuizService {

  constructor(private ls: LocalStorageService, private auth: AuthService) {}

  saveResult(result: Omit<QuizResult, 'id' | 'userId' | 'date'>): void {
    const results = this.ls.get<QuizResult[]>('quiz_results') || [];
    const newResult: QuizResult = {
      ...result,
      id: 'result_' + Date.now(),
      userId: this.auth.getCurrentUser()?.id || 'guest',
      date: new Date().toISOString()
    };
    results.push(newResult);
    this.ls.set('quiz_results', results);
  }

  getResults(userId?: string): QuizResult[] {
    const results = this.ls.get<QuizResult[]>('quiz_results') || [];
    const uid = userId || this.auth.getCurrentUser()?.id;
    return results.filter(r => r.userId === uid);
  }

  getAverageScore(userId?: string): number {
    const results = this.getResults(userId);
    if (!results.length) return 0;
    const total = results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0);
    return Math.round(total / results.length);
  }

  /** Shuffle questions for a fair quiz experience */
  shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    return [...questions].sort(() => Math.random() - 0.5);
  }

  calculateScore(questions: QuizQuestion[], userAnswers: number[]): { correct: number; total: number; percent: number } {
    let correct = 0;
    questions.forEach((q, i) => { if (userAnswers[i] === q.correctAnswer) correct++; });
    return { correct, total: questions.length, percent: Math.round((correct / questions.length) * 100) };
  }
}

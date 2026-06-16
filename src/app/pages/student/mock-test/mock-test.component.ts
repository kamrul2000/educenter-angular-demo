import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { QuizService } from '../../../services/quiz.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MockTest, QuizQuestion, LeaderboardEntry } from '../../../models/quiz.model';

type TestMode = 'setup' | 'running' | 'result';

@Component({
  selector: 'app-mock-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mocktest-page py-4 bg-light min-vh-100">
      <div class="container">

        <!-- SETUP -->
        <div *ngIf="mode === 'setup'">
          <div class="text-center mb-5">
            <h3 class="fw-bold mb-1">🕐 Mock Test System</h3>
            <p class="text-muted">Full subject, chapter, and weekly timed mock examinations</p>
          </div>

          <div class="row g-4">
            <!-- Test Cards -->
            <div class="col-lg-8">
              <div class="row g-3">
                <div class="col-md-6" *ngFor="let test of availableTests">
                  <div class="test-card card border-0 shadow-sm h-100 cursor-pointer" (click)="selectTest(test)" [class.selected-test]="selectedTest?.id === test.id">
                    <div class="card-body p-4">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="test-type-badge" [class]="getTestTypeBadge(test.type)">
                          {{ getTestTypeLabel(test.type) }}
                        </div>
                        <span class="badge bg-light text-dark border">Class {{ test.class }}</span>
                      </div>
                      <h6 class="fw-bold mb-2">{{ test.title }}</h6>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-primary-subtle text-primary"><i class="bi bi-clock me-1"></i>{{ test.duration }} min</span>
                        <span class="badge bg-success-subtle text-success"><i class="bi bi-list-check me-1"></i>{{ test.questions.length }} Q</span>
                        <span class="badge bg-warning-subtle text-warning-emphasis"><i class="bi bi-trophy me-1"></i>{{ test.totalMarks }} marks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button *ngIf="selectedTest" class="btn btn-primary btn-lg w-100 fw-bold rounded-pill mt-4 py-3" (click)="startTest()">
                <i class="bi bi-play-fill me-2"></i>Start: {{ selectedTest.title }}
              </button>
            </div>

            <!-- Leaderboard -->
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-warning border-0">
                  <h6 class="fw-bold mb-0">🏆 Leaderboard</h6>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item border-0 px-3 py-2" *ngFor="let entry of leaderboard">
                      <div class="d-flex align-items-center gap-2">
                        <div class="rank-badge" [class]="getRankClass(entry.rank)">{{ entry.rank }}</div>
                        <div class="flex-grow-1">
                          <div class="small fw-semibold">{{ entry.userName }}</div>
                          <div class="text-muted" style="font-size:0.7rem">{{ entry.accuracy }}% accuracy</div>
                        </div>
                        <span class="badge bg-primary">{{ entry.score }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RUNNING TEST -->
        <div *ngIf="mode === 'running' && currentTest">
          <!-- Timer Header -->
          <div class="test-running-header card border-0 shadow-sm mb-4 p-3 sticky-top" style="top:70px">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div class="fw-bold">{{ currentTest.title }}</div>
              <div class="timer-display" [class.urgent]="timeRemaining < 120">
                <i class="bi bi-clock-fill me-2"></i>{{ formatTime(timeRemaining) }}
              </div>
              <div class="d-flex gap-2">
                <span class="badge bg-success">Answered: {{ answeredCount }}</span>
                <span class="badge bg-secondary">Remaining: {{ currentTest.questions.length - answeredCount }}</span>
              </div>
            </div>
            <!-- Progress -->
            <div class="progress mt-2" style="height:4px">
              <div class="progress-bar bg-warning" [style.width]="(answeredCount / currentTest.questions.length * 100) + '%'"></div>
            </div>
          </div>

          <!-- Questions -->
          <div class="row g-3">
            <div class="col-12" *ngFor="let q of currentTest.questions; let i = index">
              <div class="question-box card border-0 shadow-sm p-4" [class.answered-q]="testAnswers[i] !== undefined">
                <div class="d-flex justify-content-between mb-3">
                  <span class="badge bg-primary">Q.{{ i + 1 }}</span>
                  <span class="text-muted small">{{ q.marks }} mark(s)</span>
                </div>
                <p class="fw-medium mb-3">{{ q.question }}</p>
                <div class="row g-2">
                  <div class="col-md-6" *ngFor="let opt of q.options; let oi = index">
                    <label class="option-label d-flex align-items-center gap-2 p-2 rounded cursor-pointer" [class.selected-opt]="testAnswers[i] === oi">
                      <input type="radio" class="form-check-input" [name]="'q_' + i" [value]="oi" [(ngModel)]="testAnswers[i]" (change)="onAnswer()">
                      <span class="small">{{ 'ABCD'[oi] }}) {{ opt }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button class="btn btn-danger btn-lg fw-bold rounded-pill px-5" (click)="submitTest()">
              <i class="bi bi-send-fill me-2"></i>Submit Test ({{ answeredCount }}/{{ currentTest.questions.length }} answered)
            </button>
          </div>
        </div>

        <!-- RESULT -->
        <div *ngIf="mode === 'result' && currentTest" class="text-center">
          <div class="result-card card border-0 shadow-lg mx-auto p-5" style="max-width:600px">
            <h4 class="fw-bold mb-1">🎯 Test Complete!</h4>
            <p class="text-muted mb-4">{{ currentTest.title }}</p>

            <div class="score-display mb-4">
              <div class="score-circle mx-auto" [class]="getScoreClass(finalScore)">
                <span class="fw-bold" style="font-size:2.5rem">{{ finalScore }}%</span>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-3">
                <div class="result-stat bg-success-subtle rounded-3 p-3">
                  <div class="fw-bold text-success fs-5">{{ correctCount }}</div>
                  <div class="text-muted small">Correct</div>
                </div>
              </div>
              <div class="col-3">
                <div class="result-stat bg-danger-subtle rounded-3 p-3">
                  <div class="fw-bold text-danger fs-5">{{ wrongCount }}</div>
                  <div class="text-muted small">Wrong</div>
                </div>
              </div>
              <div class="col-3">
                <div class="result-stat bg-secondary-subtle rounded-3 p-3">
                  <div class="fw-bold text-secondary fs-5">{{ unansweredCount }}</div>
                  <div class="text-muted small">Skipped</div>
                </div>
              </div>
              <div class="col-3">
                <div class="result-stat bg-primary-subtle rounded-3 p-3">
                  <div class="fw-bold text-primary fs-5">{{ myRank }}</div>
                  <div class="text-muted small">Rank</div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center flex-wrap">
              <button class="btn btn-primary rounded-pill px-4" (click)="mode = 'setup'">
                <i class="bi bi-arrow-left me-2"></i>Back to Tests
              </button>
              <a routerLink="/analytics" class="btn btn-outline-success rounded-pill px-4">
                <i class="bi bi-bar-chart me-2"></i>View Analytics
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-card { border-radius: 16px !important; transition: all 0.2s; cursor: pointer; border: 2px solid transparent !important; }
    .test-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
    .test-card.selected-test { border-color: #1d3557 !important; background: #f0f4ff; }
    .test-type-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .timer-display { background: #1d3557; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 1.2rem; }
    .timer-display.urgent { background: #dc3545; animation: pulse 0.8s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
    .rank-badge { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; }
    .option-label { background: #f8f9fa; border: 1px solid #e9ecef; cursor: pointer; transition: all 0.15s; }
    .option-label:hover { background: #e8efff; border-color: #1d3557; }
    .option-label.selected-opt { background: #e8efff; border-color: #1d3557; }
    .answered-q { border-left: 4px solid #28a745 !important; }
    .score-circle { width: 130px; height: 130px; border-radius: 50%; border: 6px solid; display: flex; align-items: center; justify-content: center; }
  `]
})
export class MockTestComponent implements OnInit, OnDestroy {
  mode: TestMode = 'setup';
  availableTests: MockTest[] = [];
  selectedTest: MockTest | null = null;
  currentTest: MockTest | null = null;
  testAnswers: { [idx: number]: number } = {};
  answeredCount = 0;
  timeRemaining = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  finalScore = 0; correctCount = 0; wrongCount = 0; unansweredCount = 0; myRank = 0;

  leaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 'u1', userName: 'Farhan Ahmed', score: 96, accuracy: 96, timeTaken: 1200 },
    { rank: 2, userId: 'u2', userName: 'Nusrat Jahan', score: 92, accuracy: 92, timeTaken: 1350 },
    { rank: 3, userId: 'u3', userName: 'Rifat Islam', score: 88, accuracy: 88, timeTaken: 1450 },
    { rank: 4, userId: 'u4', userName: 'You (Demo)', score: 80, accuracy: 80, timeTaken: 1500 },
    { rank: 5, userId: 'u5', userName: 'Sabina Akter', score: 76, accuracy: 76, timeTaken: 1600 },
  ];

  constructor(private demoData: DemoDataService, private quizService: QuizService, private ls: LocalStorageService) {}

  ngOnInit(): void { this.availableTests = this.demoData.getMockTests(); }
  ngOnDestroy(): void { this.clearTimer(); }

  selectTest(test: MockTest): void { this.selectedTest = test; }

  startTest(): void {
    if (!this.selectedTest) return;
    this.currentTest = this.selectedTest;
    this.testAnswers = {};
    this.answeredCount = 0;
    this.timeRemaining = this.currentTest.duration * 60;
    this.mode = 'running';
    this.startTimer();
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) { this.clearTimer(); this.submitTest(); }
    }, 1000);
  }

  clearTimer(): void { if (this.timer) { clearInterval(this.timer); this.timer = null; } }

  onAnswer(): void {
    this.answeredCount = Object.keys(this.testAnswers).length;
  }

  submitTest(): void {
    if (!this.currentTest) return;
    this.clearTimer();
    this.correctCount = 0; this.wrongCount = 0;
    this.currentTest.questions.forEach((q, i) => {
      if (this.testAnswers[i] === undefined) this.unansweredCount++;
      else if (this.testAnswers[i] === q.correctAnswer) this.correctCount++;
      else this.wrongCount++;
    });
    this.finalScore = Math.round((this.correctCount / this.currentTest.questions.length) * 100);
    this.myRank = this.leaderboard.length + 1;
    for (let i = 0; i < this.leaderboard.length; i++) {
      if (this.finalScore >= this.leaderboard[i].score) { this.myRank = i + 1; break; }
    }
    this.quizService.saveResult({ subjectId: this.currentTest.subjectId, chapterId: '', score: this.finalScore, totalQuestions: this.currentTest.questions.length, correctAnswers: this.correctCount, timeTaken: this.currentTest.duration * 60 - this.timeRemaining, type: 'mock' });
    this.mode = 'result';
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  getTestTypeBadge(type: string): string {
    const map: { [k: string]: string } = { 'full-subject': 'bg-danger text-white', 'chapter': 'bg-primary text-white', 'weekly': 'bg-success text-white' };
    return map[type] || 'bg-secondary text-white';
  }

  getTestTypeLabel(type: string): string {
    const map: { [k: string]: string } = { 'full-subject': 'Full Subject', 'chapter': 'Chapter Test', 'weekly': 'Weekly Test' };
    return map[type] || type;
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'bg-warning text-dark';
    if (rank === 2) return 'bg-secondary text-white';
    if (rank === 3) return 'bg-danger text-white';
    return 'bg-light text-dark border';
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'border-success';
    if (score >= 60) return 'border-warning';
    return 'border-danger';
  }
}

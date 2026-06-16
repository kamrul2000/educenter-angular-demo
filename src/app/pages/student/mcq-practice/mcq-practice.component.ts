import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { QuizService } from '../../../services/quiz.service';
import { QuizQuestion } from '../../../models/quiz.model';

type QuizMode = 'setup' | 'quiz' | 'result';

@Component({
  selector: 'app-mcq-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mcq-page py-4 bg-light min-vh-100">
      <div class="container">

        <!-- SETUP SCREEN -->
        <div *ngIf="mode === 'setup'">
          <div class="text-center mb-5">
            <h3 class="fw-bold mb-1">✅ MCQ Practice</h3>
            <p class="text-muted">Choose subject and mode, then start practicing</p>
          </div>

          <div class="row g-4 justify-content-center">
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm p-4">
                <h5 class="fw-bold mb-4">Configure Practice Session</h5>

                <div class="mb-3">
                  <label class="form-label fw-medium">Subject</label>
                  <select class="form-select" [(ngModel)]="selectedSubject" (change)="loadQuestions()">
                    <option value="math">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="physics">Physics</option>
                    <option value="ict">ICT</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Practice Mode</label>
                  <div class="d-flex flex-column gap-2">
                    <label class="mode-option p-3 rounded-3 cursor-pointer" [class.selected]="quizMode === 'practice'" (click)="quizMode = 'practice'">
                      <div class="d-flex align-items-center gap-3">
                        <i class="bi bi-book-fill text-primary fs-4"></i>
                        <div>
                          <div class="fw-semibold">Practice Mode</div>
                          <small class="text-muted">See explanation after each answer</small>
                        </div>
                      </div>
                    </label>
                    <label class="mode-option p-3 rounded-3 cursor-pointer" [class.selected]="quizMode === 'exam'" (click)="quizMode = 'exam'">
                      <div class="d-flex align-items-center gap-3">
                        <i class="bi bi-clock-fill text-danger fs-4"></i>
                        <div>
                          <div class="fw-semibold">Exam Mode</div>
                          <small class="text-muted">Timed — 30 seconds per question</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Number of Questions: {{ questionCount }}</label>
                  <input type="range" class="form-range" [(ngModel)]="questionCount" min="3" max="10" step="1">
                </div>

                <div class="alert alert-info small">
                  <i class="bi bi-info-circle me-1"></i>
                  Available questions: <strong>{{ availableQuestions.length }}</strong> for {{ selectedSubject }}
                </div>

                <button class="btn btn-primary w-100 fw-bold py-2 rounded-pill" (click)="startQuiz()" [disabled]="!availableQuestions.length">
                  <i class="bi bi-play-fill me-2"></i>Start Practice
                </button>
              </div>
            </div>

            <!-- Past Scores -->
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm p-4">
                <h6 class="fw-bold mb-3">📊 Your Recent Scores</h6>
                <div *ngFor="let r of pastResults" class="score-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div class="small fw-medium">{{ r.subject }}</div>
                    <div class="text-muted" style="font-size:0.7rem">{{ r.date }}</div>
                  </div>
                  <span class="badge rounded-pill" [class]="r.percent >= 80 ? 'bg-success' : r.percent >= 60 ? 'bg-warning text-dark' : 'bg-danger'">{{ r.percent }}%</span>
                </div>
                <p *ngIf="!pastResults.length" class="text-muted small text-center py-3">No scores yet. Start practicing!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- QUIZ SCREEN -->
        <div *ngIf="mode === 'quiz'">
          <!-- Header Bar -->
          <div class="quiz-header card border-0 shadow-sm mb-4 p-3">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div class="fw-bold">Question {{ currentIndex + 1 }} / {{ questions.length }}</div>

              <!-- Timer (Exam Mode) -->
              <div *ngIf="quizMode === 'exam'" class="timer-badge" [class.urgent]="timeLeft <= 10">
                <i class="bi bi-clock me-1"></i>{{ timeLeft }}s
              </div>

              <div class="d-flex gap-2 align-items-center">
                <span class="badge bg-success">{{ correctCount }} Correct</span>
                <span class="badge bg-danger">{{ incorrectCount }} Wrong</span>
              </div>
            </div>
            <!-- Progress -->
            <div class="progress mt-3" style="height:6px">
              <div class="progress-bar bg-primary rounded-pill" [style.width]="((currentIndex) / questions.length * 100) + '%'"></div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="quiz-question-card card border-0 shadow-sm p-4 mb-4">
                <!-- Difficulty -->
                <div class="d-flex justify-content-between mb-3">
                  <span class="badge" [class]="getDiffBadge(currentQuestion.difficulty)">{{ currentQuestion.difficulty | titlecase }}</span>
                  <span class="text-muted small">{{ currentQuestion.marks }} mark(s)</span>
                </div>

                <!-- Question -->
                <h5 class="fw-bold mb-4 lh-base">{{ currentQuestion.question }}</h5>

                <!-- Options -->
                <div class="d-flex flex-column gap-3">
                  <button *ngFor="let opt of currentQuestion.options; let i = index"
                          class="option-btn btn text-start p-3 fw-medium"
                          [class.correct-opt]="showAnswer && i === currentQuestion.correctAnswer"
                          [class.wrong-opt]="showAnswer && userAnswer === i && i !== currentQuestion.correctAnswer"
                          [class.btn-outline-primary]="!showAnswer && userAnswer !== i"
                          [class.selected-opt]="!showAnswer && userAnswer === i"
                          [disabled]="showAnswer || userAnswer !== -1"
                          (click)="selectAnswer(i)">
                    <span class="opt-letter me-2">{{ 'ABCD'[i] }}</span>{{ opt }}
                  </button>
                </div>

                <!-- Explanation (Practice Mode) -->
                <div *ngIf="showAnswer" class="explanation-box mt-4 p-3 rounded-3"
                     [class.correct-bg]="userAnswer === currentQuestion.correctAnswer"
                     [class.wrong-bg]="userAnswer !== currentQuestion.correctAnswer">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi fs-5" [class]="userAnswer === currentQuestion.correctAnswer ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
                    <strong>{{ userAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Wrong Answer' }}</strong>
                  </div>
                  <p class="mb-0 small"><strong>Explanation:</strong> {{ currentQuestion.explanation }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-between mt-4">
                  <button class="btn btn-outline-danger btn-sm rounded-pill" (click)="quitQuiz()">
                    <i class="bi bi-x-circle me-1"></i>Quit
                  </button>
                  <button *ngIf="showAnswer || quizMode === 'exam'" class="btn btn-primary rounded-pill px-4" (click)="nextQuestion()">
                    {{ currentIndex + 1 < questions.length ? 'Next Question' : 'See Results' }}
                    <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                  <button *ngIf="!showAnswer && quizMode === 'practice' && userAnswer === -1" class="btn btn-warning rounded-pill px-4" (click)="skipQuestion()">
                    Skip <i class="bi bi-skip-forward ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESULT SCREEN -->
        <div *ngIf="mode === 'result'" class="text-center">
          <div class="result-card card border-0 shadow-lg mx-auto p-5" style="max-width:540px">
            <div class="score-ring mx-auto mb-4" [class.excellent]="scorePercent >= 80" [class.good]="scorePercent >= 60 && scorePercent < 80" [class.poor]="scorePercent < 60">
              <span class="score-num">{{ scorePercent }}%</span>
            </div>
            <h4 class="fw-bold mb-1">{{ getResultMessage() }}</h4>
            <p class="text-muted mb-4">{{ correctCount }} out of {{ questions.length }} correct answers</p>

            <div class="row g-3 mb-4">
              <div class="col-4">
                <div class="stat-mini bg-success-subtle rounded-3 p-3">
                  <div class="fw-bold text-success fs-5">{{ correctCount }}</div>
                  <div class="small text-muted">Correct</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-mini bg-danger-subtle rounded-3 p-3">
                  <div class="fw-bold text-danger fs-5">{{ incorrectCount }}</div>
                  <div class="small text-muted">Wrong</div>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-mini bg-secondary-subtle rounded-3 p-3">
                  <div class="fw-bold text-secondary fs-5">{{ skippedCount }}</div>
                  <div class="small text-muted">Skipped</div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-center flex-wrap">
              <button class="btn btn-primary rounded-pill px-4" (click)="restartQuiz()">
                <i class="bi bi-arrow-clockwise me-2"></i>Practice Again
              </button>
              <a routerLink="/dashboard" class="btn btn-outline-secondary rounded-pill px-4">
                <i class="bi bi-house me-2"></i>Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mode-option { border: 2px solid #e9ecef; cursor: pointer; transition: all 0.2s; }
    .mode-option.selected { border-color: #1d3557; background: #f0f4ff; }
    .option-btn { border-radius: 12px !important; border: 2px solid #dee2e6; transition: all 0.15s; }
    .option-btn.selected-opt { border-color: #1d3557; background: #f0f4ff; }
    .option-btn.correct-opt { background: #d4edda; border-color: #28a745; color: #155724; }
    .option-btn.wrong-opt { background: #f8d7da; border-color: #dc3545; color: #721c24; }
    .opt-letter { font-weight: 700; color: #1d3557; }
    .explanation-box.correct-bg { background: #d4edda; border: 1px solid #28a745; }
    .explanation-box.wrong-bg { background: #f8d7da; border: 1px solid #dc3545; }
    .timer-badge { background: #1d3557; color: white; padding: 6px 16px; border-radius: 20px; font-weight: 700; }
    .timer-badge.urgent { background: #dc3545; animation: pulse 0.8s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
    .score-ring { width: 120px; height: 120px; border-radius: 50%; border: 6px solid; display: flex; align-items: center; justify-content: center; }
    .score-ring.excellent { border-color: #28a745; }
    .score-ring.good { border-color: #ffc107; }
    .score-ring.poor { border-color: #dc3545; }
    .score-num { font-size: 2rem; font-weight: 800; }
    .quiz-header { border-radius: 16px !important; }
    .quiz-question-card { border-radius: 20px !important; }
  `]
})
export class McqPracticeComponent implements OnInit, OnDestroy {
  mode: QuizMode = 'setup';
  selectedSubject = 'math';
  quizMode: 'practice' | 'exam' = 'practice';
  questionCount = 5;
  availableQuestions: QuizQuestion[] = [];
  questions: QuizQuestion[] = [];
  currentIndex = 0;
  userAnswer = -1;
  showAnswer = false;
  correctCount = 0;
  incorrectCount = 0;
  skippedCount = 0;
  scorePercent = 0;
  timeLeft = 30;
  private timer: ReturnType<typeof setInterval> | null = null;

  pastResults = [
    { subject: 'Mathematics', date: 'Today', percent: 80 },
    { subject: 'Science', date: 'Yesterday', percent: 70 },
    { subject: 'English', date: '2 days ago', percent: 90 },
  ];

  get currentQuestion(): QuizQuestion { return this.questions[this.currentIndex]; }

  constructor(private demoData: DemoDataService, private quizService: QuizService) {}

  ngOnInit(): void { this.loadQuestions(); }
  ngOnDestroy(): void { this.clearTimer(); }

  loadQuestions(): void {
    this.availableQuestions = this.demoData.getMCQQuestions(this.selectedSubject);
  }

  startQuiz(): void {
    this.questions = this.quizService.shuffleQuestions(this.availableQuestions).slice(0, Math.min(this.questionCount, this.availableQuestions.length));
    this.currentIndex = 0; this.userAnswer = -1; this.showAnswer = false;
    this.correctCount = 0; this.incorrectCount = 0; this.skippedCount = 0;
    this.mode = 'quiz';
    if (this.quizMode === 'exam') this.startTimer();
  }

  startTimer(): void {
    this.timeLeft = 30;
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) { this.clearTimer(); this.nextQuestion(); }
    }, 1000);
  }

  clearTimer(): void { if (this.timer) { clearInterval(this.timer); this.timer = null; } }

  selectAnswer(index: number): void {
    if (this.userAnswer !== -1) return;
    this.userAnswer = index;
    if (index === this.currentQuestion.correctAnswer) this.correctCount++;
    else this.incorrectCount++;
    if (this.quizMode === 'practice') { this.showAnswer = true; this.clearTimer(); }
    else { this.clearTimer(); setTimeout(() => this.nextQuestion(), 800); }
  }

  skipQuestion(): void {
    this.skippedCount++;
    this.nextQuestion();
  }

  nextQuestion(): void {
    if (this.currentIndex + 1 < this.questions.length) {
      this.currentIndex++;
      this.userAnswer = -1;
      this.showAnswer = false;
      if (this.quizMode === 'exam') this.startTimer();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    this.clearTimer();
    this.scorePercent = Math.round((this.correctCount / this.questions.length) * 100);
    this.quizService.saveResult({ subjectId: this.selectedSubject, chapterId: '', score: this.scorePercent, totalQuestions: this.questions.length, correctAnswers: this.correctCount, timeTaken: 0, type: 'chapter' });
    this.mode = 'result';
  }

  quitQuiz(): void { this.clearTimer(); this.mode = 'setup'; }
  restartQuiz(): void { this.mode = 'setup'; this.loadQuestions(); }

  getDiffBadge(d: string): string { return d === 'easy' ? 'bg-success' : d === 'medium' ? 'bg-warning text-dark' : 'bg-danger'; }

  getResultMessage(): string {
    if (this.scorePercent >= 90) return '🏆 Outstanding!';
    if (this.scorePercent >= 75) return '🎉 Great Job!';
    if (this.scorePercent >= 60) return '👍 Good Effort!';
    return '📚 Keep Practicing!';
  }
}

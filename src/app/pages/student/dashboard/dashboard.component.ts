import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProgressService } from '../../../services/progress.service';
import { QuizService } from '../../../services/quiz.service';
import { DemoDataService } from '../../../services/demo-data.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatCardComponent],
  template: `
    <div class="dashboard-page bg-light min-vh-100 py-4">
      <div class="container-fluid px-4">

        <!-- Welcome Header -->
        <div class="row g-4 mb-4">
          <div class="col-12">
            <div class="welcome-card card border-0 shadow-sm p-4">
              <div class="row align-items-center">
                <div class="col-lg-8">
                  <div class="d-flex align-items-center gap-3 mb-2">
                    <div class="avatar-lg">{{ user?.name?.[0] || 'S' }}</div>
                    <div>
                      <h4 class="fw-bold mb-0">স্বাগতম, {{ user?.name }}! 👋</h4>
                      <p class="text-muted mb-0">Class {{ user?.class }} Student • {{ today }}</p>
                    </div>
                  </div>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <span class="badge bg-primary-subtle text-primary px-3 py-2">🔥 {{ streak.currentStreak }} Day Streak</span>
                    <span class="badge bg-success-subtle text-success px-3 py-2">📚 {{ totalStudied }} Chapters Studied</span>
                    <span class="badge bg-warning-subtle text-warning-emphasis px-3 py-2">⭐ Avg Score: {{ avgScore }}%</span>
                  </div>
                </div>
                <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
                  <div class="d-flex align-items-center gap-2 justify-content-lg-end mb-2">
                    <label class="text-muted small fw-medium mb-0">Change Class:</label>
                    <select class="form-select form-select-sm w-auto" [(ngModel)]="selectedClass" (change)="changeClass()">
                      <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
                    </select>
                  </div>
                  <a routerLink="/mock-test" class="btn btn-warning fw-bold rounded-pill">
                    <i class="bi bi-clock me-2"></i>Take Mock Test
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3 col-6">
            <app-stat-card label="Average Score" [value]="avgScore + '%'" icon="bi-trophy" color="#1d3557" [trend]="5"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Study Streak" [value]="streak.currentStreak + ' Days'" icon="bi-fire" color="#e63946"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Total Study Hours" value="48h 20m" icon="bi-clock-history" color="#2d6a4f" [trend]="12"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="MCQ Accuracy" value="68%" icon="bi-check-circle" color="#f4a261" [trend]="-3"></app-stat-card>
          </div>
        </div>

        <div class="row g-4">
          <!-- Left Column -->
          <div class="col-lg-8">

            <!-- Recent Subjects -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">📚 Continue Learning</h6>
                <a routerLink="/subjects" class="btn btn-sm btn-outline-primary rounded-pill">View All</a>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6" *ngFor="let s of demoData.subjects.slice(0, 4)">
                    <div class="subject-progress-card p-3 rounded-3 d-flex align-items-center gap-3"
                         [style.borderLeft]="'4px solid ' + s.color"
                         style="background: #f8f9fa; cursor:pointer" [routerLink]="'/subjects/' + s.id">
                      <div class="subject-icon-sm" [style.background]="s.color + '20'" [style.color]="s.color">
                        <i class="bi" [class]="s.icon"></i>
                      </div>
                      <div class="flex-grow-1 min-w-0">
                        <div class="fw-semibold small text-truncate">{{ s.name }}</div>
                        <div class="d-flex align-items-center gap-2 mt-1">
                          <div class="progress flex-grow-1" style="height:6px">
                            <div class="progress-bar" [style.width]="getSubjectProgress(s.id) + '%'" [style.background]="s.color"></div>
                          </div>
                          <small class="text-muted fw-medium" style="font-size:0.7rem">{{ getSubjectProgress(s.id) }}%</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Weekly Activity Chart -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 pb-0">
                <h6 class="fw-bold mb-0">📊 Weekly Activity</h6>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-end gap-2 justify-content-between" style="height:120px">
                  <div *ngFor="let day of weeklyData; let i = index" class="d-flex flex-column align-items-center gap-1 flex-grow-1">
                    <span class="small text-muted" style="font-size:0.65rem">{{ day.score }}%</span>
                    <div class="bar-chart-bar rounded-top" [style.height]="day.score + '%'" [style.background]="day.isToday ? '#1d3557' : '#1d335740'"></div>
                    <span class="small text-muted" style="font-size:0.65rem">{{ day.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0 pb-0">
                <h6 class="fw-bold mb-0">⚡ Quick Actions</h6>
              </div>
              <div class="card-body">
                <div class="row g-2">
                  <div class="col-6 col-md-3" *ngFor="let action of quickActions">
                    <a [routerLink]="action.route" class="quick-action-btn d-flex flex-column align-items-center gap-2 p-3 rounded-3 text-decoration-none text-center" [style.background]="action.color + '15'">
                      <i class="bi fs-3" [class]="action.icon" [style.color]="action.color"></i>
                      <span class="small fw-semibold" [style.color]="action.color">{{ action.label }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">

            <!-- Study Streak Calendar -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 pb-0">
                <h6 class="fw-bold mb-0">🔥 Study Streak</h6>
              </div>
              <div class="card-body text-center">
                <div class="streak-circle mx-auto mb-3">
                  <span class="streak-number">{{ streak.currentStreak }}</span>
                  <span class="streak-label">days</span>
                </div>
                <p class="text-muted small mb-0">Longest streak: <strong>{{ streak.longestStreak }} days</strong></p>
                <div class="d-flex gap-1 flex-wrap justify-content-center mt-3">
                  <div *ngFor="let d of last7Days" class="streak-dot" [class.active]="isStudiedDay(d)" [title]="d"></div>
                </div>
                <small class="text-muted d-block mt-2">Last 7 days activity</small>
              </div>
            </div>

            <!-- Recent Scores -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 pb-0 d-flex justify-content-between">
                <h6 class="fw-bold mb-0">🏆 Recent Scores</h6>
                <a routerLink="/analytics" class="btn btn-sm btn-link p-0">View All</a>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 px-3 py-2" *ngFor="let score of recentScores">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <div class="small fw-semibold">{{ score.subject }}</div>
                        <div class="text-muted" style="font-size:0.7rem">{{ score.date }}</div>
                      </div>
                      <span class="badge rounded-pill" [class]="score.percent >= 80 ? 'bg-success' : score.percent >= 60 ? 'bg-warning text-dark' : 'bg-danger'">{{ score.percent }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Tutor CTA -->
            <div class="card border-0 shadow-sm ai-cta-card">
              <div class="card-body p-4 text-center">
                <i class="bi bi-robot fs-2 text-primary mb-2"></i>
                <h6 class="fw-bold">AI Tutor সাহায্য চান?</h6>
                <p class="text-muted small mb-3">যেকোনো প্রশ্ন করুন — বাংলায়!</p>
                <a routerLink="/ai-tutor" class="btn btn-primary rounded-pill w-100">
                  <i class="bi bi-chat-dots me-2"></i>Ask AI Tutor
                </a>
              </div>
            </div>

            <!-- Reset Demo Button -->
            <div class="card border-0 border-danger mt-4" style="border-style:dashed!important; border-width:1px!important">
              <div class="card-body p-3 text-center">
                <p class="text-muted small mb-2">Reset all demo data (localStorage)</p>
                <button class="btn btn-sm btn-outline-danger" (click)="resetDemo()">
                  <i class="bi bi-arrow-clockwise me-1"></i>Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-card { border-radius: 20px !important; background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%); }
    .avatar-lg { width: 56px; height: 56px; background: #1d3557; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; flex-shrink: 0; }
    .subject-icon-sm { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bar-chart-bar { width: 100%; min-width: 12px; transition: height 0.5s ease; }
    .quick-action-btn { transition: all 0.2s; border: 1px solid transparent; }
    .quick-action-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); }
    .streak-circle { width: 90px; height: 90px; background: linear-gradient(135deg, #e63946, #ff6b6b); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .streak-number { color: white; font-size: 2rem; font-weight: 800; line-height: 1; }
    .streak-label { color: rgba(255,255,255,0.8); font-size: 0.75rem; }
    .streak-dot { width: 18px; height: 18px; border-radius: 50%; background: #e9ecef; border: 2px solid #dee2e6; }
    .streak-dot.active { background: #e63946; border-color: #e63946; }
    .ai-cta-card { background: linear-gradient(135deg, #f0f4ff, #e8f5e9); border-radius: 16px !important; }
  `]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  streak = { currentStreak: 0, longestStreak: 0, lastStudyDate: '', studyDates: [] as string[] };
  avgScore = 0;
  totalStudied = 0;
  selectedClass = 9;
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  last7Days: string[] = [];

  weeklyData = [
    { label: 'Sat', score: 65, isToday: false },
    { label: 'Sun', score: 70, isToday: false },
    { label: 'Mon', score: 68, isToday: false },
    { label: 'Tue', score: 75, isToday: false },
    { label: 'Wed', score: 72, isToday: false },
    { label: 'Thu', score: 80, isToday: false },
    { label: 'Fri', score: 77, isToday: true },
  ];

  recentScores = [
    { subject: 'Mathematics MCQ', date: '2 hours ago', percent: 85 },
    { subject: 'Physics Mock Test', date: 'Yesterday', percent: 72 },
    { subject: 'English Grammar', date: '3 days ago', percent: 90 },
    { subject: 'Science Chapter Test', date: '5 days ago', percent: 58 },
  ];

  quickActions = [
    { label: 'MCQ Practice', route: '/mcq', icon: 'bi-check2-square', color: '#2d6a4f' },
    { label: 'Video Lesson', route: '/videos', icon: 'bi-play-circle-fill', color: '#e63946' },
    { label: 'Mock Test', route: '/mock-test', icon: 'bi-clock-fill', color: '#f4a261' },
    { label: 'AI Tutor', route: '/ai-tutor', icon: 'bi-robot', color: '#6a4c93' },
    { label: 'Question Bank', route: '/question-bank', icon: 'bi-database', color: '#0077b6' },
    { label: 'PDF Downloads', route: '/pdf-downloads', icon: 'bi-file-pdf', color: '#d62828' },
    { label: 'CQ Practice', route: '/cq', icon: 'bi-journal-text', color: '#bc6c25' },
    { label: 'Analytics', route: '/analytics', icon: 'bi-bar-chart', color: '#1d3557' },
  ];

  constructor(
    public demoData: DemoDataService,
    private authService: AuthService,
    private progressService: ProgressService,
    private quizService: QuizService,
    private ls: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.selectedClass = this.user?.class || 9;
    this.streak = this.progressService.getStreak();
    this.avgScore = this.quizService.getAverageScore() || 74;
    this.totalStudied = this.progressService.getProgress().length || 12;
    this.buildLast7Days();
  }

  buildLast7Days(): void {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      this.last7Days.push(d.toDateString());
    }
  }

  isStudiedDay(day: string): boolean {
    return this.streak.studyDates?.includes(day) || Math.random() > 0.4;
  }

  getSubjectProgress(subjectId: string): number {
    const map: { [k: string]: number } = { math: 65, english: 80, science: 45, physics: 55, ict: 90 };
    return map[subjectId] || Math.floor(Math.random() * 60 + 20);
  }

  changeClass(): void {
    this.authService.updateUserClass(Number(this.selectedClass));
  }

  resetDemo(): void {
    if (confirm('Reset all demo data? This will clear localStorage.')) {
      this.ls.resetAll();
      location.reload();
    }
  }
}

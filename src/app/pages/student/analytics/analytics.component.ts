import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../services/progress.service';
import { QuizService } from '../../../services/quiz.service';
import { AuthService } from '../../../services/auth.service';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent],
  template: `
    <div class="analytics-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="fw-bold mb-1">📊 Performance Analytics</h3>
            <p class="text-muted mb-0">Track your progress, identify strengths and weaknesses</p>
          </div>
          <span class="badge bg-primary-subtle text-primary px-3 py-2">Class {{ userClass }}</span>
        </div>

        <!-- Stat Cards Row -->
        <div class="row g-4 mb-4">
          <div class="col-md-3 col-6">
            <app-stat-card label="Average Score" [value]="analytics.averageScore + '%'" icon="bi-trophy-fill" color="#1d3557" [trend]="8"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Total Study Hours" [value]="analytics.totalStudyHours + 'h'" icon="bi-clock-fill" color="#2d6a4f" [trend]="15"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="MCQ Accuracy" [value]="analytics.accuracyPercent + '%'" icon="bi-bullseye" color="#f4a261" [trend]="-2"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Study Streak" [value]="streak.currentStreak + ' days'" icon="bi-fire" color="#e63946"></app-stat-card>
          </div>
        </div>

        <div class="row g-4">
          <!-- Weekly Score Chart -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 d-flex justify-content-between">
                <h6 class="fw-bold mb-0">📈 Weekly Score Trend</h6>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm" [class.btn-primary]="chartView === 'weekly'" [class.btn-outline-secondary]="chartView !== 'weekly'" (click)="chartView = 'weekly'">Weekly</button>
                  <button class="btn btn-sm" [class.btn-primary]="chartView === 'monthly'" [class.btn-outline-secondary]="chartView !== 'monthly'" (click)="chartView = 'monthly'">Monthly</button>
                </div>
              </div>
              <div class="card-body">
                <div class="chart-wrapper" *ngIf="chartView === 'weekly'">
                  <div class="d-flex align-items-end gap-3 justify-content-between" style="height:200px; padding: 0 10px">
                    <div *ngFor="let val of analytics.weeklyScores; let i = index" class="chart-col d-flex flex-column align-items-center gap-2 flex-grow-1">
                      <span class="small text-muted fw-medium">{{ val }}%</span>
                      <div class="chart-bar rounded-top"
                           [style.height]="(val / 100 * 160) + 'px'"
                           [style.background]="getBarColor(val)">
                      </div>
                      <span class="small text-muted">{{ weekLabels[i] }}</span>
                    </div>
                  </div>
                </div>
                <div class="chart-wrapper" *ngIf="chartView === 'monthly'">
                  <div class="d-flex align-items-end gap-2 justify-content-between" style="height:200px; padding: 0 5px">
                    <div *ngFor="let val of analytics.monthlyScores; let i = index" class="chart-col d-flex flex-column align-items-center gap-1 flex-grow-1">
                      <span class="small text-muted fw-medium" style="font-size:0.6rem">{{ val }}%</span>
                      <div class="chart-bar rounded-top"
                           [style.height]="(val / 100 * 160) + 'px'"
                           [style.background]="getBarColor(val)">
                      </div>
                      <span class="small text-muted" style="font-size:0.6rem">{{ monthLabels[i] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subject-wise Scores -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">📚 Subject-wise Performance</h6>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-3">
                  <div *ngFor="let item of subjectScoreItems">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="small fw-medium">{{ item.name }}</span>
                      <div class="d-flex align-items-center gap-2">
                        <span class="small fw-bold" [style.color]="item.color">{{ item.score }}%</span>
                        <span class="badge rounded-pill small" [class]="item.score >= 80 ? 'bg-success' : item.score >= 60 ? 'bg-warning text-dark' : 'bg-danger'">
                          {{ item.score >= 80 ? '🟢' : item.score >= 60 ? '🟡' : '🔴' }}
                        </span>
                      </div>
                    </div>
                    <div class="progress" style="height:10px">
                      <div class="progress-bar rounded-pill" [style.width]="item.score + '%'" [style.background]="item.color"
                           style="transition: width 1s ease">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Strong Chapters -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-success-subtle border-0">
                <h6 class="fw-bold text-success mb-0">💪 Strong Chapters</h6>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-2">
                  <div *ngFor="let ch of analytics.strongChapters" class="d-flex align-items-center gap-2 p-2 rounded-3 bg-success-subtle">
                    <i class="bi bi-check-circle-fill text-success"></i>
                    <span class="small fw-medium">{{ ch }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Weak Chapters -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-danger-subtle border-0">
                <h6 class="fw-bold text-danger mb-0">⚠️ Needs Improvement</h6>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-2">
                  <div *ngFor="let ch of analytics.weakChapters" class="d-flex align-items-center gap-2 p-2 rounded-3 bg-danger-subtle">
                    <i class="bi bi-exclamation-circle-fill text-danger"></i>
                    <span class="small fw-medium">{{ ch }}</span>
                  </div>
                </div>
                <a routerLink="/mcq" class="btn btn-sm btn-outline-danger w-100 mt-3 rounded-pill">Practice Weak Areas</a>
              </div>
            </div>

            <!-- Study Calendar Heatmap -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">📅 Study Calendar</h6>
              </div>
              <div class="card-body">
                <div class="calendar-grid">
                  <div *ngFor="let day of calendarDays"
                       class="calendar-day"
                       [class.studied]="day.studied"
                       [class.today]="day.isToday"
                       [title]="day.date">
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3 mt-3 justify-content-end">
                  <div class="d-flex align-items-center gap-1"><div class="legend-dot bg-light border"></div><span class="small text-muted">No study</span></div>
                  <div class="d-flex align-items-center gap-1"><div class="legend-dot bg-primary"></div><span class="small text-muted">Studied</span></div>
                </div>
              </div>
            </div>

            <!-- Accuracy Gauge -->
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <h6 class="fw-bold mb-3">🎯 Accuracy Rate</h6>
                <div class="accuracy-ring mx-auto mb-3" [class]="getAccuracyClass()">
                  <span class="fw-bold fs-4">{{ analytics.accuracyPercent }}%</span>
                </div>
                <p class="text-muted small mb-0">
                  {{ analytics.accuracyPercent >= 80 ? 'Excellent! Keep it up!' : analytics.accuracyPercent >= 60 ? 'Good progress. Practice more!' : 'Focus on weak areas daily.' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-bar { min-height: 10px; min-width: 20px; transition: height 0.8s ease; }
    .chart-col { max-width: 60px; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
    .calendar-day { width: 100%; aspect-ratio: 1; border-radius: 3px; background: #e9ecef; transition: all 0.2s; }
    .calendar-day.studied { background: #1d3557; }
    .calendar-day.today { background: #e63946; transform: scale(1.2); }
    .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
    .accuracy-ring { width: 100px; height: 100px; border-radius: 50%; border: 6px solid; display: flex; align-items: center; justify-content: center; }
  `]
})
export class AnalyticsComponent implements OnInit {
  analytics: any = {};
  streak: any = {};
  chartView: 'weekly' | 'monthly' = 'weekly';
  userClass = 9;
  calendarDays: { date: string; studied: boolean; isToday: boolean }[] = [];

  weekLabels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  subjectScoreItems = [
    { name: 'ICT', score: 85, color: '#0077b6' },
    { name: 'English', score: 80, color: '#457b9d' },
    { name: 'Bangla', score: 78, color: '#e63946' },
    { name: 'Mathematics', score: 70, color: '#2d6a4f' },
    { name: 'Science', score: 75, color: '#6a4c93' },
    { name: 'Physics', score: 65, color: '#f4a261' },
  ];

  constructor(private progressService: ProgressService, private quizService: QuizService, private authService: AuthService) {}

  ngOnInit(): void {
    this.analytics = this.progressService.getAnalytics();
    this.streak = this.progressService.getStreak();
    this.userClass = this.authService.getCurrentUser()?.class || 9;
    this.buildCalendar();
  }

  buildCalendar(): void {
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400000);
      this.calendarDays.push({ date: d.toDateString(), studied: Math.random() > 0.4, isToday: i === 0 });
    }
  }

  getBarColor(val: number): string {
    if (val >= 80) return '#2d6a4f';
    if (val >= 60) return '#f4a261';
    return '#e63946';
  }

  getAccuracyClass(): string {
    const pct = this.analytics.accuracyPercent;
    if (pct >= 80) return 'border-success';
    if (pct >= 60) return 'border-warning';
    return 'border-danger';
  }
}

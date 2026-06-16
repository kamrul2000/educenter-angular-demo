import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatCardComponent],
  template: `
    <div class="parent-dashboard py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Header -->
        <div class="parent-header card border-0 shadow-sm mb-4 p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <div class="d-flex align-items-center gap-3">
                <div class="parent-avatar">👨‍👩‍👧</div>
                <div>
                  <h4 class="fw-bold mb-1">Parent Dashboard</h4>
                  <p class="text-muted mb-0">Monitoring: <strong>Rahim Ahmed</strong> — Class 9</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <span class="badge bg-success px-3 py-2">✅ Active Learner</span>
              <p class="text-muted small mt-1 mb-0">Last active: 2 hours ago</p>
            </div>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="row g-4 mb-4">
          <div class="col-md-3 col-6">
            <app-stat-card label="Study Hours This Week" value="14h 30m" icon="bi-clock-fill" color="#1d3557" [trend]="20"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Avg Test Score" value="74%" icon="bi-trophy-fill" color="#2d6a4f" [trend]="8"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="MCQ Accuracy" value="68%" icon="bi-bullseye" color="#f4a261" [trend]="-3"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Study Streak" value="7 Days" icon="bi-fire" color="#e63946"></app-stat-card>
          </div>
        </div>

        <div class="row g-4">
          <!-- Left Column -->
          <div class="col-lg-8">

            <!-- Weekly Study Chart -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">📊 Weekly Study Hours</h6>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-end gap-3 justify-content-between" style="height:150px">
                  <div *ngFor="let d of weeklyStudy" class="d-flex flex-column align-items-center gap-1 flex-grow-1">
                    <small class="text-muted">{{ d.hours }}h</small>
                    <div class="rounded-top" [style.height]="(d.hours / 5 * 120) + 'px'" [style.background]="d.hours >= 3 ? '#2d6a4f' : d.hours >= 1 ? '#f4a261' : '#dee2e6'" style="width:100%; min-width:20px"></div>
                    <small class="text-muted">{{ d.day }}</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subject Performance -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0 d-flex justify-content-between">
                <h6 class="fw-bold mb-0">📚 Subject Performance</h6>
                <span class="badge bg-primary-subtle text-primary">Class 9</span>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-3">
                  <div *ngFor="let s of subjectPerformance">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small fw-medium">{{ s.name }}</span>
                      <div class="d-flex align-items-center gap-2">
                        <span class="small fw-bold">{{ s.score }}%</span>
                        <span class="badge rounded-pill small" [class]="s.score >= 75 ? 'bg-success' : s.score >= 55 ? 'bg-warning text-dark' : 'bg-danger'">
                          {{ s.score >= 75 ? 'Strong' : s.score >= 55 ? 'Average' : 'Weak' }}
                        </span>
                      </div>
                    </div>
                    <div class="progress" style="height:8px">
                      <div class="progress-bar rounded-pill" [style.width]="s.score + '%'" [style.background]="s.color"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Test Results -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">🏆 Recent Test Results</h6>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th class="py-3">Test</th>
                        <th class="py-3">Subject</th>
                        <th class="py-3">Score</th>
                        <th class="py-3">Date</th>
                        <th class="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let r of testResults">
                        <td class="small">{{ r.test }}</td>
                        <td class="small">{{ r.subject }}</td>
                        <td class="small fw-bold">{{ r.score }}/{{ r.total }}</td>
                        <td class="small text-muted">{{ r.date }}</td>
                        <td><span class="badge" [class]="r.percent >= 75 ? 'bg-success' : r.percent >= 50 ? 'bg-warning text-dark' : 'bg-danger'">{{ r.percent >= 75 ? 'Pass' : r.percent >= 50 ? 'Average' : 'Needs Work' }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">

            <!-- Weak Subjects Alert -->
            <div class="card border-0 shadow-sm mb-4" style="border-left: 4px solid #dc3545">
              <div class="card-header bg-danger-subtle border-0">
                <h6 class="fw-bold text-danger mb-0">⚠️ Needs Attention</h6>
              </div>
              <div class="card-body">
                <p class="text-muted small mb-3">Your child needs extra focus on:</p>
                <div *ngFor="let s of weakSubjects" class="d-flex align-items-center gap-2 mb-2 p-2 rounded-3 bg-danger-subtle">
                  <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                  <span class="small fw-medium">{{ s }}</span>
                </div>
                <a routerLink="/ai-study-plan" class="btn btn-sm btn-danger w-100 mt-2 rounded-pill">Create Study Plan</a>
              </div>
            </div>

            <!-- Attendance -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">📅 Study Attendance</h6>
              </div>
              <div class="card-body text-center">
                <div class="attendance-ring mx-auto mb-2">
                  <span class="fw-bold fs-4 text-success">87%</span>
                </div>
                <p class="text-muted small">This Month — 26/30 active days</p>
                <div class="d-flex justify-content-around mt-3">
                  <div class="text-center">
                    <div class="fw-bold text-success">26</div>
                    <small class="text-muted">Present</small>
                  </div>
                  <div class="text-center">
                    <div class="fw-bold text-danger">4</div>
                    <small class="text-muted">Absent</small>
                  </div>
                  <div class="text-center">
                    <div class="fw-bold text-warning">7</div>
                    <small class="text-muted">Streak</small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alert Preview -->
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h6 class="fw-bold mb-0">📱 Alert Settings</h6>
              </div>
              <div class="card-body">
                <div class="d-flex flex-column gap-2">
                  <div *ngFor="let alert of alertSettings" class="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light">
                    <span class="small">{{ alert.label }}</span>
                    <div class="form-check form-switch mb-0">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="alert.enabled" [ngModelOptions]="{standalone: true}">
                    </div>
                  </div>
                </div>
                <button class="btn btn-sm btn-success w-100 mt-3 rounded-pill" (click)="showAlertPreview = true">
                  <i class="bi bi-whatsapp me-2"></i>Preview WhatsApp Alert
                </button>
                <div *ngIf="showAlertPreview" class="whatsapp-preview mt-3 p-3 rounded-3">
                  <div class="small fw-bold text-success mb-1">📱 EduCenter Alert</div>
                  <div class="small text-dark">🎓 Rahim completed Math MCQ with 85% score today! Keep encouraging him. 💪</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .parent-header { border-radius: 20px !important; background: linear-gradient(135deg, #fff, #f0fff4); }
    .parent-avatar { font-size: 2.5rem; }
    .attendance-ring { width: 90px; height: 90px; border-radius: 50%; border: 6px solid #28a745; display: flex; align-items: center; justify-content: center; }
    .whatsapp-preview { background: #e8f9f0; border: 1px solid #25D366; }
  `]
})
export class ParentDashboardComponent {
  showAlertPreview = false;

  weeklyStudy = [
    { day: 'Sat', hours: 3 }, { day: 'Sun', hours: 4 }, { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 0 }, { day: 'Wed', hours: 3.5 }, { day: 'Thu', hours: 1 }, { day: 'Fri', hours: 1 },
  ];

  subjectPerformance = [
    { name: 'Mathematics', score: 55, color: '#2d6a4f' },
    { name: 'English', score: 80, color: '#457b9d' },
    { name: 'Physics', score: 48, color: '#f4a261' },
    { name: 'Bangla', score: 78, color: '#e63946' },
    { name: 'ICT', score: 92, color: '#0077b6' },
    { name: 'Science', score: 62, color: '#6a4c93' },
  ];

  testResults = [
    { test: 'Math Mock Test #3', subject: 'Mathematics', score: 18, total: 25, percent: 72, date: 'June 14' },
    { test: 'Physics Chapter Test', subject: 'Physics', score: 12, total: 20, percent: 60, date: 'June 12' },
    { test: 'English MCQ', subject: 'English', score: 23, total: 25, percent: 92, date: 'June 10' },
    { test: 'Science Weekly', subject: 'Science', score: 11, total: 20, percent: 55, date: 'June 7' },
  ];

  weakSubjects = ['Physics (48%)', 'Mathematics (55%)'];

  alertSettings = [
    { label: '📊 Daily score update', enabled: true },
    { label: '⏰ Study inactivity (2h)', enabled: true },
    { label: '🏆 Achievement unlocked', enabled: false },
    { label: '📝 Test result available', enabled: true },
    { label: '🔴 Low score alert (<50%)', enabled: true },
  ];
}

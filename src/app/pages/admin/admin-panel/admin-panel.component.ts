import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatCardComponent],
  template: `
    <div class="admin-panel py-4 bg-light min-vh-100">
      <div class="container-fluid px-4">

        <!-- Header -->
        <div class="admin-header card border-0 shadow-sm mb-4 p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <div class="admin-icon"><i class="bi bi-shield-fill-check text-white fs-3"></i></div>
              <div>
                <h4 class="fw-bold mb-0">Admin Panel</h4>
                <p class="text-muted mb-0 small">EduCenter Platform Management</p>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-danger btn-sm rounded-pill" (click)="resetAllData()">
                <i class="bi bi-arrow-clockwise me-1"></i>Reset Demo Data
              </button>
            </div>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="row g-4 mb-4">
          <div class="col-md-2 col-6">
            <app-stat-card label="Active Users" value="52,481" icon="bi-people-fill" color="#1d3557" [trend]="8"></app-stat-card>
          </div>
          <div class="col-md-2 col-6">
            <app-stat-card label="Monthly Revenue" value="৳4.2L" icon="bi-currency-rupee" color="#2d6a4f" [trend]="15"></app-stat-card>
          </div>
          <div class="col-md-2 col-6">
            <app-stat-card label="Total Students" value="48,320" icon="bi-mortarboard" color="#457b9d"></app-stat-card>
          </div>
          <div class="col-md-2 col-6">
            <app-stat-card label="Total Teachers" value="124" icon="bi-person-workspace" color="#6a4c93"></app-stat-card>
          </div>
          <div class="col-md-2 col-6">
            <app-stat-card label="Videos Hosted" value="1,248" icon="bi-play-circle" color="#f4a261"></app-stat-card>
          </div>
          <div class="col-md-2 col-6">
            <app-stat-card label="Course Completion" value="68%" icon="bi-graph-up" color="#e63946" [trend]="5"></app-stat-card>
          </div>
        </div>

        <!-- Tab Navigation -->
        <ul class="nav nav-pills gap-2 mb-4 flex-wrap">
          <li class="nav-item" *ngFor="let tab of tabs">
            <button class="nav-link" [class.active]="activeTab === tab.id" (click)="activeTab = tab.id">
              <i class="bi me-1" [class]="tab.icon"></i>{{ tab.label }}
            </button>
          </li>
        </ul>

        <!-- Students Tab -->
        <div *ngIf="activeTab === 'students'">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 class="fw-bold mb-0">👨‍🎓 Manage Students</h6>
              <div class="d-flex gap-2">
                <input type="text" class="form-control form-control-sm" [(ngModel)]="searchStudent" placeholder="Search students...">
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr><th>Name</th><th>Email</th><th>Class</th><th>Join Date</th><th>Plan</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of filteredStudents">
                    <td class="small fw-medium">{{ s.name }}</td>
                    <td class="small text-muted">{{ s.email }}</td>
                    <td class="small">Class {{ s.class }}</td>
                    <td class="small text-muted">{{ s.joinDate }}</td>
                    <td><span class="badge" [class]="s.plan === 'Premium' ? 'bg-warning text-dark' : s.plan === 'Basic' ? 'bg-primary' : 'bg-secondary'">{{ s.plan }}</span></td>
                    <td><span class="badge" [class]="s.active ? 'bg-success' : 'bg-danger'">{{ s.active ? 'Active' : 'Inactive' }}</span></td>
                    <td>
                      <div class="d-flex gap-1">
                        <button class="btn btn-xs btn-outline-primary" title="View"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-xs btn-outline-danger" title="Block"><i class="bi bi-slash-circle"></i></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Subjects Tab -->
        <div *ngIf="activeTab === 'subjects'">
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="card border-0 shadow-sm p-4">
                <h6 class="fw-bold mb-3">➕ Add Subject</h6>
                <input type="text" class="form-control mb-2" [(ngModel)]="newSubjectName" placeholder="Subject name">
                <input type="text" class="form-control mb-2" [(ngModel)]="newSubjectNameBn" placeholder="বাংলা নাম">
                <div class="d-flex gap-2 mb-3">
                  <input type="number" class="form-control" [(ngModel)]="newSubjectClassFrom" placeholder="From Class" min="6" max="10">
                  <input type="number" class="form-control" [(ngModel)]="newSubjectClassTo" placeholder="To Class" min="6" max="10">
                </div>
                <button class="btn btn-primary w-100 rounded-pill" (click)="addSubject()">
                  <i class="bi bi-plus-circle me-2"></i>Add Subject
                </button>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">All Subjects ({{ adminSubjects.length }})</h6></div>
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light"><tr><th>Subject</th><th>Bangla</th><th>Classes</th><th>Chapters</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      <tr *ngFor="let s of adminSubjects">
                        <td class="small fw-medium">{{ s.name }}</td>
                        <td class="small bangla-text">{{ s.nameBn }}</td>
                        <td class="small">{{ s.classes }}</td>
                        <td class="small">{{ s.chapters }}</td>
                        <td><span class="badge bg-success">Active</span></td>
                        <td>
                          <div class="d-flex gap-1">
                            <button class="btn btn-xs btn-outline-primary"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-xs btn-outline-danger"><i class="bi bi-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab === 'analytics'">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">📊 Revenue by Plan</h6></div>
                <div class="card-body">
                  <div *ngFor="let r of revenuePlans" class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small fw-medium">{{ r.plan }}</span>
                      <span class="small fw-bold">৳{{ r.amount }}</span>
                    </div>
                    <div class="progress" style="height:10px">
                      <div class="progress-bar rounded-pill" [style.width]="r.percent + '%'" [style.background]="r.color"></div>
                    </div>
                    <small class="text-muted">{{ r.users }} users</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">📈 User Growth (Monthly)</h6></div>
                <div class="card-body">
                  <div class="d-flex align-items-end gap-2 justify-content-between" style="height:150px">
                    <div *ngFor="let m of userGrowth" class="d-flex flex-column align-items-center gap-1 flex-grow-1">
                      <span class="small text-muted" style="font-size:0.6rem">{{ m.users }}</span>
                      <div class="rounded-top bg-primary" [style.height]="(m.users / 6000 * 130) + 'px'" style="width:100%; min-height:5px"></div>
                      <span class="small text-muted" style="font-size:0.6rem">{{ m.month }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="col-12">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">🔔 Recent Activity Log</h6></div>
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 px-3 py-2" *ngFor="let log of activityLog">
                    <div class="d-flex align-items-center gap-3">
                      <div class="log-icon" [class]="log.bgClass"><i class="bi small" [class]="log.icon"></i></div>
                      <div class="flex-grow-1">
                        <span class="small fw-medium">{{ log.message }}</span>
                      </div>
                      <span class="text-muted small">{{ log.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Bank Management -->
        <div *ngIf="activeTab === 'qbank'">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between">
              <h6 class="fw-bold mb-0">🗄️ Question Bank Management</h6>
              <button class="btn btn-sm btn-primary rounded-pill"><i class="bi bi-plus me-1"></i>Add Question</button>
            </div>
            <div class="card-body">
              <div class="row g-3 mb-4">
                <div class="col-md-3 col-6" *ngFor="let stat of qbankStats">
                  <div class="qbank-stat text-center p-3 rounded-3" [style.background]="stat.color + '15'">
                    <div class="fw-bold fs-4" [style.color]="stat.color">{{ stat.count }}</div>
                    <div class="small text-muted">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light"><tr><th>Subject</th><th>MCQ</th><th>CQ</th><th>Board Questions</th><th>Action</th></tr></thead>
                  <tbody>
                    <tr *ngFor="let s of qbankTable">
                      <td class="small fw-medium">{{ s.subject }}</td>
                      <td><span class="badge bg-success">{{ s.mcq }}</span></td>
                      <td><span class="badge bg-primary">{{ s.cq }}</span></td>
                      <td><span class="badge bg-warning text-dark">{{ s.board }}</span></td>
                      <td><button class="btn btn-xs btn-outline-primary">Manage</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-header { border-radius: 20px !important; background: linear-gradient(135deg, #fff, #f0f4ff); }
    .admin-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #1d3557, #457b9d); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .nav-link { border-radius: 20px; font-weight: 500; }
    .btn-xs { padding: 2px 8px; font-size: 0.75rem; }
    .log-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  `]
})
export class AdminPanelComponent implements OnInit {
  activeTab = 'students';
  searchStudent = '';

  tabs = [
    { id: 'students', label: 'Students', icon: 'bi-people' },
    { id: 'subjects', label: 'Subjects', icon: 'bi-book' },
    { id: 'qbank', label: 'Question Bank', icon: 'bi-database' },
    { id: 'analytics', label: 'Analytics', icon: 'bi-bar-chart' },
  ];

  allStudents = [
    { name: 'Rahim Ahmed', email: 'rahim@email.com', class: 9, joinDate: 'Jan 2024', plan: 'Premium', active: true },
    { name: 'Karim Islam', email: 'karim@email.com', class: 8, joinDate: 'Feb 2024', plan: 'Basic', active: true },
    { name: 'Fatema Khatun', email: 'fatema@email.com', class: 10, joinDate: 'Mar 2024', plan: 'Free', active: false },
    { name: 'Nusrat Jahan', email: 'nusrat@email.com', class: 7, joinDate: 'Apr 2024', plan: 'Premium', active: true },
    { name: 'Rifat Hossain', email: 'rifat@email.com', class: 9, joinDate: 'May 2024', plan: 'Basic', active: true },
    { name: 'Sabina Akter', email: 'sabina@email.com', class: 6, joinDate: 'Jun 2024', plan: 'Free', active: true },
  ];

  get filteredStudents() {
    return this.allStudents.filter(s => !this.searchStudent || s.name.toLowerCase().includes(this.searchStudent.toLowerCase()) || s.email.toLowerCase().includes(this.searchStudent.toLowerCase()));
  }

  adminSubjects = [
    { name: 'Mathematics', nameBn: 'গণিত', classes: '6-10', chapters: 42 },
    { name: 'English', nameBn: 'ইংরেজি', classes: '6-10', chapters: 36 },
    { name: 'Bangla', nameBn: 'বাংলা', classes: '6-10', chapters: 30 },
    { name: 'Physics', nameBn: 'পদার্থবিজ্ঞান', classes: '9-10', chapters: 18 },
    { name: 'Science', nameBn: 'বিজ্ঞান', classes: '6-8', chapters: 24 },
    { name: 'ICT', nameBn: 'তথ্য প্রযুক্তি', classes: '6-10', chapters: 15 },
  ];

  newSubjectName = ''; newSubjectNameBn = ''; newSubjectClassFrom = 6; newSubjectClassTo = 10;

  revenuePlans = [
    { plan: 'Premium (৳199/mo)', amount: '2,81,800', users: '1415', percent: 65, color: '#1d3557' },
    { plan: 'Basic (৳99/mo)', amount: '98,010', users: '990', percent: 23, color: '#2d6a4f' },
    { plan: 'Annual (৳999/yr)', amount: '59,940', users: '60', percent: 12, color: '#f4a261' },
  ];

  userGrowth = [
    { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1800 }, { month: 'Mar', users: 2400 },
    { month: 'Apr', users: 3100 }, { month: 'May', users: 4200 }, { month: 'Jun', users: 5500 },
  ];

  activityLog = [
    { icon: 'bi-person-plus-fill', message: 'New student registered: Arif Hossain (Class 9)', time: '2m ago', bgClass: 'bg-success-subtle' },
    { icon: 'bi-credit-card-fill', message: 'Premium subscription purchased — Nadia Islam', time: '15m ago', bgClass: 'bg-warning-subtle' },
    { icon: 'bi-play-circle-fill', message: 'Teacher uploaded: "Physics Chapter 3 Video"', time: '1h ago', bgClass: 'bg-primary-subtle' },
    { icon: 'bi-trophy-fill', message: 'Mock test completed: 48 students in Math Mock #3', time: '2h ago', bgClass: 'bg-info-subtle' },
    { icon: 'bi-exclamation-triangle-fill', message: 'Low score alert: Karim (38%) in Physics', time: '3h ago', bgClass: 'bg-danger-subtle' },
  ];

  qbankStats = [
    { label: 'Total Questions', count: '10,482', color: '#1d3557' },
    { label: 'MCQ Questions', count: '8,240', color: '#2d6a4f' },
    { label: 'CQ Questions', count: '2,242', color: '#f4a261' },
    { label: 'Board Questions', count: '5,120', color: '#6a4c93' },
  ];

  qbankTable = [
    { subject: 'Mathematics', mcq: 2450, cq: 480, board: 1200 },
    { subject: 'English', mcq: 1820, cq: 360, board: 960 },
    { subject: 'Physics', mcq: 1340, cq: 280, board: 720 },
    { subject: 'Science', mcq: 1200, cq: 240, board: 640 },
    { subject: 'ICT', mcq: 890, cq: 120, board: 320 },
    { subject: 'Bangla', mcq: 540, cq: 762, board: 280 },
  ];

  constructor(private ls: LocalStorageService) {}

  ngOnInit(): void {}

  addSubject(): void {
    if (!this.newSubjectName) return;
    this.adminSubjects.push({ name: this.newSubjectName, nameBn: this.newSubjectNameBn, classes: `${this.newSubjectClassFrom}-${this.newSubjectClassTo}`, chapters: 0 });
    this.newSubjectName = ''; this.newSubjectNameBn = '';
  }

  resetAllData(): void {
    if (confirm('Reset ALL demo data from localStorage? This cannot be undone.')) {
      this.ls.resetAll();
      location.reload();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { StatCardComponent } from '../../../components/stat-card/stat-card.component';

interface TeacherNote { id: string; title: string; subject: string; class: number; date: string; }
interface LiveClass { id: string; title: string; subject: string; date: string; time: string; platform: string; }

@Component({
  selector: 'app-teacher-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatCardComponent],
  template: `
    <div class="teacher-panel py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Header -->
        <div class="teacher-header card border-0 shadow-sm mb-4 p-4">
          <div class="d-flex align-items-center gap-3">
            <div class="teacher-avatar">👩‍🏫</div>
            <div>
              <h4 class="fw-bold mb-1">Teacher Panel</h4>
              <p class="text-muted mb-0">Ms. Fatema Islam • Mathematics & Physics Teacher</p>
            </div>
            <span class="ms-auto badge bg-success px-3 py-2">Live Class Active</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="row g-4 mb-4">
          <div class="col-md-3 col-6">
            <app-stat-card label="My Students" value="248" icon="bi-people-fill" color="#1d3557" [trend]="12"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Notes Uploaded" value="34" icon="bi-journal-fill" color="#2d6a4f"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Exams Created" value="12" icon="bi-clipboard-check" color="#f4a261"></app-stat-card>
          </div>
          <div class="col-md-3 col-6">
            <app-stat-card label="Videos Uploaded" value="28" icon="bi-camera-video" color="#6a4c93"></app-stat-card>
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

        <!-- Upload Notes Tab -->
        <div *ngIf="activeTab === 'notes'">
          <div class="row g-4">
            <div class="col-lg-5">
              <div class="card border-0 shadow-sm p-4">
                <h6 class="fw-bold mb-3">📝 Upload Notes</h6>
                <div class="mb-3">
                  <label class="form-label fw-medium">Title</label>
                  <input type="text" class="form-control" [(ngModel)]="newNote.title" placeholder="Note title...">
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Subject</label>
                  <select class="form-select" [(ngModel)]="newNote.subject">
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Class</label>
                  <select class="form-select" [(ngModel)]="newNote.class">
                    <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
                  </select>
                </div>
                <div class="upload-zone text-center p-4 rounded-3 mb-3" style="border:2px dashed #dee2e6">
                  <i class="bi bi-file-earmark-arrow-up fs-2 text-muted"></i>
                  <p class="text-muted small mb-0">Click to upload PDF / DOCX</p>
                </div>
                <button class="btn btn-primary w-100 rounded-pill fw-bold" (click)="uploadNote()">
                  <i class="bi bi-upload me-2"></i>Upload Note
                </button>
                <div *ngIf="noteToast" class="alert alert-success mt-2 py-2 small">
                  <i class="bi bi-check-circle me-1"></i>{{ noteToast }}
                </div>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 d-flex justify-content-between">
                  <h6 class="fw-bold mb-0">Uploaded Notes ({{ notes.length }})</h6>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light"><tr><th>Title</th><th>Subject</th><th>Class</th><th>Date</th><th>Action</th></tr></thead>
                      <tbody>
                        <tr *ngFor="let n of notes">
                          <td class="small fw-medium">{{ n.title }}</td>
                          <td><span class="badge bg-primary-subtle text-primary">{{ n.subject }}</span></td>
                          <td class="small">Class {{ n.class }}</td>
                          <td class="small text-muted">{{ n.date }}</td>
                          <td>
                            <button class="btn btn-sm btn-outline-danger" (click)="deleteNote(n.id)"><i class="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Exam Tab -->
        <div *ngIf="activeTab === 'exam'">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm p-4">
                <h6 class="fw-bold mb-4">📋 Create New Exam</h6>
                <div class="mb-3">
                  <label class="form-label fw-medium">Exam Title</label>
                  <input type="text" class="form-control" [(ngModel)]="newExam.title" placeholder="e.g. Chapter 3 MCQ Test">
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <label class="form-label fw-medium">Subject</label>
                    <select class="form-select" [(ngModel)]="newExam.subject">
                      <option>Mathematics</option><option>Physics</option><option>Science</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <label class="form-label fw-medium">Class</label>
                    <select class="form-select" [(ngModel)]="newExam.class">
                      <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
                    </select>
                  </div>
                </div>
                <div class="row g-2 mb-4">
                  <div class="col-6">
                    <label class="form-label fw-medium">Duration (min)</label>
                    <input type="number" class="form-control" [(ngModel)]="newExam.duration" placeholder="30">
                  </div>
                  <div class="col-6">
                    <label class="form-label fw-medium">Total Marks</label>
                    <input type="number" class="form-control" [(ngModel)]="newExam.marks" placeholder="25">
                  </div>
                </div>
                <button class="btn btn-success w-100 rounded-pill fw-bold" (click)="createExam()">
                  <i class="bi bi-plus-circle me-2"></i>Create Exam
                </button>
                <div *ngIf="examToast" class="alert alert-success mt-2 py-2 small">
                  <i class="bi bi-check-circle me-1"></i>{{ examToast }}
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">Created Exams ({{ exams.length }})</h6></div>
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 px-3 py-3" *ngFor="let e of exams">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <div class="fw-semibold small">{{ e.title }}</div>
                        <div class="text-muted small">{{ e.subject }} • Class {{ e.class }} • {{ e.duration }}min</div>
                      </div>
                      <span class="badge bg-primary">{{ e.marks }} marks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Class Tab -->
        <div *ngIf="activeTab === 'live'">
          <div class="row g-4">
            <div class="col-lg-5">
              <div class="card border-0 shadow-sm p-4">
                <h6 class="fw-bold mb-3">📡 Schedule Live Class</h6>
                <div class="mb-3">
                  <input type="text" class="form-control mb-2" [(ngModel)]="newLive.title" placeholder="Class title">
                  <select class="form-select mb-2" [(ngModel)]="newLive.subject">
                    <option>Mathematics</option><option>Physics</option><option>Science</option>
                  </select>
                  <div class="row g-2">
                    <div class="col-6"><input type="date" class="form-control" [(ngModel)]="newLive.date"></div>
                    <div class="col-6"><input type="time" class="form-control" [(ngModel)]="newLive.time"></div>
                  </div>
                  <select class="form-select mt-2" [(ngModel)]="newLive.platform">
                    <option>Zoom</option><option>Google Meet</option><option>YouTube Live</option>
                  </select>
                </div>
                <button class="btn btn-danger w-100 rounded-pill fw-bold" (click)="scheduleLiveClass()">
                  <i class="bi bi-broadcast me-2"></i>Schedule Live Class
                </button>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">📅 Scheduled Classes ({{ liveClasses.length }})</h6></div>
                <div class="list-group list-group-flush">
                  <div class="list-group-item border-0 px-3 py-3" *ngFor="let lc of liveClasses">
                    <div class="d-flex align-items-center gap-3">
                      <div class="live-icon"><i class="bi bi-camera-video-fill text-danger fs-5"></i></div>
                      <div class="flex-grow-1">
                        <div class="fw-semibold small">{{ lc.title }}</div>
                        <div class="text-muted small">{{ lc.subject }} • {{ lc.date }} at {{ lc.time }} • {{ lc.platform }}</div>
                      </div>
                      <span class="badge bg-danger">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Tab -->
        <div *ngIf="activeTab === 'attendance'">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 class="fw-bold mb-0">📋 Student Attendance</h6>
              <button class="btn btn-sm btn-success rounded-pill" (click)="saveAttendance()">Save Attendance</button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr><th>Roll</th><th>Name</th><th>Class</th><th>Today</th><th>This Week</th></tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let s of studentAttendance">
                      <td class="small fw-medium">{{ s.roll }}</td>
                      <td class="small">{{ s.name }}</td>
                      <td class="small">Class {{ s.class }}</td>
                      <td>
                        <div class="form-check form-switch mb-0">
                          <input class="form-check-input" type="checkbox" [(ngModel)]="s.present" [ngModelOptions]="{standalone: true}">
                          <label class="form-check-label small" [class.text-success]="s.present" [class.text-danger]="!s.present">{{ s.present ? 'Present' : 'Absent' }}</label>
                        </div>
                      </td>
                      <td><span class="badge" [class]="s.weeklyRate >= 80 ? 'bg-success' : s.weeklyRate >= 60 ? 'bg-warning text-dark' : 'bg-danger'">{{ s.weeklyRate }}%</span></td>
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
    .teacher-header { border-radius: 20px !important; background: linear-gradient(135deg, #fff, #f0fff4); }
    .teacher-avatar { font-size: 2.5rem; }
    .nav-link { border-radius: 20px; font-weight: 500; }
    .live-icon { width: 40px; height: 40px; background: #ffe8e8; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .upload-zone { cursor: pointer; }
    .upload-zone:hover { border-color: #1d3557 !important; background: #f0f4ff; }
  `]
})
export class TeacherPanelComponent implements OnInit {
  activeTab = 'notes';
  noteToast = ''; examToast = '';

  tabs = [
    { id: 'notes', label: 'Notes', icon: 'bi-journal-text' },
    { id: 'exam', label: 'Create Exam', icon: 'bi-clipboard-check' },
    { id: 'live', label: 'Live Class', icon: 'bi-broadcast' },
    { id: 'attendance', label: 'Attendance', icon: 'bi-person-check' },
  ];

  notes: TeacherNote[] = [];
  newNote = { title: '', subject: 'Mathematics', class: 9 };
  newExam = { title: '', subject: 'Mathematics', class: 9, duration: 30, marks: 25 };
  exams: any[] = [];
  liveClasses: LiveClass[] = [];
  newLive = { title: '', subject: 'Mathematics', date: '', time: '', platform: 'Zoom' };

  studentAttendance = [
    { roll: '01', name: 'Rahim Ahmed', class: 9, present: true, weeklyRate: 90 },
    { roll: '02', name: 'Karim Islam', class: 9, present: true, weeklyRate: 75 },
    { roll: '03', name: 'Fatema Khatun', class: 9, present: false, weeklyRate: 60 },
    { roll: '04', name: 'Nusrat Jahan', class: 9, present: true, weeklyRate: 95 },
    { roll: '05', name: 'Rifat Hossain', class: 9, present: true, weeklyRate: 80 },
  ];

  constructor(private ls: LocalStorageService) {}

  ngOnInit(): void {
    this.notes = this.ls.get<TeacherNote[]>('teacher_notes') || [
      { id: '1', title: 'Polynomial Chapter Notes', subject: 'Mathematics', class: 9, date: 'June 14, 2024' },
      { id: '2', title: 'Newton\'s Laws Summary', subject: 'Physics', class: 9, date: 'June 12, 2024' },
    ];
    this.exams = this.ls.get<any[]>('teacher_exams') || [
      { title: 'Chapter 2 MCQ Test', subject: 'Mathematics', class: 9, duration: 25, marks: 20 },
    ];
    this.liveClasses = this.ls.get<LiveClass[]>('teacher_live') || [
      { id: '1', title: 'Algebra Live Session', subject: 'Mathematics', date: 'June 20', time: '5:00 PM', platform: 'Zoom' },
    ];
  }

  uploadNote(): void {
    if (!this.newNote.title) return;
    const note: TeacherNote = { id: Date.now().toString(), title: this.newNote.title, subject: this.newNote.subject, class: this.newNote.class, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
    this.notes.unshift(note);
    this.ls.set('teacher_notes', this.notes);
    this.noteToast = `"${note.title}" uploaded successfully!`;
    this.newNote = { title: '', subject: 'Mathematics', class: 9 };
    setTimeout(() => this.noteToast = '', 3000);
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter(n => n.id !== id);
    this.ls.set('teacher_notes', this.notes);
  }

  createExam(): void {
    if (!this.newExam.title) return;
    this.exams.unshift({ ...this.newExam });
    this.ls.set('teacher_exams', this.exams);
    this.examToast = `"${this.newExam.title}" created!`;
    this.newExam = { title: '', subject: 'Mathematics', class: 9, duration: 30, marks: 25 };
    setTimeout(() => this.examToast = '', 3000);
  }

  scheduleLiveClass(): void {
    if (!this.newLive.title || !this.newLive.date) return;
    const lc: LiveClass = { id: Date.now().toString(), ...this.newLive };
    this.liveClasses.unshift(lc);
    this.ls.set('teacher_live', this.liveClasses);
    this.newLive = { title: '', subject: 'Mathematics', date: '', time: '', platform: 'Zoom' };
  }

  saveAttendance(): void { alert('Attendance saved! (Demo)'); }
}

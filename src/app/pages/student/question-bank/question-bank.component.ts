import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService } from '../../../services/demo-data.service';
import { BOARDS } from '../../../models/pricing.model';
import { QuizQuestion } from '../../../models/quiz.model';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="qbank-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="text-center mb-5">
          <h3 class="fw-bold mb-1">🗄️ Question Bank</h3>
          <p class="text-muted">Board-wise, year-wise past exam questions for all subjects</p>
        </div>

        <!-- Filters -->
        <div class="filter-card card border-0 shadow-sm mb-4 p-4">
          <h6 class="fw-bold mb-3">🔍 Filter Questions</h6>
          <div class="row g-3">
            <div class="col-md-2 col-6">
              <label class="form-label small fw-medium">Class</label>
              <select class="form-select form-select-sm" [(ngModel)]="filter.class" (change)="applyFilter()">
                <option [value]="0">All Classes</option>
                <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small fw-medium">Subject</label>
              <select class="form-select form-select-sm" [(ngModel)]="filter.subject" (change)="applyFilter()">
                <option value="">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="physics">Physics</option>
                <option value="ict">ICT</option>
                <option value="bangla">Bangla</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small fw-medium">Board</label>
              <select class="form-select form-select-sm" [(ngModel)]="filter.board" (change)="applyFilter()">
                <option value="">All Boards</option>
                <option *ngFor="let b of boards" [value]="b">{{ b }}</option>
              </select>
            </div>
            <div class="col-md-2 col-6">
              <label class="form-label small fw-medium">Year</label>
              <select class="form-select form-select-sm" [(ngModel)]="filter.year" (change)="applyFilter()">
                <option [value]="0">All Years</option>
                <option *ngFor="let y of years" [value]="y">{{ y }}</option>
              </select>
            </div>
            <div class="col-md-2 col-6">
              <label class="form-label small fw-medium">Type</label>
              <select class="form-select form-select-sm" [(ngModel)]="filter.type" (change)="applyFilter()">
                <option value="">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="cq">CQ</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="text-muted small">Showing <strong>{{ filteredQuestions.length }}</strong> questions</span>
            <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="resetFilter()">
              <i class="bi bi-x-circle me-1"></i>Reset Filters
            </button>
          </div>
        </div>

        <!-- Question List -->
        <div class="row g-3">
          <div class="col-12" *ngFor="let q of filteredQuestions; let i = index">
            <div class="question-item card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex align-items-start justify-content-between gap-3">
                  <div class="flex-grow-1">
                    <div class="d-flex flex-wrap gap-2 mb-2">
                      <span class="badge bg-primary-subtle text-primary">Q.{{ i + 1 }}</span>
                      <span class="badge" [class]="getDiffBadge(q.difficulty)">{{ q.difficulty }}</span>
                      <span class="badge bg-secondary-subtle text-secondary">{{ getSubjectName(q.subjectId) }}</span>
                      <span class="badge bg-info-subtle text-info">{{ q.marks }} mark(s)</span>
                      <span class="badge" [class]="q.type === 'mcq' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'">{{ q.type.toUpperCase() }}</span>
                    </div>
                    <p class="fw-medium mb-2">{{ q.question }}</p>

                    <!-- MCQ Options -->
                    <div *ngIf="q.type === 'mcq'" class="row g-2 mt-2">
                      <div class="col-md-6" *ngFor="let opt of q.options; let oi = index">
                        <div class="option-item small p-2 rounded" [class.correct-opt]="isShown(q.id) && oi === q.correctAnswer">
                          <span class="opt-key me-1">{{ 'abcd'[oi] }})</span> {{ opt }}
                          <i *ngIf="isShown(q.id) && oi === q.correctAnswer" class="bi bi-check-circle-fill text-success ms-1"></i>
                        </div>
                      </div>
                    </div>

                    <!-- Answer/Explanation -->
                    <div *ngIf="isShown(q.id)" class="explanation-reveal mt-3 p-3 rounded-3">
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <i class="bi bi-lightbulb-fill text-warning"></i>
                        <strong class="small">Explanation:</strong>
                      </div>
                      <p class="mb-0 small">{{ q.explanation }}</p>
                    </div>
                  </div>

                  <button class="btn btn-sm rounded-pill flex-shrink-0" [class.btn-outline-success]="!isShown(q.id)" [class.btn-outline-secondary]="isShown(q.id)" (click)="toggleAnswer(q.id)">
                    <i class="bi" [class]="isShown(q.id) ? 'bi-eye-slash' : 'bi-eye'"></i>
                    {{ isShown(q.id) ? 'Hide' : 'Answer' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!filteredQuestions.length" class="col-12 text-center py-5">
            <i class="bi bi-database-x fs-1 text-muted"></i>
            <p class="text-muted mt-2 mb-3">No questions found. Try adjusting the filters.</p>
            <button class="btn btn-primary rounded-pill" (click)="resetFilter()">Show All Questions</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-card { border-radius: 16px !important; }
    .question-item { border-radius: 12px !important; transition: transform 0.2s; }
    .question-item:hover { transform: translateX(3px); }
    .option-item { background: #f8f9fa; border: 1px solid #e9ecef; }
    .option-item.correct-opt { background: #d4edda; border-color: #28a745; }
    .opt-key { font-weight: 700; color: #1d3557; }
    .explanation-reveal { background: #fff9e6; border: 1px solid #ffc107; }
  `]
})
export class QuestionBankComponent implements OnInit {
  boards = BOARDS;
  years = [2024, 2023, 2022, 2021, 2020, 2019];
  allQuestions: QuizQuestion[] = [];
  filteredQuestions: QuizQuestion[] = [];
  shownAnswers = new Set<string>();

  filter = { class: 0, subject: '', board: '', year: 0, type: '' };

  private subjectNames: { [k: string]: string } = { math: 'Math', science: 'Science', english: 'English', physics: 'Physics', ict: 'ICT', bangla: 'Bangla' };

  constructor(private demoData: DemoDataService) {}

  ngOnInit(): void {
    // Load questions from all subjects
    const subjects = ['math', 'science', 'english', 'physics', 'ict'];
    subjects.forEach(s => {
      this.allQuestions.push(...this.demoData.getMCQQuestions(s));
    });
    this.filteredQuestions = [...this.allQuestions];
  }

  applyFilter(): void {
    this.filteredQuestions = this.allQuestions.filter(q => {
      if (this.filter.subject && q.subjectId !== this.filter.subject) return false;
      if (this.filter.type && q.type !== this.filter.type) return false;
      return true;
    });
  }

  resetFilter(): void {
    this.filter = { class: 0, subject: '', board: '', year: 0, type: '' };
    this.filteredQuestions = [...this.allQuestions];
  }

  toggleAnswer(id: string): void {
    if (this.shownAnswers.has(id)) this.shownAnswers.delete(id);
    else this.shownAnswers.add(id);
  }

  isShown(id: string): boolean { return this.shownAnswers.has(id); }
  getDiffBadge(d: string): string { return d === 'easy' ? 'bg-success' : d === 'medium' ? 'bg-warning text-dark' : 'bg-danger'; }
  getSubjectName(id: string): string { return this.subjectNames[id] || id; }
}

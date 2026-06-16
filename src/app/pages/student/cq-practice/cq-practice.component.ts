import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { CQQuestion } from '../../../models/quiz.model';

@Component({
  selector: 'app-cq-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cq-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h3 class="fw-bold mb-1">📝 CQ / Creative Questions</h3>
            <p class="text-muted mb-0">সৃজনশীল প্রশ্নের অনুশীলন — Board style with model answers</p>
          </div>
          <select class="form-select form-select-sm w-auto" [(ngModel)]="selectedSubject" (change)="loadCQs()">
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
          </select>
        </div>

        <!-- CQ Cards -->
        <div class="row g-4">
          <div class="col-12" *ngFor="let cq of cqQuestions; let qi = index">
            <div class="cq-card card border-0 shadow-sm">
              <div class="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span class="fw-bold">প্রশ্ন {{ qi + 1 }}</span>
                  <span class="ms-3 small opacity-75">{{ cq.board }} Board — {{ cq.year }}</span>
                </div>
                <div class="d-flex gap-2">
                  <span class="badge bg-warning text-dark">Total: {{ getTotalMarks(cq) }} Marks</span>
                  <button class="btn btn-sm btn-outline-light" (click)="toggleAllAnswers(cq)">
                    <i class="bi bi-eye me-1"></i>{{ isAllShown(cq) ? 'Hide' : 'Show' }} All Answers
                  </button>
                </div>
              </div>
              <div class="card-body p-4">

                <!-- Uddipak / Stimulus -->
                <div class="uddipak-box p-4 rounded-3 mb-4">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-primary">উদ্দীপক</span>
                    <span class="small text-muted">Stimulus Text</span>
                  </div>
                  <p class="mb-0 fw-medium lh-lg">{{ cq.stimulusText }}</p>
                </div>

                <!-- Sub Questions -->
                <div class="d-flex flex-column gap-3">
                  <div *ngFor="let sq of cq.questions" class="sub-question-card">
                    <!-- Question -->
                    <div class="d-flex align-items-start gap-3 mb-3">
                      <div class="sq-badge" [class]="getPartColor(sq.part)">{{ getPartLabel(sq.part) }}</div>
                      <div class="flex-grow-1">
                        <p class="fw-medium mb-1">{{ sq.question }}</p>
                        <span class="badge bg-secondary">{{ sq.marks }} marks</span>
                      </div>
                    </div>

                    <!-- Writing Tips -->
                    <div class="tips-box p-3 rounded-3 mb-3" *ngIf="sq.writingTips.length">
                      <div class="d-flex align-items-center gap-2 mb-2">
                        <i class="bi bi-lightbulb-fill text-warning"></i>
                        <span class="small fw-bold">Writing Tips:</span>
                      </div>
                      <ul class="list-unstyled mb-0 small">
                        <li *ngFor="let tip of sq.writingTips" class="mb-1">
                          <i class="bi bi-chevron-right text-muted me-1"></i>{{ tip }}
                        </li>
                      </ul>
                    </div>

                    <!-- Model Answer Toggle -->
                    <div>
                      <button class="btn btn-sm btn-outline-success rounded-pill" (click)="toggleAnswer(cq.id, sq.part)">
                        <i class="bi" [class]="isShown(cq.id, sq.part) ? 'bi-eye-slash' : 'bi-eye'" ></i>
                        {{ isShown(cq.id, sq.part) ? 'Hide' : 'Show' }} Model Answer
                      </button>

                      <div *ngIf="isShown(cq.id, sq.part)" class="model-answer-box mt-3 p-4 rounded-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <i class="bi bi-check-circle-fill text-success"></i>
                          <span class="fw-bold small text-success">Model Answer ({{ sq.marks }} marks)</span>
                        </div>
                        <p class="mb-0">{{ sq.modelAnswer }}</p>
                      </div>
                    </div>

                    <hr *ngIf="sq.part !== 'gha'" class="my-3">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!cqQuestions.length" class="col-12 text-center py-5">
            <i class="bi bi-journal-x fs-1 text-muted"></i>
            <p class="text-muted mt-2">No CQ questions available for this subject yet.</p>
          </div>
        </div>

        <!-- Mark Distribution Guide -->
        <div class="card border-0 shadow-sm mt-5">
          <div class="card-header bg-white border-0">
            <h6 class="fw-bold mb-0">📊 Mark Distribution Guide</h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-3 col-6" *ngFor="let m of markGuide">
                <div class="mark-guide-card p-3 rounded-3 text-center" [style.background]="m.color + '15'" [style.border]="'2px solid ' + m.color">
                  <div class="fw-bold fs-4" [style.color]="m.color">{{ m.marks }}</div>
                  <div class="small fw-bold" [style.color]="m.color">{{ m.part }}</div>
                  <div class="text-muted small mt-1">{{ m.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .uddipak-box { background: #e8f4fd; border-left: 4px solid #1d3557; }
    .sub-question-card { background: white; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; }
    .sq-badge { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; flex-shrink: 0; }
    .tips-box { background: #fff9e6; border: 1px solid #ffc107; }
    .model-answer-box { background: #d4edda; border: 1px solid #28a745; }
    .cq-card { border-radius: 16px !important; overflow: hidden; }
    .mark-guide-card { transition: transform 0.2s; }
    .mark-guide-card:hover { transform: translateY(-2px); }
  `]
})
export class CqPracticeComponent implements OnInit {
  cqQuestions: CQQuestion[] = [];
  selectedSubject = 'math';
  shownAnswers = new Set<string>();

  markGuide = [
    { part: 'ক (Ka)', marks: 1, desc: 'Knowledge-based short answer', color: '#2d6a4f' },
    { part: 'খ (Kha)', marks: 2, desc: 'Brief explanation needed', color: '#0077b6' },
    { part: 'গ (Ga)', marks: 4, desc: 'Application & analysis', color: '#f4a261' },
    { part: 'ঘ (Gha)', marks: 4, desc: 'Higher-order evaluation', color: '#e63946' },
  ];

  constructor(private demoData: DemoDataService) {}

  ngOnInit(): void { this.loadCQs(); }

  loadCQs(): void {
    this.cqQuestions = this.demoData.getCQQuestions(this.selectedSubject);
    this.shownAnswers.clear();
  }

  toggleAnswer(cqId: string, part: string): void {
    const key = `${cqId}_${part}`;
    if (this.shownAnswers.has(key)) this.shownAnswers.delete(key);
    else this.shownAnswers.add(key);
  }

  isShown(cqId: string, part: string): boolean {
    return this.shownAnswers.has(`${cqId}_${part}`);
  }

  toggleAllAnswers(cq: CQQuestion): void {
    const allShown = this.isAllShown(cq);
    cq.questions.forEach(sq => {
      const key = `${cq.id}_${sq.part}`;
      if (allShown) this.shownAnswers.delete(key);
      else this.shownAnswers.add(key);
    });
  }

  isAllShown(cq: CQQuestion): boolean {
    return cq.questions.every(sq => this.shownAnswers.has(`${cq.id}_${sq.part}`));
  }

  getTotalMarks(cq: CQQuestion): number {
    return cq.questions.reduce((sum, sq) => sum + sq.marks, 0);
  }

  getPartLabel(part: string): string {
    const map: { [k: string]: string } = { ka: 'ক', kha: 'খ', ga: 'গ', gha: 'ঘ' };
    return map[part] || part;
  }

  getPartColor(part: string): string {
    const map: { [k: string]: string } = { ka: 'bg-success text-white', kha: 'bg-primary text-white', ga: 'bg-warning text-dark', gha: 'bg-danger text-white' };
    return map[part] || 'bg-secondary text-white';
  }
}

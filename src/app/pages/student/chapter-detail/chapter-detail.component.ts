import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { ProgressService } from '../../../services/progress.service';
import { Subject, Chapter } from '../../../models/subject.model';

@Component({
  selector: 'app-chapter-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="chapter-detail-page py-4 bg-light min-vh-100">
      <div class="container" *ngIf="chapter && subject">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/subjects">Subjects</a></li>
            <li class="breadcrumb-item"><a [routerLink]="'/subjects/' + subject.id">{{ subject.name }}</a></li>
            <li class="breadcrumb-item active">{{ chapter.title }}</li>
          </ol>
        </nav>

        <div class="row g-4">
          <!-- Main Content -->
          <div class="col-lg-8">
            <!-- Chapter Header -->
            <div class="chapter-header card border-0 shadow-sm mb-4 p-4" [style.borderTop]="'5px solid ' + subject.color">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span class="badge rounded-pill mb-2" [style.background]="subject.color">Chapter {{ chapter.number }}</span>
                  <h3 class="fw-bold mb-1">{{ chapter.title }}</h3>
                  <p class="bangla-text text-muted mb-0">{{ chapter.titleBn }}</p>
                </div>
                <div class="chapter-progress-circle" [style.borderColor]="subject.color">
                  <span [style.color]="subject.color" class="fw-bold">{{ progress }}%</span>
                </div>
              </div>
              <p class="text-muted">{{ chapter.description }}</p>
              <!-- Progress Bar -->
              <div class="progress" style="height:8px">
                <div class="progress-bar rounded-pill" [style.width]="progress + '%'" [style.background]="subject.color"></div>
              </div>
            </div>

            <!-- Tab Navigation -->
            <ul class="nav nav-pills gap-2 mb-4" id="chapterTabs">
              <li class="nav-item">
                <button class="nav-link" [class.active]="activeTab === 'notes'" (click)="activeTab = 'notes'">
                  <i class="bi bi-journal-text me-1"></i>Notes
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="activeTab === 'keypoints'" (click)="activeTab = 'keypoints'">
                  <i class="bi bi-list-check me-1"></i>Key Points
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="activeTab === 'formulas'" (click)="activeTab = 'formulas'">
                  <i class="bi bi-calculator me-1"></i>Formulas
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="activeTab === 'mindmap'" (click)="activeTab = 'mindmap'">
                  <i class="bi bi-diagram-3 me-1"></i>Mind Map
                </button>
              </li>
            </ul>

            <!-- Tab Content -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4">

                <!-- Notes Tab -->
                <div *ngIf="activeTab === 'notes'">
                  <h5 class="fw-bold mb-3">📖 Chapter Notes</h5>
                  <div class="notes-content p-4 rounded-3" style="background:#f8f9fa">
                    <p class="lead text-muted mb-4">{{ chapter.notes }}</p>
                    <div class="row g-3">
                      <div class="col-12">
                        <div class="card border-0" style="background:#e8f4fd">
                          <div class="card-body">
                            <h6 class="fw-bold text-primary"><i class="bi bi-lightbulb me-2"></i>Easy Explanation</h6>
                            <p class="mb-0 small">এই অধ্যায়ে আমরা {{ chapter.title }} সম্পর্কে বিস্তারিত আলোচনা করব। মূল ধারণাগুলো বোঝা এবং প্রয়োগ করতে পারলে পরীক্ষায় ভালো ফলাফল করা সম্ভব।</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="infographic-placeholder mt-4 rounded-3 p-5 text-center" style="background: linear-gradient(135deg, #f0f4ff, #e8f5e9); border: 2px dashed #ccc">
                    <i class="bi bi-image fs-1 text-muted"></i>
                    <p class="text-muted mt-2 mb-0">Infographic Placeholder — {{ chapter.title }}</p>
                    <small class="text-muted">Visual diagram will appear here</small>
                  </div>
                  <button class="btn btn-primary mt-3" (click)="markNotesRead()">
                    <i class="bi bi-check2 me-2"></i>Mark Notes as Read
                  </button>
                </div>

                <!-- Key Points Tab -->
                <div *ngIf="activeTab === 'keypoints'">
                  <h5 class="fw-bold mb-3">⭐ Key Points</h5>
                  <div class="list-group list-group-flush">
                    <div class="list-group-item border-0 px-0 py-3 d-flex align-items-start gap-3" *ngFor="let point of chapter.keyPoints; let i = index">
                      <div class="kp-num">{{ i + 1 }}</div>
                      <div>
                        <p class="mb-0 fw-medium">{{ point }}</p>
                      </div>
                    </div>
                    <div *ngIf="!chapter.keyPoints.length" class="text-center py-4 text-muted">
                      <i class="bi bi-info-circle fs-2"></i>
                      <p class="mt-2">Key points will be added soon.</p>
                    </div>
                  </div>
                </div>

                <!-- Formulas Tab -->
                <div *ngIf="activeTab === 'formulas'">
                  <h5 class="fw-bold mb-3">📐 Important Formulas</h5>
                  <div class="row g-3">
                    <div class="col-12" *ngFor="let formula of chapter.formulas">
                      <div class="formula-card p-3 rounded-3 d-flex align-items-center gap-3">
                        <i class="bi bi-calculator-fill text-primary fs-4 flex-shrink-0"></i>
                        <code class="fs-6 fw-bold text-dark">{{ formula }}</code>
                      </div>
                    </div>
                    <div *ngIf="!chapter.formulas.length" class="text-center py-4 text-muted">
                      <i class="bi bi-calculator fs-2"></i>
                      <p class="mt-2">No formulas for this chapter.</p>
                    </div>
                  </div>
                </div>

                <!-- Mind Map Tab -->
                <div *ngIf="activeTab === 'mindmap'" class="text-center py-5">
                  <div class="mindmap-placeholder rounded-3 p-5" style="background: linear-gradient(135deg, #fff9e6, #fff3cd); border: 2px dashed #ffc107">
                    <i class="bi bi-diagram-3 fs-1 text-warning"></i>
                    <h5 class="fw-bold mt-3 text-warning-emphasis">Mind Map — {{ chapter.title }}</h5>
                    <p class="text-muted">Interactive mind map visualization placeholder</p>
                    <div class="mindmap-demo mt-3">
                      <div class="mindmap-center">{{ chapter.title }}</div>
                      <div class="mindmap-branches">
                        <span *ngFor="let kp of chapter.keyPoints.slice(0,4)" class="mindmap-branch">{{ kp }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Quick Actions -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white border-0"><h6 class="fw-bold mb-0">⚡ Practice This Chapter</h6></div>
              <div class="card-body d-flex flex-column gap-2">
                <a routerLink="/mcq" class="btn btn-outline-success w-100 text-start"><i class="bi bi-check2-square me-2"></i>{{ chapter.mcqCount }} MCQ Questions</a>
                <a routerLink="/videos" class="btn btn-outline-danger w-100 text-start"><i class="bi bi-play-circle me-2"></i>{{ chapter.videoCount }} Video Lessons</a>
                <a routerLink="/cq" class="btn btn-outline-warning w-100 text-start"><i class="bi bi-journal-text me-2"></i>CQ Practice</a>
                <a routerLink="/mock-test" class="btn btn-outline-primary w-100 text-start"><i class="bi bi-clock me-2"></i>Chapter Mock Test</a>
                <a routerLink="/pdf-downloads" *ngIf="chapter.pdfAvailable" class="btn btn-outline-secondary w-100 text-start"><i class="bi bi-file-pdf me-2"></i>Download PDF Notes</a>
              </div>
            </div>

            <!-- Estimated Time -->
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-4 text-center">
                <i class="bi bi-clock fs-2 text-primary mb-2"></i>
                <h5 class="fw-bold">~{{ chapter.estimatedTime }} min</h5>
                <p class="text-muted small mb-0">Estimated study time for this chapter</p>
              </div>
            </div>

            <!-- AI Help -->
            <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, #f0f4ff, #e8f5e9)">
              <div class="card-body p-4 text-center">
                <i class="bi bi-robot fs-2 text-primary mb-2"></i>
                <h6 class="fw-bold">এই অধ্যায়ে সাহায্য দরকার?</h6>
                <p class="text-muted small mb-3">AI Tutor কে জিজ্ঞেস করুন</p>
                <a routerLink="/ai-tutor" class="btn btn-primary btn-sm rounded-pill">Ask AI Tutor</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chapter-progress-circle { width: 64px; height: 64px; border-radius: 50%; border: 3px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nav-link { border-radius: 20px; font-weight: 500; }
    .kp-num { width: 32px; height: 32px; background: #1d3557; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .formula-card { background: linear-gradient(135deg, #f0f4ff, #e8efff); border: 1px solid #c7d7ff; }
    .mindmap-center { background: #1d3557; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: 700; margin-bottom: 16px; }
    .mindmap-branches { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
    .mindmap-branch { background: white; border: 2px solid #ffc107; color: #333; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
  `]
})
export class ChapterDetailComponent implements OnInit {
  subject: Subject | undefined;
  chapter: Chapter | undefined;
  activeTab = 'notes';
  progress = 45;

  constructor(private route: ActivatedRoute, private demoData: DemoDataService, private progressService: ProgressService) {}

  ngOnInit(): void {
    const subjectId = this.route.snapshot.paramMap.get('subjectId')!;
    const chapterId = this.route.snapshot.paramMap.get('chapterId')!;
    this.subject = this.demoData.subjects.find(s => s.id === subjectId);
    this.chapter = this.subject?.chapters.find(c => c.id === chapterId);
    this.progress = this.progressService.getChapterProgress(subjectId, chapterId) || 45;
  }

  markNotesRead(): void {
    if (this.subject && this.chapter) {
      this.progressService.updateProgress(this.subject.id, this.chapter.id, Math.max(this.progress + 20, 30));
      this.progress = Math.min(this.progress + 20, 100);
    }
  }
}

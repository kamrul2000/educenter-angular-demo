import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { Subject, Chapter } from '../../../models/subject.model';

@Component({
  selector: 'app-chapter-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="chapter-list-page py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/subjects" class="text-decoration-none">Subjects</a></li>
            <li class="breadcrumb-item active">{{ subject?.name }}</li>
          </ol>
        </nav>

        <ng-container *ngIf="subject">
          <!-- Subject Header -->
          <div class="subject-header card border-0 shadow-sm mb-4 p-4" [style.borderLeft]="'6px solid ' + subject.color">
            <div class="d-flex align-items-center gap-3">
              <div class="subject-icon-lg" [style.background]="subject.color + '20'" [style.color]="subject.color">
                <i class="bi fs-1" [class]="subject.icon"></i>
              </div>
              <div>
                <h3 class="fw-bold mb-1">{{ subject.name }}</h3>
                <p class="bangla-text text-muted mb-1">{{ subject.nameBn }}</p>
                <p class="text-muted small mb-0">{{ subject.description }}</p>
                <div class="d-flex gap-2 mt-2">
                  <span class="badge" [style.background]="subject.color">{{ subject.chapters.length }} Chapters</span>
                  <a [routerLink]="'/mcq'" class="badge bg-success text-white text-decoration-none">Practice MCQ</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Chapters -->
          <div class="row g-3" *ngIf="subject.chapters.length; else noChapters">
            <div class="col-12" *ngFor="let chapter of subject.chapters">
              <div class="chapter-card card border-0 shadow-sm" [style.borderLeft]="'4px solid ' + subject.color">
                <div class="card-body p-4">
                  <div class="row align-items-center">
                    <div class="col-lg-8">
                      <div class="d-flex align-items-start gap-3">
                        <div class="chapter-num" [style.background]="subject.color">{{ chapter.number }}</div>
                        <div>
                          <h6 class="fw-bold mb-1">{{ chapter.title }}</h6>
                          <p class="bangla-text text-muted small mb-2">{{ chapter.titleBn }}</p>
                          <p class="text-muted small mb-2">{{ chapter.description }}</p>
                          <div class="d-flex flex-wrap gap-2">
                            <span class="badge bg-primary-subtle text-primary"><i class="bi bi-play-circle me-1"></i>{{ chapter.videoCount }} Videos</span>
                            <span class="badge bg-success-subtle text-success"><i class="bi bi-check2-square me-1"></i>{{ chapter.mcqCount }} MCQs</span>
                            <span *ngIf="chapter.pdfAvailable" class="badge bg-danger-subtle text-danger"><i class="bi bi-file-pdf me-1"></i>PDF</span>
                            <span class="badge bg-secondary-subtle text-secondary"><i class="bi bi-clock me-1"></i>~{{ chapter.estimatedTime }} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 mt-3 mt-lg-0">
                      <!-- Progress -->
                      <div class="mb-2">
                        <div class="d-flex justify-content-between small mb-1">
                          <span class="text-muted">Progress</span>
                          <span class="fw-medium" [style.color]="subject.color">{{ getChapterProgress(chapter.id) }}%</span>
                        </div>
                        <div class="progress" style="height:6px">
                          <div class="progress-bar" [style.width]="getChapterProgress(chapter.id) + '%'" [style.background]="subject.color"></div>
                        </div>
                      </div>
                      <a [routerLink]="'/subjects/' + subject.id + '/chapters/' + chapter.id" class="btn btn-sm w-100 fw-semibold rounded-pill" [style.background]="subject.color" style="color:white">
                        <i class="bi bi-arrow-right-circle me-1"></i>
                        {{ getChapterProgress(chapter.id) > 0 ? 'Continue' : 'Start Chapter' }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noChapters>
            <div class="text-center py-5">
              <i class="bi bi-hourglass fs-1 text-muted"></i>
              <p class="text-muted mt-3">Chapters coming soon for this subject!</p>
              <a routerLink="/subjects" class="btn btn-primary rounded-pill">Back to Subjects</a>
            </div>
          </ng-template>
        </ng-container>

        <ng-container *ngIf="!subject">
          <div class="text-center py-5">
            <i class="bi bi-exclamation-circle fs-1 text-danger"></i>
            <p class="text-muted mt-3">Subject not found.</p>
            <a routerLink="/subjects" class="btn btn-primary rounded-pill">Back to Subjects</a>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .subject-icon-lg { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .chapter-card { border-radius: 16px !important; transition: transform 0.2s; }
    .chapter-card:hover { transform: translateX(4px); }
    .chapter-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; flex-shrink: 0; font-size: 0.9rem; }
  `]
})
export class ChapterListComponent implements OnInit {
  subject: Subject | undefined;
  private progressMap: { [k: string]: number } = { bn_ch1: 80, bn_ch2: 50, bn_ch3: 0, en_ch1: 90, en_ch2: 65, en_ch3: 30, math_ch1: 75, math_ch2: 40, math_ch3: 20, sci_ch1: 60, sci_ch2: 0, ict_ch1: 95, ict_ch2: 50, phy_ch1: 70, phy_ch2: 35 };

  constructor(private route: ActivatedRoute, private demoData: DemoDataService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.subject = this.demoData.subjects.find(s => s.id === id);
  }

  getChapterProgress(chapterId: string): number {
    return this.progressMap[chapterId] || 0;
  }
}

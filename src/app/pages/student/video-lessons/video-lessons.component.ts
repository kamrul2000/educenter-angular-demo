import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemoDataService } from '../../../services/demo-data.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Video } from '../../../models/subject.model';

@Component({
  selector: 'app-video-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="videos-page bg-light min-vh-100">

      <!-- Page Header -->
      <div class="videos-header py-4 mb-2">
        <div class="container">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h3 class="fw-bold mb-1 text-dark">🎥 Video Lessons</h3>
              <p class="text-muted mb-0">Concept videos, full chapter guides, and exam prep — learn at your pace</p>
            </div>
            <!-- Filter Controls -->
            <div class="d-flex gap-2 flex-wrap">
              <div class="filter-group">
                <select class="form-select form-select-sm filter-select" [(ngModel)]="filterType" (change)="applyFilter()">
                  <option value="">All Types</option>
                  <option value="concept">Concept Videos</option>
                  <option value="full-chapter">Full Chapter</option>
                  <option value="exam-prep">Exam Prep</option>
                </select>
              </div>
              <div class="filter-group">
                <select class="form-select form-select-sm filter-select" [(ngModel)]="filterSubject" (change)="applyFilter()">
                  <option value="">All Subjects</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="ict">ICT</option>
                </select>
              </div>
              <div class="filter-group">
                <select class="form-select form-select-sm filter-select" [(ngModel)]="filterStatus" (change)="applyFilter()">
                  <option value="">All Videos</option>
                  <option value="watched">Watched</option>
                  <option value="in-progress">In Progress</option>
                  <option value="unwatched">Not Started</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="d-flex gap-4 mt-3 flex-wrap">
            <div class="stat-pill">
              <i class="bi bi-play-circle text-primary me-1"></i>
              <span class="small fw-semibold">{{ allVideos.length }} Videos</span>
            </div>
            <div class="stat-pill">
              <i class="bi bi-check-circle text-success me-1"></i>
              <span class="small fw-semibold">{{ watchedCount }} Watched</span>
            </div>
            <div class="stat-pill">
              <i class="bi bi-hourglass-split text-warning me-1"></i>
              <span class="small fw-semibold">{{ inProgressCount }} In Progress</span>
            </div>
            <div class="stat-pill">
              <i class="bi bi-clock me-1 text-muted"></i>
              <span class="small fw-semibold text-muted">~{{ totalHours }}h total</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container pb-5">

        <!-- Resume Banner -->
        <div *ngIf="resumeVideo" class="resume-banner mb-4 p-3 d-flex align-items-center gap-3">
          <div class="resume-play-btn">
            <i class="bi bi-play-fill"></i>
          </div>
          <div class="flex-grow-1">
            <div class="small text-muted mb-1">Resume where you left off:</div>
            <div class="fw-semibold text-dark">{{ resumeVideo.title }}</div>
            <div class="resume-progress-bar mt-2">
              <div class="resume-progress-fill" [style.width]="resumeVideo.progress + '%'"></div>
            </div>
          </div>
          <button class="btn resume-btn rounded-pill px-4 fw-semibold" (click)="playVideo(resumeVideo)">
            <i class="bi bi-play-fill me-1"></i>Resume ({{ resumeVideo.progress }}%)
          </button>
        </div>

        <!-- Video Player -->
        <div *ngIf="selectedVideo" class="video-player-card mb-4">
          <div class="video-player-screen d-flex align-items-center justify-content-center flex-column gap-3 text-white position-relative">
            <div class="player-glow"></div>
            <div class="player-icon-wrap">
              <i class="bi bi-play-circle-fill player-icon"></i>
            </div>
            <div class="text-center px-4">
              <h5 class="fw-bold mb-1">{{ selectedVideo.title }}</h5>
              <p class="opacity-75 small mb-0">{{ selectedVideo.duration }} &nbsp;•&nbsp; {{ getSubjectName(selectedVideo.subjectId) }}</p>
            </div>
            <div class="badge px-3 py-2" style="background:rgba(244,162,97,0.9);color:#1d3557;font-weight:600">
              <i class="bi bi-youtube me-1"></i>Demo Player — Real video in production
            </div>
            <button class="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle close-btn" (click)="selectedVideo = null">
              <i class="bi bi-x-lg"></i>
            </button>
            <!-- Progress bar at bottom -->
            <div class="player-seek-bar">
              <div class="player-seek-fill" [style.width]="selectedVideo.progress + '%'"></div>
              <div class="player-seek-thumb" [style.left]="selectedVideo.progress + '%'"></div>
            </div>
          </div>
          <div class="player-controls d-flex align-items-center gap-3 flex-wrap">
            <div class="d-flex align-items-center gap-1">
              <i class="bi bi-speedometer2 text-muted small"></i>
              <span class="small text-muted me-2">Speed:</span>
              <button *ngFor="let s of speeds" class="btn btn-sm speed-btn" [class.active]="playbackSpeed === s" (click)="playbackSpeed = s">{{ s }}x</button>
            </div>
            <div class="ms-auto d-flex align-items-center gap-3">
              <span class="small text-muted"><i class="bi bi-bookmark-fill me-1 text-warning"></i>{{ selectedVideo.progress }}% complete</span>
              <button class="btn btn-sm btn-outline-secondary rounded-pill" (click)="selectedVideo = null">
                <i class="bi bi-x me-1"></i>Close
              </button>
            </div>
          </div>
        </div>

        <!-- Section label if filtered -->
        <div class="d-flex justify-content-between align-items-center mb-3" *ngIf="filteredVideos.length">
          <h6 class="fw-semibold text-muted mb-0">
            Showing {{ filteredVideos.length }} video{{ filteredVideos.length !== 1 ? 's' : '' }}
            <span *ngIf="filterType || filterSubject || filterStatus" class="text-primary ms-1">
              — filtered
            </span>
          </h6>
          <div class="d-flex gap-2">
            <button class="btn btn-sm view-toggle" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button class="btn btn-sm view-toggle" [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
              <i class="bi bi-list-ul"></i>
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div class="row g-3" *ngIf="viewMode === 'grid'">
          <div class="col-sm-6 col-lg-4" *ngFor="let video of filteredVideos">
            <div class="vcard h-100" (click)="playVideo(video)" [class.vcard-watched]="video.watched">

              <!-- Thumbnail -->
              <div class="vcard-thumb">
                <img [src]="video.thumbnail" [alt]="video.title" class="vcard-img">

                <!-- Overlay on hover -->
                <div class="vcard-overlay">
                  <div class="play-btn-circle">
                    <i class="bi bi-play-fill"></i>
                  </div>
                </div>

                <!-- Type badge (top-left) -->
                <span class="vcard-type-badge" [ngClass]="getTypeBadgeClass(video.type)">{{ getTypeLabel(video.type) }}</span>

                <!-- Duration (top-right) -->
                <span class="vcard-duration">{{ video.duration }}</span>

                <!-- Watched checkmark (bottom-right) -->
                <span *ngIf="video.watched" class="vcard-watched-badge">
                  <i class="bi bi-check-circle-fill me-1"></i>Watched
                </span>

                <!-- Progress bar at bottom of thumb -->
                <div *ngIf="video.progress > 0 && !video.watched" class="vcard-progress-bar">
                  <div class="vcard-progress-fill" [style.width]="video.progress + '%'"></div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="vcard-body">
                <h6 class="vcard-title">{{ video.title }}</h6>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                  <span class="subject-chip">{{ getSubjectName(video.subjectId) }}</span>
                  <span class="progress-text" [class.text-success]="video.watched" [class.text-warning]="video.progress > 0 && !video.watched">
                    <i class="bi" [class.bi-check-circle-fill]="video.watched" [class.bi-hourglass-split]="video.progress > 0 && !video.watched"></i>
                    {{ video.watched ? '100%' : video.progress + '%' }} complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div class="list-group gap-2" *ngIf="viewMode === 'list'">
          <div class="list-video-item d-flex align-items-center gap-3" *ngFor="let video of filteredVideos; let i = index" (click)="playVideo(video)">
            <div class="list-thumb-wrap">
              <img [src]="video.thumbnail" [alt]="video.title" class="list-thumb">
              <div class="list-play-icon"><i class="bi bi-play-fill"></i></div>
            </div>
            <div class="flex-grow-1 min-w-0">
              <div class="d-flex align-items-start gap-2 mb-1">
                <span class="list-type-badge" [ngClass]="getTypeBadgeClass(video.type)">{{ getTypeLabel(video.type) }}</span>
                <span *ngIf="video.watched" class="badge bg-success-subtle text-success border border-success-subtle">Watched</span>
              </div>
              <h6 class="fw-semibold mb-1 text-truncate">{{ video.title }}</h6>
              <div class="d-flex align-items-center gap-3">
                <span class="subject-chip">{{ getSubjectName(video.subjectId) }}</span>
                <span class="small text-muted"><i class="bi bi-clock me-1"></i>{{ video.duration }}</span>
              </div>
              <div *ngIf="video.progress > 0" class="mt-2">
                <div class="list-progress-bar">
                  <div class="list-progress-fill" [style.width]="(video.watched ? 100 : video.progress) + '%'"></div>
                </div>
              </div>
            </div>
            <div class="text-end flex-shrink-0">
              <div class="fw-semibold small" [class.text-success]="video.watched" [class.text-warning]="video.progress > 0 && !video.watched" [class.text-muted]="video.progress === 0">
                {{ video.watched ? '100%' : video.progress + '%' }}
              </div>
              <button class="btn btn-sm btn-primary rounded-pill mt-1 px-3">
                {{ video.progress > 0 && !video.watched ? 'Resume' : video.watched ? 'Rewatch' : 'Watch' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!filteredVideos.length" class="empty-state text-center py-5">
          <div class="empty-icon mb-3">
            <i class="bi bi-camera-video-off"></i>
          </div>
          <h5 class="fw-bold text-muted">No videos found</h5>
          <p class="text-muted small">Try adjusting your filters to find what you're looking for.</p>
          <button class="btn btn-primary rounded-pill px-4" (click)="clearFilters()">Clear Filters</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Page Header ── */
    .videos-header { background: #fff; border-bottom: 1px solid #e9ecef; }
    .filter-select { border-radius: 20px; border-color: #dee2e6; font-size: 0.82rem; padding: 0.3rem 2rem 0.3rem 0.85rem; }
    .filter-select:focus { box-shadow: 0 0 0 3px rgba(29,53,87,0.12); border-color: #1d3557; }
    .stat-pill { display: flex; align-items: center; background: #f8f9fa; border-radius: 20px; padding: 4px 12px; }

    /* ── Resume Banner ── */
    .resume-banner { background: linear-gradient(135deg, #e8f4fd, #d6eaf8); border: 1.5px solid #aed6f1; border-radius: 16px; }
    .resume-play-btn { width: 44px; height: 44px; border-radius: 50%; background: #1d3557; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; flex-shrink: 0; }
    .resume-progress-bar { height: 5px; background: #bee3f8; border-radius: 10px; overflow: hidden; }
    .resume-progress-fill { height: 100%; background: linear-gradient(90deg, #f4a261, #e63946); border-radius: 10px; transition: width 0.4s; }
    .resume-btn { background: #1d3557; color: #fff; font-size: 0.85rem; }
    .resume-btn:hover { background: #16304f; color: #fff; }

    /* ── Video Player ── */
    .video-player-card { border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(29,53,87,0.18); }
    .video-player-screen { background: linear-gradient(135deg, #1d3557, #0a1628); min-height: 360px; position: relative; overflow: hidden; }
    .player-glow { position: absolute; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(244,162,97,0.15), transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -55%); }
    .player-icon-wrap { background: rgba(255,255,255,0.12); border-radius: 50%; padding: 16px; backdrop-filter: blur(4px); }
    .player-icon { font-size: 4rem; color: rgba(255,255,255,0.85); }
    .close-btn { width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; }
    .player-seek-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 5px; background: rgba(255,255,255,0.2); cursor: pointer; }
    .player-seek-fill { height: 100%; background: linear-gradient(90deg, #f4a261, #e63946); }
    .player-seek-thumb { position: absolute; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; border-radius: 50%; background: #fff; margin-left: -6px; box-shadow: 0 0 4px rgba(0,0,0,0.4); }
    .player-controls { background: #fff; padding: 14px 20px; border-top: 1px solid #f0f0f0; }
    .speed-btn { border: 1.5px solid #dee2e6; border-radius: 20px; padding: 2px 10px; font-size: 0.78rem; color: #666; transition: all 0.15s; }
    .speed-btn.active { background: #1d3557; color: #fff; border-color: #1d3557; }
    .speed-btn:hover:not(.active) { border-color: #1d3557; color: #1d3557; }

    /* ── View Toggle ── */
    .view-toggle { border: 1.5px solid #dee2e6; border-radius: 8px; color: #888; padding: 4px 10px; }
    .view-toggle.active { background: #1d3557; color: #fff; border-color: #1d3557; }

    /* ── Video Card (Grid) ── */
    .vcard { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; }
    .vcard:hover { transform: translateY(-5px); box-shadow: 0 10px 28px rgba(29,53,87,0.14); }
    .vcard-watched { border: 2px solid #d4edda; }

    .vcard-thumb { position: relative; overflow: hidden; aspect-ratio: 16/9; flex-shrink: 0; }
    .vcard-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
    .vcard:hover .vcard-img { transform: scale(1.04); }

    .vcard-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.38); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
    .vcard:hover .vcard-overlay { opacity: 1; }
    .play-btn-circle { width: 56px; height: 56px; background: rgba(255,255,255,0.92); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #1d3557; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }

    .vcard-type-badge { position: absolute; top: 10px; left: 10px; font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px; }
    .badge-concept { background: #1d3557; color: #fff; }
    .badge-full-chapter { background: #2d6a4f; color: #fff; }
    .badge-exam-prep { background: #e63946; color: #fff; }

    .vcard-duration { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
    .vcard-watched-badge { position: absolute; bottom: 10px; right: 10px; background: #2d6a4f; color: #fff; font-size: 0.7rem; font-weight: 600; padding: 3px 9px; border-radius: 20px; }

    .vcard-progress-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.3); }
    .vcard-progress-fill { height: 100%; background: linear-gradient(90deg, #f4a261, #e63946); }

    .vcard-body { padding: 14px; display: flex; flex-direction: column; flex-grow: 1; gap: 8px; }
    .vcard-title { font-size: 0.88rem; font-weight: 700; color: #1a1a2e; line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .subject-chip { background: #f0f4ff; color: #1d3557; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; border: 1px solid #d0daf0; }
    .progress-text { font-size: 0.72rem; font-weight: 600; }

    /* ── List View ── */
    .list-video-item { background: #fff; border-radius: 14px; padding: 14px; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.06); transition: all 0.2s; border: 1.5px solid transparent; }
    .list-video-item:hover { border-color: #1d3557; box-shadow: 0 4px 16px rgba(29,53,87,0.12); transform: translateX(3px); }
    .list-thumb-wrap { position: relative; width: 110px; height: 68px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
    .list-thumb { width: 100%; height: 100%; object-fit: cover; }
    .list-play-icon { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem; opacity: 0; transition: opacity 0.2s; }
    .list-video-item:hover .list-play-icon { opacity: 1; }
    .list-type-badge { font-size: 0.67rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; }
    .list-progress-bar { height: 4px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
    .list-progress-fill { height: 100%; background: linear-gradient(90deg, #f4a261, #e63946); border-radius: 10px; }

    /* ── Empty State ── */
    .empty-state { padding: 60px 20px; }
    .empty-icon { font-size: 3.5rem; color: #ccc; }
  `]
})
export class VideoLessonsComponent implements OnInit {
  allVideos: Video[] = [];
  filteredVideos: Video[] = [];
  selectedVideo: Video | null = null;
  resumeVideo: Video | null = null;
  filterType = '';
  filterSubject = '';
  filterStatus = '';
  playbackSpeed = 1;
  viewMode: 'grid' | 'list' = 'grid';
  speeds = [0.75, 1, 1.25, 1.5, 2];

  get watchedCount() { return this.allVideos.filter(v => v.watched).length; }
  get inProgressCount() { return this.allVideos.filter(v => v.progress > 0 && !v.watched).length; }
  get totalHours() {
    const mins = this.allVideos.reduce((acc, v) => {
      const parts = v.duration.split(':').map(Number);
      return acc + (parts[0] * 60 + parts[1]);
    }, 0);
    return Math.round(mins / 60 * 10) / 10;
  }

  private subjectNames: { [k: string]: string } = {
    math: 'Mathematics', physics: 'Physics', science: 'Science',
    english: 'English', ict: 'ICT', bangla: 'Bangla'
  };

  constructor(private demoData: DemoDataService, private ls: LocalStorageService) {}

  ngOnInit(): void {
    this.allVideos = this.demoData.getVideos();
    this.filteredVideos = [...this.allVideos];
    this.resumeVideo = this.allVideos.find(v => v.progress > 0 && v.progress < 100) || null;
  }

  applyFilter(): void {
    this.filteredVideos = this.allVideos.filter(v => {
      const typeOk = !this.filterType || v.type === this.filterType;
      const subjectOk = !this.filterSubject || v.subjectId === this.filterSubject;
      let statusOk = true;
      if (this.filterStatus === 'watched') statusOk = v.watched;
      else if (this.filterStatus === 'in-progress') statusOk = v.progress > 0 && !v.watched;
      else if (this.filterStatus === 'unwatched') statusOk = v.progress === 0;
      return typeOk && subjectOk && statusOk;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterSubject = '';
    this.filterStatus = '';
    this.filteredVideos = [...this.allVideos];
  }

  playVideo(video: Video): void {
    this.selectedVideo = video;
    video.watched = true;
    if (video.progress === 0) video.progress = 15;
    const saved = this.ls.get<{ [id: string]: number }>('video_progress') || {};
    saved[video.id] = video.progress;
    this.ls.set('video_progress', saved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getTypeBadgeClass(type: string): string {
    const map: { [k: string]: string } = { concept: 'badge-concept', 'full-chapter': 'badge-full-chapter', 'exam-prep': 'badge-exam-prep' };
    return map[type] || 'badge-concept';
  }

  getTypeLabel(type: string): string {
    const map: { [k: string]: string } = { concept: 'Concept', 'full-chapter': 'Full Chapter', 'exam-prep': 'Exam Prep' };
    return map[type] || type;
  }

  getSubjectName(id: string): string { return this.subjectNames[id] || id; }
}

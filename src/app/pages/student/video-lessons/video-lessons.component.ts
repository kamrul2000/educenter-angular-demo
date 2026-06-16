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
    <div class="videos-page py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h3 class="fw-bold mb-1">🎥 Video Lessons</h3>
            <p class="text-muted mb-0">Concept videos, full chapter guides, and exam prep</p>
          </div>
          <div class="d-flex gap-2">
            <select class="form-select form-select-sm" [(ngModel)]="filterType" (change)="applyFilter()">
              <option value="">All Types</option>
              <option value="concept">Concept Videos</option>
              <option value="full-chapter">Full Chapter</option>
              <option value="exam-prep">Exam Prep</option>
            </select>
            <select class="form-select form-select-sm" [(ngModel)]="filterSubject" (change)="applyFilter()">
              <option value="">All Subjects</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="science">Science</option>
              <option value="english">English</option>
              <option value="ict">ICT</option>
            </select>
          </div>
        </div>

        <!-- Resume Banner -->
        <div *ngIf="resumeVideo" class="alert alert-primary border-0 d-flex align-items-center gap-3 mb-4 rounded-3">
          <i class="bi bi-play-circle-fill fs-3"></i>
          <div class="flex-grow-1">
            <strong>Resume where you left off:</strong> {{ resumeVideo.title }}
            <div class="progress mt-1" style="height:4px">
              <div class="progress-bar bg-warning" [style.width]="resumeVideo.progress + '%'"></div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary rounded-pill" (click)="playVideo(resumeVideo)">
            <i class="bi bi-play-fill me-1"></i>Resume ({{ resumeVideo.progress }}%)
          </button>
        </div>

        <!-- Video Player Modal -->
        <div *ngIf="selectedVideo" class="video-player-section card border-0 shadow-sm mb-4">
          <div class="card-body p-0">
            <div class="video-player-wrapper bg-dark rounded-top" style="aspect-ratio:16/9; position:relative">
              <div class="d-flex align-items-center justify-content-center h-100 text-white flex-column gap-3">
                <i class="bi bi-play-circle-fill" style="font-size:5rem; opacity:0.7"></i>
                <div class="text-center px-4">
                  <h5 class="fw-bold mb-1">{{ selectedVideo.title }}</h5>
                  <p class="opacity-75 small">{{ selectedVideo.duration }} • Demo Video Player</p>
                </div>
                <div class="badge bg-warning text-dark px-3 py-2">
                  <i class="bi bi-youtube me-1"></i>Video plays here in production
                </div>
              </div>
              <button class="btn btn-sm btn-light position-absolute top-0 end-0 m-2" (click)="selectedVideo = null">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="p-3 d-flex align-items-center gap-3 bg-dark text-white rounded-bottom">
              <span class="small">Playback Speed:</span>
              <div class="d-flex gap-1">
                <button *ngFor="let s of speeds" class="btn btn-sm" [class.btn-warning]="playbackSpeed === s" [class.btn-outline-light]="playbackSpeed !== s" (click)="playbackSpeed = s">{{ s }}x</button>
              </div>
              <div class="ms-auto small opacity-75">
                <i class="bi bi-bookmark me-1"></i>Progress: {{ selectedVideo.progress }}%
              </div>
            </div>
          </div>
        </div>

        <!-- Video Grid -->
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let video of filteredVideos">
            <div class="video-card card border-0 shadow-sm h-100" (click)="playVideo(video)">
              <div class="video-thumbnail-wrapper position-relative">
                <img [src]="video.thumbnail" class="card-img-top" [alt]="video.title" style="height:180px; object-fit:cover">
                <div class="play-overlay d-flex align-items-center justify-content-center">
                  <i class="bi bi-play-circle-fill text-white" style="font-size:3.5rem; text-shadow:0 2px 8px rgba(0,0,0,0.5)"></i>
                </div>
                <div class="position-absolute bottom-0 end-0 m-2">
                  <span class="badge bg-dark">{{ video.duration }}</span>
                </div>
                <div class="position-absolute top-0 start-0 m-2">
                  <span class="badge" [class]="getTypeBadge(video.type)">{{ getTypeLabel(video.type) }}</span>
                </div>
                <div *ngIf="video.watched" class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-success"><i class="bi bi-check-circle me-1"></i>Watched</span>
                </div>
              </div>
              <div class="card-body p-3">
                <h6 class="fw-bold mb-1 small">{{ video.title }}</h6>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-light text-dark small">{{ getSubjectName(video.subjectId) }}</span>
                  <small class="text-muted">{{ video.progress }}% complete</small>
                </div>
                <div *ngIf="video.progress > 0" class="progress mt-2" style="height:3px">
                  <div class="progress-bar bg-warning" [style.width]="video.progress + '%'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!filteredVideos.length" class="text-center py-5">
          <i class="bi bi-camera-video-off fs-1 text-muted"></i>
          <p class="text-muted mt-2">No videos found for the selected filter.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-card { border-radius: 16px !important; cursor: pointer; transition: all 0.2s; overflow: hidden; }
    .video-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.15) !important; }
    .video-thumbnail-wrapper { position: relative; overflow: hidden; }
    .play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.2s; }
    .video-card:hover .play-overlay { opacity: 1; }
  `]
})
export class VideoLessonsComponent implements OnInit {
  allVideos: Video[] = [];
  filteredVideos: Video[] = [];
  selectedVideo: Video | null = null;
  resumeVideo: Video | null = null;
  filterType = '';
  filterSubject = '';
  playbackSpeed = 1;
  speeds = [0.75, 1, 1.25, 1.5, 2];

  private subjectNames: { [k: string]: string } = { math: 'Mathematics', physics: 'Physics', science: 'Science', english: 'English', ict: 'ICT', bangla: 'Bangla' };

  constructor(private demoData: DemoDataService, private ls: LocalStorageService) {}

  ngOnInit(): void {
    this.allVideos = this.demoData.getVideos();
    this.filteredVideos = [...this.allVideos];
    this.resumeVideo = this.allVideos.find(v => v.progress > 0 && v.progress < 100) || null;
  }

  applyFilter(): void {
    this.filteredVideos = this.allVideos.filter(v => (!this.filterType || v.type === this.filterType) && (!this.filterSubject || v.subjectId === this.filterSubject));
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

  getTypeBadge(type: string): string {
    const map: { [k: string]: string } = { concept: 'bg-primary', 'full-chapter': 'bg-success', 'exam-prep': 'bg-danger' };
    return map[type] || 'bg-secondary';
  }

  getTypeLabel(type: string): string {
    const map: { [k: string]: string } = { concept: 'Concept', 'full-chapter': 'Full Chapter', 'exam-prep': 'Exam Prep' };
    return map[type] || type;
  }

  getSubjectName(id: string): string { return this.subjectNames[id] || id; }
}

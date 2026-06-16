import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from '../../models/subject.model';

@Component({
  selector: 'app-subject-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="subject-card card border-0 shadow-sm h-100 cursor-pointer" (click)="cardClick.emit(subject)">
      <div class="card-body p-4 text-center">
        <div class="subject-icon mx-auto mb-3" [style.background]="subject.color + '15'" [style.color]="subject.color">
          <i class="bi fs-2" [class]="subject.icon"></i>
        </div>
        <h6 class="fw-bold mb-1">{{ subject.name }}</h6>
        <p class="text-muted small mb-2 bangla-text">{{ subject.nameBn }}</p>
        <div class="d-flex justify-content-center gap-2 flex-wrap">
          <span class="badge rounded-pill" [style.background]="subject.color + '20'" [style.color]="subject.color" style="font-size:0.7rem">
            {{ subject.chapters.length }} Chapters
          </span>
          <span *ngIf="progress > 0" class="badge rounded-pill bg-success-subtle text-success" style="font-size:0.7rem">
            {{ progress }}% done
          </span>
        </div>
        <div class="mt-3" *ngIf="progress > 0">
          <div class="progress" style="height:4px">
            <div class="progress-bar" [style.width]="progress + '%'" [style.background]="subject.color"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subject-card { border-radius: 16px !important; transition: all 0.25s ease; cursor: pointer; }
    .subject-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.12) !important; }
    .subject-icon { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class SubjectCardComponent {
  @Input() subject!: Subject;
  @Input() progress = 0;
  @Output() cardClick = new EventEmitter<Subject>();
}

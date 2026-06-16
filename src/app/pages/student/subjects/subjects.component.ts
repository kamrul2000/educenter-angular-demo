import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DemoDataService } from '../../../services/demo-data.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from '../../../models/subject.model';
import { SubjectCardComponent } from '../../../components/subject-card/subject-card.component';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SubjectCardComponent],
  template: `
    <div class="subjects-page py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Header -->
        <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
          <div>
            <h3 class="fw-bold mb-1">📚 My Subjects</h3>
            <p class="text-muted mb-0">Class {{ selectedClass }} — Select a subject to start learning</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <label class="fw-medium text-muted small">Filter by Class:</label>
            <select class="form-select form-select-sm w-auto" [(ngModel)]="selectedClass" (change)="filterByClass()">
              <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
            </select>
          </div>
        </div>

        <!-- All Subjects -->
        <div class="row g-4" *ngIf="filteredSubjects.length; else noSubjects">
          <div class="col-6 col-md-4 col-lg-3" *ngFor="let subject of filteredSubjects">
            <app-subject-card
              [subject]="subject"
              [progress]="getProgress(subject.id)"
              (cardClick)="goToSubject($event)">
            </app-subject-card>
          </div>
        </div>

        <ng-template #noSubjects>
          <div class="text-center py-5">
            <i class="bi bi-book-x fs-1 text-muted"></i>
            <p class="text-muted mt-2">No subjects available for this class.</p>
          </div>
        </ng-template>

        <!-- Progress Summary -->
        <div class="card border-0 shadow-sm mt-5">
          <div class="card-header bg-white border-0">
            <h6 class="fw-bold mb-0">📊 Overall Progress — Class {{ selectedClass }}</h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6" *ngFor="let subject of filteredSubjects.slice(0,6)">
                <div class="d-flex justify-content-between mb-1">
                  <span class="small fw-medium">{{ subject.name }}</span>
                  <span class="small text-muted">{{ getProgress(subject.id) }}%</span>
                </div>
                <div class="progress" style="height:8px">
                  <div class="progress-bar rounded-pill" [style.width]="getProgress(subject.id) + '%'" [style.background]="subject.color"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubjectsComponent implements OnInit {
  selectedClass = 9;
  filteredSubjects: Subject[] = [];

  private progressMap: { [k: string]: number } = { math: 65, english: 80, bangla: 70, science: 45, physics: 55, ict: 90, chemistry: 30, biology: 50 };

  constructor(private demoData: DemoDataService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.selectedClass = this.authService.getCurrentUser()?.class || 9;
    this.filterByClass();
  }

  filterByClass(): void {
    this.filteredSubjects = this.demoData.subjects.filter(s => s.classes.includes(Number(this.selectedClass)));
  }

  getProgress(subjectId: string): number {
    return this.progressMap[subjectId] || 0;
  }

  goToSubject(subject: Subject): void {
    this.router.navigate(['/subjects', subject.id]);
  }
}

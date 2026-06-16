import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiDemoService } from '../../../services/ai-demo.service';

@Component({
  selector: 'app-ai-homework',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="homework-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="text-center mb-4">
              <div class="solver-icon mx-auto mb-3"><i class="bi bi-camera-fill fs-2 text-white"></i></div>
              <h3 class="fw-bold">AI Homework Solver</h3>
              <p class="text-muted">হোমওয়ার্কের সমস্যার ছবি তুলুন বা টাইপ করুন — AI সমাধান দেবে!</p>
            </div>

            <div class="card border-0 shadow-sm mb-4" style="border-radius:20px">
              <div class="card-body p-5">

                <!-- Upload Area -->
                <div class="upload-zone text-center mb-4 p-5 rounded-3"
                     [class.dragover]="isDragging"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (dragleave)="isDragging = false"
                     (drop)="onDrop($event)">
                  <div *ngIf="!imagePreview">
                    <i class="bi bi-cloud-upload fs-1 text-primary mb-3 d-block"></i>
                    <h6 class="fw-bold text-primary">ছবি আপলোড করুন</h6>
                    <p class="text-muted small mb-0">JPG, PNG — Click to browse or drag & drop</p>
                  </div>
                  <div *ngIf="imagePreview" class="position-relative">
                    <img [src]="imagePreview" class="img-fluid rounded-3" style="max-height:250px" alt="Homework">
                    <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle" (click)="clearImage($event)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <input type="file" #fileInput accept="image/*" class="d-none" (change)="onFileSelect($event)">
                </div>

                <!-- Subject Selection -->
                <div class="mb-3">
                  <label class="form-label fw-medium">বিষয় নির্বাচন করুন:</label>
                  <div class="d-flex gap-2 flex-wrap">
                    <button *ngFor="let s of subjects" class="btn btn-sm rounded-pill"
                            [class.btn-primary]="selectedSubject === s.id"
                            [class.btn-outline-secondary]="selectedSubject !== s.id"
                            (click)="selectedSubject = s.id">
                      {{ s.name }}
                    </button>
                  </div>
                </div>

                <!-- Problem Description -->
                <div class="mb-4">
                  <label class="form-label fw-medium">সমস্যার বিবরণ লিখুন (Optional):</label>
                  <textarea class="form-control" rows="3" [(ngModel)]="problemDescription" placeholder="যেমন: 'ত্রিভুজের ক্ষেত্রফল বের করতে পারছি না' বা 'Solve for x: 2x + 5 = 15'"></textarea>
                </div>

                <!-- Solve Button -->
                <button class="btn btn-primary btn-lg w-100 fw-bold rounded-pill" (click)="solveHomework()" [disabled]="isSolving || (!imagePreview && !problemDescription)">
                  <span *ngIf="isSolving" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!isSolving" class="bi bi-magic me-2"></i>
                  {{ isSolving ? 'Solving...' : 'Solve with AI' }}
                </button>
              </div>
            </div>

            <!-- Solution Output -->
            <div *ngIf="solution" class="solution-card card border-0 shadow-sm" style="border-radius:20px">
              <div class="card-header bg-success text-white p-3 d-flex align-items-center gap-2" style="border-radius: 20px 20px 0 0">
                <i class="bi bi-check-circle-fill fs-5"></i>
                <h6 class="fw-bold mb-0">AI Solution</h6>
                <span class="ms-auto badge bg-white text-success">{{ selectedSubjectName }}</span>
              </div>
              <div class="card-body p-4">
                <div class="solution-content" [innerHTML]="formatSolution(solution)"></div>
                <div class="d-flex gap-2 mt-4">
                  <button class="btn btn-outline-primary rounded-pill btn-sm" (click)="copyToClipboard()">
                    <i class="bi bi-clipboard me-1"></i>Copy Solution
                  </button>
                  <button class="btn btn-outline-secondary rounded-pill btn-sm" (click)="solution = ''">
                    <i class="bi bi-x-circle me-1"></i>Clear
                  </button>
                </div>
              </div>
            </div>

            <!-- Features Info -->
            <div class="row g-3 mt-4">
              <div class="col-md-4" *ngFor="let f of features">
                <div class="card border-0 shadow-sm text-center p-3" style="border-radius:12px">
                  <div class="fs-2 mb-1">{{ f.icon }}</div>
                  <h6 class="small fw-bold">{{ f.title }}</h6>
                  <p class="text-muted small mb-0">{{ f.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .solver-icon { width: 70px; height: 70px; background: linear-gradient(135deg, #2d6a4f, #52b788); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
    .upload-zone { border: 2px dashed #dee2e6; cursor: pointer; transition: all 0.2s; min-height: 160px; display: flex; align-items: center; justify-content: center; flex-direction: column; }
    .upload-zone:hover, .upload-zone.dragover { border-color: #1d3557; background: #f0f4ff; }
    .solution-content { white-space: pre-line; line-height: 1.8; }
  `]
})
export class AiHomeworkComponent {
  imagePreview: string | null = null;
  selectedSubject = 'math';
  problemDescription = '';
  isSolving = false;
  solution = '';
  isDragging = false;
  copiedToast = false;

  subjects = [
    { id: 'math', name: '📐 Math' },
    { id: 'science', name: '🔬 Science' },
    { id: 'english', name: '📝 English' },
    { id: 'physics', name: '⚡ Physics' },
    { id: 'chemistry', name: '🧪 Chemistry' },
  ];

  features = [
    { icon: '📸', title: 'Image Recognition', desc: 'Photo upload support for handwritten problems' },
    { icon: '⚡', title: 'Instant Solution', desc: 'Get step-by-step solution in seconds' },
    { icon: '🇧🇩', title: 'Bangla Support', desc: 'Solution available in Bangla & English' },
  ];

  get selectedSubjectName(): string {
    return this.subjects.find(s => s.id === this.selectedSubject)?.name || '';
  }

  constructor(private aiService: AiDemoService) {}

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.readFile(file);
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.isDragging = true; }
  onDrop(event: DragEvent): void {
    event.preventDefault(); this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file);
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => { this.imagePreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  clearImage(event: Event): void { event.stopPropagation(); this.imagePreview = null; }

  solveHomework(): void {
    this.isSolving = true;
    this.solution = '';
    setTimeout(() => {
      this.isSolving = false;
      const desc = this.problemDescription || (this.imagePreview ? 'Uploaded homework problem' : 'General problem');
      this.solution = this.aiService.solveHomework(this.selectedSubject, desc);
    }, 1500);
  }

  formatSolution(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  copyToClipboard(): void {
    navigator.clipboard?.writeText(this.solution);
    this.copiedToast = true;
    setTimeout(() => this.copiedToast = false, 2000);
  }
}

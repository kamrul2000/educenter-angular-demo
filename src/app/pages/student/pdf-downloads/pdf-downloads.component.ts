import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemoDataService } from '../../../services/demo-data.service';
import { PdfResource } from '../../../models/progress.model';

@Component({
  selector: 'app-pdf-downloads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pdf-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="text-center mb-5">
          <h3 class="fw-bold mb-1">📥 PDF Downloads</h3>
          <p class="text-muted">Notes, Formula Sheets, Suggestions & Model Test Papers</p>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar card border-0 shadow-sm p-3 mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-3 col-6">
              <label class="form-label small fw-medium">Class</label>
              <select class="form-select form-select-sm" [(ngModel)]="filterClass" (change)="applyFilter()">
                <option [value]="0">All Classes</option>
                <option *ngFor="let c of [6,7,8,9,10]" [value]="c">Class {{ c }}</option>
              </select>
            </div>
            <div class="col-md-3 col-6">
              <label class="form-label small fw-medium">Type</label>
              <select class="form-select form-select-sm" [(ngModel)]="filterType" (change)="applyFilter()">
                <option value="">All Types</option>
                <option value="notes">Notes</option>
                <option value="summary">Summary</option>
                <option value="formula">Formula Sheet</option>
                <option value="suggestion">Suggestion</option>
                <option value="model-test">Model Test</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-medium">Search</label>
              <input type="text" class="form-control form-control-sm" [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Search PDFs...">
            </div>
            <div class="col-md-2">
              <button class="btn btn-sm btn-outline-secondary w-100" (click)="resetFilter()">
                <i class="bi bi-x-circle me-1"></i>Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Type Tabs -->
        <div class="d-flex gap-2 flex-wrap mb-4">
          <button *ngFor="let t of types" class="btn btn-sm rounded-pill" [class.btn-primary]="activeType === t.value" [class.btn-outline-secondary]="activeType !== t.value" (click)="activeType = t.value; filterType = t.value; applyFilter()">
            {{ t.icon }} {{ t.label }}
          </button>
        </div>

        <!-- PDF Grid -->
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let pdf of filteredPdfs">
            <div class="pdf-card card border-0 shadow-sm h-100">
              <div class="card-body p-4">
                <!-- Icon -->
                <div class="pdf-icon-wrapper mb-3" [class]="getTypeClass(pdf.type)">
                  <i class="bi bi-file-pdf-fill fs-1" [class]="getTypeIconClass(pdf.type)"></i>
                </div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="fw-bold mb-0 flex-grow-1 pe-2">{{ pdf.title }}</h6>
                  <span *ngIf="pdf.isPremium" class="badge bg-warning text-dark flex-shrink-0">Premium</span>
                </div>
                <div class="d-flex flex-wrap gap-2 mb-3">
                  <span class="badge bg-light text-dark border">Class {{ pdf.class }}</span>
                  <span class="badge" [class]="getTypeBadgeClass(pdf.type)">{{ getTypeLabel(pdf.type) }}</span>
                  <span class="badge bg-secondary-subtle text-secondary">{{ pdf.pages }} pages</span>
                  <span class="badge bg-secondary-subtle text-secondary">{{ pdf.fileSize }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between mt-auto">
                  <span class="text-muted small"><i class="bi bi-download me-1"></i>{{ pdf.downloadCount.toLocaleString() }} downloads</span>
                  <button class="btn btn-sm rounded-pill fw-semibold" [class.btn-primary]="!pdf.isPremium" [class.btn-warning]="pdf.isPremium" (click)="downloadPdf(pdf)">
                    <i class="bi" [class]="pdf.isPremium ? 'bi-lock-fill' : 'bi-download'" class="me-1"></i>
                    {{ pdf.isPremium ? 'Unlock' : 'Download' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!filteredPdfs.length" class="col-12 text-center py-5">
            <i class="bi bi-file-earmark-x fs-1 text-muted"></i>
            <p class="text-muted mt-2">No PDFs found. Try different filters.</p>
          </div>
        </div>

        <!-- Download Toast -->
        <div *ngIf="downloadToast" class="position-fixed bottom-0 end-0 p-3" style="z-index:9999">
          <div class="toast show bg-success text-white border-0">
            <div class="toast-body d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill fs-5"></i>
              <span>{{ downloadToast }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pdf-card { border-radius: 16px !important; transition: all 0.2s; }
    .pdf-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.12) !important; }
    .pdf-icon-wrapper { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .filter-bar { border-radius: 16px !important; }
  `]
})
export class PdfDownloadsComponent implements OnInit {
  allPdfs: PdfResource[] = [];
  filteredPdfs: PdfResource[] = [];
  filterClass = 0;
  filterType = '';
  searchTerm = '';
  activeType = '';
  downloadToast = '';

  types = [
    { value: '', label: 'All', icon: '📁' },
    { value: 'notes', label: 'Notes', icon: '📝' },
    { value: 'formula', label: 'Formulas', icon: '📐' },
    { value: 'summary', label: 'Summary', icon: '📄' },
    { value: 'suggestion', label: 'Suggestion', icon: '⭐' },
    { value: 'model-test', label: 'Model Test', icon: '📋' },
  ];

  constructor(private demoData: DemoDataService) {}

  ngOnInit(): void {
    this.allPdfs = this.demoData.getPdfResources();
    this.filteredPdfs = [...this.allPdfs];
  }

  applyFilter(): void {
    this.filteredPdfs = this.allPdfs.filter(p => {
      if (this.filterClass && p.class !== Number(this.filterClass)) return false;
      if (this.filterType && p.type !== this.filterType) return false;
      if (this.searchTerm && !p.title.toLowerCase().includes(this.searchTerm.toLowerCase())) return false;
      return true;
    });
  }

  resetFilter(): void { this.filterClass = 0; this.filterType = ''; this.searchTerm = ''; this.activeType = ''; this.applyFilter(); }

  downloadPdf(pdf: PdfResource): void {
    if (pdf.isPremium) {
      this.showToast('🔒 Upgrade to Premium to download this resource!');
    } else {
      pdf.downloadCount++;
      this.showToast(`✅ Downloading: ${pdf.title}`);
    }
  }

  showToast(msg: string): void {
    this.downloadToast = msg;
    setTimeout(() => this.downloadToast = '', 3000);
  }

  getTypeClass(type: string): string {
    const map: { [k: string]: string } = { notes: 'bg-primary-subtle', formula: 'bg-success-subtle', summary: 'bg-info-subtle', suggestion: 'bg-warning-subtle', 'model-test': 'bg-danger-subtle' };
    return map[type] || 'bg-secondary-subtle';
  }

  getTypeIconClass(type: string): string {
    const map: { [k: string]: string } = { notes: 'text-primary', formula: 'text-success', summary: 'text-info', suggestion: 'text-warning', 'model-test': 'text-danger' };
    return map[type] || 'text-secondary';
  }

  getTypeBadgeClass(type: string): string {
    const map: { [k: string]: string } = { notes: 'bg-primary', formula: 'bg-success', summary: 'bg-info', suggestion: 'bg-warning text-dark', 'model-test': 'bg-danger' };
    return map[type] || 'bg-secondary';
  }

  getTypeLabel(type: string): string {
    const map: { [k: string]: string } = { notes: 'Notes', formula: 'Formula', summary: 'Summary', suggestion: 'Suggestion', 'model-test': 'Model Test' };
    return map[type] || type;
  }
}

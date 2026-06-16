import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card card border-0 shadow-sm h-100">
      <div class="card-body p-4">
        <div class="d-flex align-items-start justify-content-between">
          <div>
            <p class="text-muted small mb-1 fw-medium">{{ label }}</p>
            <h3 class="fw-bold mb-0" [style.color]="color">{{ value }}</h3>
            <small class="text-muted" *ngIf="subtext">{{ subtext }}</small>
          </div>
          <div class="icon-box" [style.background]="color + '20'" [style.color]="color">
            <i class="bi" [class]="icon + ' fs-4'"></i>
          </div>
        </div>
        <div class="mt-3" *ngIf="trend !== undefined">
          <span [class]="trend >= 0 ? 'text-success' : 'text-danger'" class="small fw-medium">
            <i class="bi" [class]="trend >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right'"></i>
            {{ Math.abs(trend) }}% vs last week
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card { border-radius: 16px !important; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-3px); }
    .icon-box { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = 'bi-graph-up';
  @Input() color = '#1d3557';
  @Input() subtext = '';
  @Input() trend?: number;
  Math = Math;
}

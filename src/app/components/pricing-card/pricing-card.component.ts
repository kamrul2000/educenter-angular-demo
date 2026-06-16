import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingPlan } from '../../models/pricing.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pricing-card card border-0 h-100" [class.popular-plan]="plan.isPopular">
      <div *ngIf="plan.isPopular" class="popular-badge">
        <span class="badge bg-warning text-dark">⭐ Most Popular</span>
      </div>
      <div class="card-body p-4">
        <div class="text-center mb-4">
          <h5 class="fw-bold">{{ plan.name }}</h5>
          <p class="bangla-text text-muted small">{{ plan.nameBn }}</p>
          <div class="price-display my-3">
            <span class="currency">{{ plan.currency }}</span>
            <span class="amount fw-bold" [style.color]="plan.color">{{ plan.price === 0 ? 'Free' : plan.price }}</span>
            <span class="period text-muted" *ngIf="plan.price > 0">/{{ plan.period }}</span>
          </div>
        </div>
        <ul class="list-unstyled mb-4">
          <li *ngFor="let f of plan.features" class="d-flex align-items-start gap-2 mb-2">
            <i class="bi bi-check-circle-fill text-success mt-1 flex-shrink-0"></i>
            <span class="small">{{ f }}</span>
          </li>
          <li *ngFor="let f of plan.notIncluded" class="d-flex align-items-start gap-2 mb-2 text-muted">
            <i class="bi bi-x-circle mt-1 flex-shrink-0"></i>
            <span class="small">{{ f }}</span>
          </li>
        </ul>
        <a routerLink="/signup" class="btn w-100 fw-semibold"
           [style.background]="plan.color" [style.borderColor]="plan.color"
           [class.text-white]="plan.id !== 'free'"
           [class.btn-outline-secondary]="plan.id === 'free'">
          {{ plan.buttonText }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .pricing-card { border-radius: 20px !important; transition: transform 0.2s; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .pricing-card:hover { transform: translateY(-6px); }
    .popular-plan { border: 2px solid #ffd700 !important; }
    .popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); }
    .price-display .currency { font-size: 1.2rem; vertical-align: top; margin-top: 8px; display: inline-block; }
    .price-display .amount { font-size: 2.8rem; line-height: 1; }
    .price-display .period { font-size: 0.9rem; }
  `]
})
export class PricingCardComponent {
  @Input() plan!: PricingPlan;
}

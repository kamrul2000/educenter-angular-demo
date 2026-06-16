import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PricingCardComponent } from '../../components/pricing-card/pricing-card.component';
import { DemoDataService } from '../../services/demo-data.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, PricingCardComponent],
  template: `
    <div class="pricing-page py-5">
      <div class="container">
        <!-- Header -->
        <div class="text-center mb-5 py-3">
          <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">💰 Pricing</span>
          <h1 class="fw-bold display-5 mb-3">সাশ্রয়ী শিক্ষা পরিকল্পনা</h1>
          <p class="lead text-muted">Choose the plan that fits your learning goals</p>
        </div>

        <!-- Plans -->
        <div class="row g-4 justify-content-center mb-5">
          <div class="col-md-6 col-lg-3" *ngFor="let plan of plans">
            <app-pricing-card [plan]="plan"></app-pricing-card>
          </div>
        </div>

        <!-- Feature Comparison -->
        <div class="card border-0 shadow-sm mb-5">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-striped mb-0">
                <thead class="table-dark">
                  <tr>
                    <th class="py-3">Feature</th>
                    <th class="text-center py-3">Free</th>
                    <th class="text-center py-3">Basic ৳99</th>
                    <th class="text-center py-3">Premium ৳199</th>
                    <th class="text-center py-3">Annual ৳999</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let f of comparisonFeatures">
                    <td class="fw-medium py-3">{{ f.name }}</td>
                    <td class="text-center py-3"><i class="bi" [class]="f.free ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'"></i></td>
                    <td class="text-center py-3"><i class="bi" [class]="f.basic ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'"></i></td>
                    <td class="text-center py-3"><i class="bi" [class]="f.premium ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'"></i></td>
                    <td class="text-center py-3"><i class="bi" [class]="f.annual ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'"></i></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h3 class="fw-bold text-center mb-4">সাধারণ প্রশ্নাবলী (FAQ)</h3>
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item border-0 mb-3 shadow-sm rounded-3 overflow-hidden" *ngFor="let faq of faqs; let i = index">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-semibold" type="button" [attr.data-bs-toggle]="'collapse'" [attr.data-bs-target]="'#faq' + i">
                    {{ faq.q }}
                  </button>
                </h2>
                <div [id]="'faq' + i" class="accordion-collapse collapse" [attr.data-bs-parent]="'#faqAccordion'">
                  <div class="accordion-body text-muted">{{ faq.a }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center mt-5 py-4 bg-primary rounded-4 text-white">
          <h3 class="fw-bold mb-2">এখনই শুরু করুন</h3>
          <p class="opacity-75 mb-4">No credit card needed for free plan</p>
          <a routerLink="/signup" class="btn btn-warning btn-lg fw-bold rounded-pill px-5">
            <i class="bi bi-rocket-takeoff me-2"></i>Get Started Free
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pricing-page { background: #f8f9fa; min-height: calc(100vh - 140px); }
  `]
})
export class PricingComponent {
  plans = this.demoData.getPricingPlans();

  constructor(private demoData: DemoDataService) {}

  comparisonFeatures = [
    { name: 'Chapter Notes', free: true, basic: true, premium: true, annual: true },
    { name: 'Limited MCQ (50/month)', free: true, basic: false, premium: false, annual: false },
    { name: 'Unlimited MCQ Practice', free: false, basic: true, premium: true, annual: true },
    { name: 'All Video Lessons', free: false, basic: true, premium: true, annual: true },
    { name: 'Board Question Bank', free: false, basic: true, premium: true, annual: true },
    { name: 'PDF Downloads', free: false, basic: true, premium: true, annual: true },
    { name: 'Mock Tests & Ranking', free: false, basic: false, premium: true, annual: true },
    { name: 'AI Tutor Chatbot', free: false, basic: false, premium: true, annual: true },
    { name: 'AI Homework Solver', free: false, basic: false, premium: true, annual: true },
    { name: 'AI Study Plan', free: false, basic: false, premium: true, annual: true },
    { name: 'Parent Dashboard', free: false, basic: false, premium: false, annual: true },
    { name: 'Performance Analytics', free: false, basic: true, premium: true, annual: true },
  ];

  faqs = [
    { q: 'বিনামূল্যে পরিকল্পনায় কী কী পাবো?', a: 'বিনামূল্যে পরিকল্পনায় সীমিত notes, ৫০টি MCQ প্রতি মাসে এবং কিছু ভিডিও দেখতে পারবেন।' },
    { q: 'কীভাবে পেমেন্ট করবো?', a: 'বিকাশ, নগদ, রকেট এবং ক্রেডিট/ডেবিট কার্ড দিয়ে পেমেন্ট করা যাবে। (Demo mode — no actual payment needed)' },
    { q: 'Subscription বাতিল করা যাবে কি?', a: 'হ্যাঁ, যেকোনো সময় Subscription বাতিল করা যাবে। কোনো লুকানো চার্জ নেই।' },
    { q: 'Annual plan এ কতটুকু সাশ্রয় হবে?', a: 'Annual plan এ প্রতি মাসে মাত্র ৮৩ টাকা — Premium monthly (৳১৯৯/মাস) এর তুলনায় প্রায় ৫৮% সাশ্রয়।' },
    { q: 'Class কি পরিবর্তন করা যাবে?', a: 'হ্যাঁ, Account settings থেকে যেকোনো সময় class পরিবর্তন করা যাবে।' },
  ];
}

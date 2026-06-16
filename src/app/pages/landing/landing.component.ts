import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricingCardComponent } from '../../components/pricing-card/pricing-card.component';
import { DemoDataService } from '../../services/demo-data.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, PricingCardComponent],
  template: `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="container py-5 position-relative">
        <div class="row align-items-center min-vh-75 py-5">
          <div class="col-lg-6">
            <span class="badge bg-warning text-dark px-3 py-2 mb-3 rounded-pill fw-semibold">
              🇧🇩 Bangladesh's #1 Ed-Tech Platform
            </span>
            <h1 class="hero-title fw-bold text-white mb-3">
              স্মার্টভাবে পড়ুন,<br>
              <span class="text-warning">আত্মবিশ্বাসী হন</span>
            </h1>
            <p class="text-light opacity-90 fs-5 mb-4 lead">
              Class 6 to Class 10 — Complete Digital Education Platform.<br>
              Notes • Videos • MCQ • AI Tutor • Mock Tests
            </p>
            <div class="d-flex flex-wrap gap-3 mb-4">
              <a routerLink="/signup" class="btn btn-warning btn-lg fw-bold px-4 rounded-pill">
                <i class="bi bi-rocket-takeoff me-2"></i>Start Learning Free
              </a>
              <a routerLink="/pricing" class="btn btn-outline-light btn-lg px-4 rounded-pill">
                <i class="bi bi-eye me-2"></i>View Plans
              </a>
            </div>
            <div class="d-flex gap-4 text-white">
              <div class="text-center">
                <div class="fs-4 fw-bold text-warning">50,000+</div>
                <small class="opacity-75">Students</small>
              </div>
              <div class="text-center">
                <div class="fs-4 fw-bold text-warning">500+</div>
                <small class="opacity-75">Videos</small>
              </div>
              <div class="text-center">
                <div class="fs-4 fw-bold text-warning">10,000+</div>
                <small class="opacity-75">MCQ Questions</small>
              </div>
              <div class="text-center">
                <div class="fs-4 fw-bold text-warning">100%</div>
                <small class="opacity-75">Board Aligned</small>
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-5 mt-lg-0 text-center">
            <div class="hero-visual">
              <div class="hero-card-group">
                <div class="floating-card card1">
                  <i class="bi bi-robot text-primary fs-4"></i>
                  <span>AI Tutor</span>
                </div>
                <div class="floating-card card2">
                  <i class="bi bi-trophy-fill text-warning fs-4"></i>
                  <span>৯৫% Score!</span>
                </div>
                <div class="floating-card card3">
                  <i class="bi bi-bar-chart-fill text-success fs-4"></i>
                  <span>Progress Track</span>
                </div>
                <div class="main-visual-circle">
                  <i class="bi bi-mortarboard-fill text-white" style="font-size:5rem"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEMO LOGIN BANNER -->
    <div class="alert alert-info border-0 rounded-0 text-center py-2 mb-0">
      <i class="bi bi-info-circle-fill me-2"></i>
      <strong>Demo Mode:</strong> Login with <code>student&#64;demo.com</code> / <code>demo123</code> to explore all features instantly!
      <a routerLink="/login" class="btn btn-sm btn-primary ms-3">Login Now</a>
    </div>

    <!-- FEATURES SECTION -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-2">Features</span>
          <h2 class="fw-bold h1">সব কিছু এক জায়গায়</h2>
          <p class="text-muted lead">Everything a Bangladeshi student needs to excel in academics</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" *ngFor="let feature of features">
            <div class="feature-card card border-0 shadow-sm h-100 text-center p-4">
              <div class="feature-icon mx-auto mb-3" [style.background]="feature.bg">
                <i class="bi fs-2" [class]="feature.icon" [style.color]="feature.color"></i>
              </div>
              <h6 class="fw-bold">{{ feature.title }}</h6>
              <p class="text-muted small mb-0">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SUBJECTS SECTION -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold h1">সকল বিষয় কভার করা হয়</h2>
          <p class="text-muted">Class 6 to 10 — All Subjects, All Chapters</p>
        </div>
        <div class="row g-3">
          <div class="col-6 col-md-4 col-lg-2" *ngFor="let s of demoData.subjects.slice(0, 12)">
            <div class="subject-pill d-flex align-items-center gap-2 p-3 rounded-3 h-100" [style.borderLeft]="'4px solid ' + s.color">
              <i class="bi" [class]="s.icon" [style.color]="s.color"></i>
              <div>
                <div class="fw-semibold small">{{ s.name }}</div>
                <div class="text-muted" style="font-size:0.7rem">{{ s.nameBn }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-5 bg-primary text-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold h1">কীভাবে কাজ করে?</h2>
          <p class="opacity-75">৩টি সহজ ধাপে শুরু করুন</p>
        </div>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="step-circle mx-auto mb-3">1</div>
            <h5 class="fw-bold">Sign Up করুন</h5>
            <p class="opacity-75">বিনামূল্যে রেজিস্ট্রেশন করুন এবং আপনার ক্লাস নির্বাচন করুন</p>
          </div>
          <div class="col-md-4">
            <div class="step-circle mx-auto mb-3">2</div>
            <h5 class="fw-bold">পড়া শুরু করুন</h5>
            <p class="opacity-75">Notes, Videos, MCQ — সব কিছু পড়ুন ও অনুশীলন করুন</p>
          </div>
          <div class="col-md-4">
            <div class="step-circle mx-auto mb-3">3</div>
            <h5 class="fw-bold">পরীক্ষায় এগিয়ে যান</h5>
            <p class="opacity-75">Mock Test দিন, AI এর সাহায্য নিন এবং সাফল্য অর্জন করুন</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AI FEATURES -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <span class="badge bg-warning text-dark px-3 py-2 rounded-pill mb-2">🤖 AI Powered</span>
          <h2 class="fw-bold h1">AI-চালিত শিক্ষা সহায়তা</h2>
          <p class="text-muted">Bangladesh's first AI-powered study companion for school students</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="ai-card card border-0 shadow-sm p-4 h-100">
              <div class="ai-icon mb-3"><i class="bi bi-chat-dots-fill text-primary fs-2"></i></div>
              <h5 class="fw-bold">AI Tutor</h5>
              <p class="text-muted small">বাংলায় যেকোনো প্রশ্ন করুন। তাৎক্ষণিক উত্তর পান।</p>
              <a routerLink="/login" class="btn btn-primary btn-sm rounded-pill">Try Now</a>
            </div>
          </div>
          <div class="col-md-4">
            <div class="ai-card card border-0 shadow-sm p-4 h-100">
              <div class="ai-icon mb-3"><i class="bi bi-camera-fill text-success fs-2"></i></div>
              <h5 class="fw-bold">Homework Solver</h5>
              <p class="text-muted small">হোমওয়ার্কের ছবি তুলুন, তাৎক্ষণিক সমাধান পান।</p>
              <a routerLink="/login" class="btn btn-success btn-sm rounded-pill">Try Now</a>
            </div>
          </div>
          <div class="col-md-4">
            <div class="ai-card card border-0 shadow-sm p-4 h-100">
              <div class="ai-icon mb-3"><i class="bi bi-calendar-check-fill text-warning fs-2"></i></div>
              <h5 class="fw-bold">Study Plan Generator</h5>
              <p class="text-muted small">পরীক্ষার তারিখ দিন, AI আপনার পড়ার রুটিন তৈরি করবে।</p>
              <a routerLink="/login" class="btn btn-warning btn-sm rounded-pill">Try Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING PREVIEW -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold h1">সাশ্রয়ী মূল্য পরিকল্পনা</h2>
          <p class="text-muted">Affordable plans for every student and family</p>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-md-3" *ngFor="let plan of pricingPlans">
            <app-pricing-card [plan]="plan"></app-pricing-card>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="py-5 bg-primary text-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold h1">শিক্ষার্থীরা কী বলছেন?</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-4" *ngFor="let t of testimonials">
            <div class="testimonial-card card border-0 p-4" style="background:rgba(255,255,255,0.1)">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="avatar-circle">{{ t.name[0] }}</div>
                <div>
                  <div class="fw-bold text-white">{{ t.name }}</div>
                  <small class="opacity-75">{{ t.class }}</small>
                </div>
              </div>
              <p class="opacity-90 mb-2">"{{ t.text }}"</p>
              <div class="text-warning">
                <i class="bi bi-star-fill" *ngFor="let s of [1,2,3,4,5]"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-5 bg-warning">
      <div class="container text-center">
        <h2 class="fw-bold h1 mb-3">আজই শুরু করুন — বিনামূল্যে!</h2>
        <p class="text-dark fs-5 mb-4">No credit card required. Start learning in 60 seconds.</p>
        <a routerLink="/signup" class="btn btn-dark btn-lg rounded-pill px-5 fw-bold">
          <i class="bi bi-rocket-takeoff me-2"></i>Create Free Account
        </a>
      </div>
    </section>
  `,
  styles: [`
    .hero-section { background: linear-gradient(135deg, #1d3557 0%, #2d6a8f 50%, #457b9d 100%); position: relative; overflow: hidden; }
    .hero-bg { position:absolute; inset:0; background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,215,0,0.1) 0%, transparent 40%); }
    .min-vh-75 { min-height: 75vh; }
    .hero-title { font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.2; }
    .main-visual-circle { width: 220px; height: 220px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: auto; border: 3px solid rgba(255,255,255,0.3); }
    .hero-card-group { position: relative; display: inline-block; padding: 60px; }
    .floating-card { position: absolute; background: white; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); font-weight: 600; font-size: 0.85rem; animation: float 3s ease-in-out infinite; }
    .card1 { top: 0; left: -20px; animation-delay: 0s; }
    .card2 { top: 30%; right: -30px; animation-delay: 1s; }
    .card3 { bottom: 10%; left: -10px; animation-delay: 2s; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .feature-card { border-radius: 16px !important; transition: transform 0.2s; }
    .feature-card:hover { transform: translateY(-4px); }
    .feature-icon { width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
    .subject-pill { background: white; border: 1px solid #eee; transition: all 0.2s; }
    .subject-pill:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.08); transform: translateY(-2px); }
    .step-circle { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border: 3px solid rgba(255,255,255,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; }
    .ai-card { border-radius: 16px !important; transition: transform 0.2s; }
    .ai-card:hover { transform: translateY(-4px); }
    .testimonial-card { border-radius: 16px !important; backdrop-filter: blur(10px); }
    .avatar-circle { width: 44px; height: 44px; background: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
  `]
})
export class LandingComponent {
  constructor(public demoData: DemoDataService) {}

  pricingPlans = this.demoData.getPricingPlans();

  features = [
    { icon: 'bi-book-half', title: 'Smart Notes', desc: 'Chapter-wise notes with key points, formulas, and infographics', color: '#1d3557', bg: '#1d355720' },
    { icon: 'bi-play-circle-fill', title: 'Video Lessons', desc: 'Concept videos, full chapter videos, exam prep guides', color: '#e63946', bg: '#e6394620' },
    { icon: 'bi-check2-square', title: 'MCQ Practice', desc: 'Chapter-wise, topic-wise MCQ with instant feedback', color: '#2d6a4f', bg: '#2d6a4f20' },
    { icon: 'bi-clock-history', title: 'Mock Tests', desc: 'Full subject, chapter, and weekly timed mock exams', color: '#f4a261', bg: '#f4a26120' },
    { icon: 'bi-robot', title: 'AI Tutor', desc: 'Ask any question in Bangla and get instant explanations', color: '#6a4c93', bg: '#6a4c9320' },
    { icon: 'bi-bar-chart-fill', title: 'Analytics', desc: 'Track your strong/weak chapters and study streak', color: '#0077b6', bg: '#0077b620' },
    { icon: 'bi-database-fill', title: 'Question Bank', desc: 'Board-wise, year-wise past exam questions', color: '#bc6c25', bg: '#bc6c2520' },
    { icon: 'bi-file-pdf-fill', title: 'PDF Downloads', desc: 'Notes, formulas, suggestions and model test papers', color: '#d62828', bg: '#d6282820' },
  ];

  testimonials = [
    { name: 'Tahmina Akter', class: 'Class 10, Dhaka', text: 'EduCenter এর AI Tutor আমাকে Math বুঝতে অনেক সাহায্য করেছে। SSC তে A+ পেয়েছি!' },
    { name: 'Rifat Hossain', class: 'Class 9, Chattogram', text: 'Mock Test system টা অসাধারণ! পরীক্ষার আগে প্রতিদিন দিতাম। আত্মবিশ্বাস অনেক বেড়ে গেছে।' },
    { name: 'Nusrat Jahan', class: 'Class 8, Sylhet', text: 'Video lessons গুলো খুব সহজ ভাষায় বোঝানো। Physics এ ভয় ছিল, এখন আর নেই!' },
  ];
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer-main mt-auto">
      <div class="footer-top py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <img src="assets/logo.svg" alt="Star EduCenter Logo" style="width:56px;height:56px;border-radius:12px;object-fit:contain;background:rgba(255,255,255,0.12);padding:3px;">
                <div>
                  <h5 class="mb-0 text-white fw-bold">Star EduCenter</h5>
                  <small class="text-light opacity-75">Learn Smart, Gain Confidence</small>
                </div>
              </div>
              <p class="text-light opacity-75 small">
                বাংলাদেশের ক্লাস ৬-১০ এর শিক্ষার্থীদের জন্য সর্বোত্তম ডিজিটাল শিক্ষা প্ল্যাটফর্ম।
                স্মার্টভাবে পড়ুন, আত্মবিশ্বাসী হন।
              </p>
              <div class="d-flex gap-3 mt-3">
                <a href="#" class="text-light opacity-75 fs-5 hover-link"><i class="bi bi-facebook"></i></a>
                <a href="#" class="text-light opacity-75 fs-5 hover-link"><i class="bi bi-youtube"></i></a>
                <a href="#" class="text-light opacity-75 fs-5 hover-link"><i class="bi bi-whatsapp"></i></a>
                <a href="#" class="text-light opacity-75 fs-5 hover-link"><i class="bi bi-telegram"></i></a>
              </div>
            </div>
            <div class="col-lg-2 col-6">
              <h6 class="text-warning fw-semibold mb-3">Quick Links</h6>
              <ul class="list-unstyled small">
                <li class="mb-2"><a routerLink="/" class="text-light opacity-75 text-decoration-none">Home</a></li>
                <li class="mb-2"><a routerLink="/subjects" class="text-light opacity-75 text-decoration-none">Subjects</a></li>
                <li class="mb-2"><a routerLink="/videos" class="text-light opacity-75 text-decoration-none">Videos</a></li>
                <li class="mb-2"><a routerLink="/mock-test" class="text-light opacity-75 text-decoration-none">Mock Tests</a></li>
                <li class="mb-2"><a routerLink="/pricing" class="text-light opacity-75 text-decoration-none">Pricing</a></li>
              </ul>
            </div>
            <div class="col-lg-2 col-6">
              <h6 class="text-warning fw-semibold mb-3">AI Tools</h6>
              <ul class="list-unstyled small">
                <li class="mb-2"><a routerLink="/ai-tutor" class="text-light opacity-75 text-decoration-none">AI Tutor</a></li>
                <li class="mb-2"><a routerLink="/ai-homework" class="text-light opacity-75 text-decoration-none">Homework Solver</a></li>
                <li class="mb-2"><a routerLink="/ai-study-plan" class="text-light opacity-75 text-decoration-none">Study Plan</a></li>
                <li class="mb-2"><a routerLink="/question-bank" class="text-light opacity-75 text-decoration-none">Question Bank</a></li>
                <li class="mb-2"><a routerLink="/analytics" class="text-light opacity-75 text-decoration-none">Analytics</a></li>
              </ul>
            </div>
            <div class="col-lg-4">
              <h6 class="text-warning fw-semibold mb-3">Demo Login Credentials</h6>
              <div class="demo-creds small">
                <div class="cred-item mb-2 p-2 rounded" style="background:rgba(255,255,255,0.08)">
                  <i class="bi bi-person-fill text-warning me-2"></i>
                  <strong class="text-white">Student:</strong>
                  <span class="text-light opacity-75 ms-1">student&#64;demo.com / demo123</span>
                </div>
                <div class="cred-item mb-2 p-2 rounded" style="background:rgba(255,255,255,0.08)">
                  <i class="bi bi-people-fill text-info me-2"></i>
                  <strong class="text-white">Parent:</strong>
                  <span class="text-light opacity-75 ms-1">parent&#64;demo.com / demo123</span>
                </div>
                <div class="cred-item mb-2 p-2 rounded" style="background:rgba(255,255,255,0.08)">
                  <i class="bi bi-person-workspace text-success me-2"></i>
                  <strong class="text-white">Teacher:</strong>
                  <span class="text-light opacity-75 ms-1">teacher&#64;demo.com / demo123</span>
                </div>
                <div class="cred-item p-2 rounded" style="background:rgba(255,255,255,0.08)">
                  <i class="bi bi-shield-fill text-danger me-2"></i>
                  <strong class="text-white">Admin:</strong>
                  <span class="text-light opacity-75 ms-1">admin&#64;demo.com / demo123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom py-3 border-top border-secondary">
        <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p class="text-light opacity-50 small mb-0">© 2025 Star EduCenter. All rights reserved. &nbsp;|&nbsp; 🇧🇩 Made with ❤️ in Bangladesh &nbsp;|&nbsp; <span class="text-warning opacity-100 fw-semibold">Designed & Built by Kamrul</span></p>
          <div class="d-flex gap-3 mt-2 mt-md-0">
            <a href="#" class="text-light opacity-50 small text-decoration-none">Privacy Policy</a>
            <a href="#" class="text-light opacity-50 small text-decoration-none">Terms of Use</a>
            <a href="#" class="text-light opacity-50 small text-decoration-none">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-main { background: #1d3557; }
    .hover-link:hover { color: #ffd700 !important; transition: color 0.2s; }
  `]
})
export class FooterComponent {}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-page d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="card border-0 shadow-lg auth-card">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <i class="bi bi-star-fill text-warning fs-2 mb-2"></i>
                  <h4 class="fw-bold">Create Your Account</h4>
                  <p class="text-muted small">EduCenter-এ যোগ দিন — বিনামূল্যে</p>
                </div>
                <form (ngSubmit)="onSignup()" #signupForm="ngForm">
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label fw-medium">Full Name</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text" class="form-control" [(ngModel)]="name" name="name" required placeholder="Your full name">
                      </div>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-medium">Email Address</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="your@email.com">
                      </div>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-medium">Phone (optional)</label>
                      <div class="input-group">
                        <span class="input-group-text">🇧🇩</span>
                        <input type="tel" class="form-control" [(ngModel)]="phone" name="phone" placeholder="+880 1X XXX XXXXX">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Role</label>
                      <select class="form-select" [(ngModel)]="role" name="role" required>
                        <option value="student">👨‍🎓 Student</option>
                        <option value="parent">👨‍👩‍👧 Parent</option>
                        <option value="teacher">👨‍🏫 Teacher</option>
                      </select>
                    </div>
                    <div class="col-md-6" *ngIf="role === 'student'">
                      <label class="form-label fw-medium">Class</label>
                      <select class="form-select" [(ngModel)]="selectedClass" name="class" required>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-medium">Password</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-lock"></i></span>
                        <input [type]="showPwd ? 'text' : 'password'" class="form-control" [(ngModel)]="password" name="password" required placeholder="Min 6 characters">
                        <button type="button" class="btn btn-outline-secondary" (click)="showPwd = !showPwd">
                          <i class="bi" [class]="showPwd ? 'bi-eye-slash' : 'bi-eye'"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="error" class="alert alert-danger small py-2 mt-3">
                    <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
                  </div>
                  <div *ngIf="success" class="alert alert-success small py-2 mt-3">
                    <i class="bi bi-check-circle me-1"></i>{{ success }}
                  </div>

                  <button type="submit" class="btn btn-primary w-100 fw-bold py-2 mt-4" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="bi bi-person-plus me-2"></i>
                    {{ loading ? 'Creating Account...' : 'Create Free Account' }}
                  </button>
                </form>

                <div class="text-center mt-4">
                  <p class="text-muted small">Already have an account? <a routerLink="/login" class="text-primary fw-semibold">Login</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: calc(100vh - 140px); background: linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%); }
    .auth-card { border-radius: 20px !important; }
  `]
})
export class SignupComponent {
  name = ''; email = ''; phone = ''; password = '';
  role: 'student' | 'parent' | 'teacher' = 'student';
  selectedClass = 9;
  error = ''; success = ''; loading = false; showPwd = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(): void {
    this.error = ''; this.success = '';
    if (!this.name || !this.email || !this.password) { this.error = 'Please fill all required fields.'; return; }
    if (this.password.length < 6) { this.error = 'Password must be at least 6 characters.'; return; }
    this.loading = true;
    setTimeout(() => {
      const result = this.auth.register({ name: this.name, email: this.email, password: this.password, role: this.role, class: this.role === 'student' ? Number(this.selectedClass) : undefined, phone: this.phone });
      this.loading = false;
      if (result.success) {
        this.success = result.message + ' Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      } else { this.error = result.message; }
    }, 800);
  }
}

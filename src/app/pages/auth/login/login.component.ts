import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-page d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-5">
            <div class="card border-0 shadow-lg auth-card">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <i class="bi bi-star-fill text-warning fs-2 mb-2"></i>
                  <h4 class="fw-bold">Welcome Back!</h4>
                  <p class="text-muted small">EduCenter-এ লগইন করুন</p>
                </div>

                <!-- Demo Credentials -->
                <div class="alert alert-info small py-2 mb-4">
                  <i class="bi bi-info-circle me-1"></i>
                  <strong>Demo:</strong> student&#64;demo.com / demo123
                </div>

                <form (ngSubmit)="onLogin()" #loginForm="ngForm">
                  <div class="mb-3">
                    <label class="form-label fw-medium">Email Address</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                      <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="your@email.com">
                    </div>
                  </div>
                  <div class="mb-4">
                    <label class="form-label fw-medium">Password</label>
                    <div class="input-group">
                      <span class="input-group-text"><i class="bi bi-lock"></i></span>
                      <input [type]="showPwd ? 'text' : 'password'" class="form-control" [(ngModel)]="password" name="password" required placeholder="••••••••">
                      <button type="button" class="btn btn-outline-secondary" (click)="showPwd = !showPwd">
                        <i class="bi" [class]="showPwd ? 'bi-eye-slash' : 'bi-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div *ngIf="error" class="alert alert-danger small py-2">
                    <i class="bi bi-exclamation-triangle me-1"></i>{{ error }}
                  </div>

                  <button type="submit" class="btn btn-primary w-100 fw-bold py-2 mb-3" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!loading" class="bi bi-box-arrow-in-right me-2"></i>
                    {{ loading ? 'Logging in...' : 'Login' }}
                  </button>
                </form>

                <!-- Demo Quick Login -->
                <div class="border-top pt-3 mt-3">
                  <p class="text-center text-muted small mb-2">Quick Demo Login:</p>
                  <div class="d-flex flex-wrap gap-2 justify-content-center">
                    <button class="btn btn-sm btn-outline-primary" (click)="quickLogin('student')">👨‍🎓 Student</button>
                    <button class="btn btn-sm btn-outline-info" (click)="quickLogin('parent')">👨‍👩‍👧 Parent</button>
                    <button class="btn btn-sm btn-outline-success" (click)="quickLogin('teacher')">👨‍🏫 Teacher</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="quickLogin('admin')">🛡️ Admin</button>
                  </div>
                </div>

                <div class="text-center mt-4">
                  <p class="text-muted small">New to EduCenter? <a routerLink="/signup" class="text-primary fw-semibold">Create Account</a></p>
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
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPwd = false;

  private demoAccounts: { [key: string]: { email: string; password: string } } = {
    student: { email: 'student@demo.com', password: 'demo123' },
    parent: { email: 'parent@demo.com', password: 'demo123' },
    teacher: { email: 'teacher@demo.com', password: 'demo123' },
    admin: { email: 'admin@demo.com', password: 'demo123' },
  };

  constructor(private auth: AuthService, private router: Router) {}

  quickLogin(role: string): void {
    const creds = this.demoAccounts[role];
    if (creds) { this.email = creds.email; this.password = creds.password; this.onLogin(); }
  }

  onLogin(): void {
    this.error = '';
    this.loading = true;
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.loading = false;
      if (result.success && result.user) {
        const routes: { [key: string]: string } = { student: '/dashboard', parent: '/parent', teacher: '/teacher', admin: '/admin' };
        this.router.navigate([routes[result.user.role] || '/dashboard']);
      } else {
        this.error = result.message;
      }
    }, 600);
  }
}

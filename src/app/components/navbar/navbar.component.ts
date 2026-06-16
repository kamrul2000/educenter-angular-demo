import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/">
          <img src="assets/logo.svg" alt="Star EduCenter Logo" class="brand-logo-img">
          <div>
            <span class="fw-bold fs-5">Star EduCenter</span>
            <small class="d-block lh-1" style="font-size:0.62rem; opacity:0.8">Learn Smart, Gain Confidence</small>
          </div>
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto ms-3" *ngIf="isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active"><i class="bi bi-speedometer2 me-1"></i>Dashboard</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-book me-1"></i>Learn
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" routerLink="/subjects"><i class="bi bi-grid me-2"></i>Subjects</a></li>
                <li><a class="dropdown-item" routerLink="/videos"><i class="bi bi-play-circle me-2"></i>Video Lessons</a></li>
                <li><a class="dropdown-item" routerLink="/pdf-downloads"><i class="bi bi-file-pdf me-2"></i>PDF Downloads</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-pencil-square me-1"></i>Practice
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" routerLink="/mcq"><i class="bi bi-check-circle me-2"></i>MCQ Practice</a></li>
                <li><a class="dropdown-item" routerLink="/cq"><i class="bi bi-journal-text me-2"></i>CQ Practice</a></li>
                <li><a class="dropdown-item" routerLink="/question-bank"><i class="bi bi-database me-2"></i>Question Bank</a></li>
                <li><a class="dropdown-item" routerLink="/mock-test"><i class="bi bi-clock me-2"></i>Mock Test</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-robot me-1"></i>AI Tools
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" routerLink="/ai-tutor"><i class="bi bi-chat-dots me-2"></i>AI Tutor</a></li>
                <li><a class="dropdown-item" routerLink="/ai-homework"><i class="bi bi-camera me-2"></i>Homework Solver</a></li>
                <li><a class="dropdown-item" routerLink="/ai-study-plan"><i class="bi bi-calendar-check me-2"></i>Study Plan</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/analytics"><i class="bi bi-bar-chart me-1"></i>Analytics</a>
            </li>
          </ul>

          <!-- Right side -->
          <div class="d-flex align-items-center gap-2">
            <ng-container *ngIf="!isLoggedIn">
              <a routerLink="/pricing" class="btn btn-outline-light btn-sm">Pricing</a>
              <a routerLink="/login" class="btn btn-warning btn-sm fw-semibold">Login</a>
              <a routerLink="/signup" class="btn btn-light btn-sm fw-semibold">Sign Up</a>
            </ng-container>
            <ng-container *ngIf="isLoggedIn && currentUser">
              <!-- Role-based links -->
              <a *ngIf="currentUser.role === 'parent'" routerLink="/parent" class="btn btn-outline-light btn-sm">Parent View</a>
              <a *ngIf="currentUser.role === 'teacher'" routerLink="/teacher" class="btn btn-outline-light btn-sm">Teacher Panel</a>
              <a *ngIf="currentUser.role === 'admin'" routerLink="/admin" class="btn btn-outline-light btn-sm">Admin</a>

              <!-- User dropdown -->
              <div class="dropdown">
                <button class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-1" type="button" data-bs-toggle="dropdown">
                  <i class="bi bi-person-circle fs-5"></i>
                  <span class="d-none d-md-inline">{{ currentUser.name.split(' ')[0] }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><h6 class="dropdown-header">{{ currentUser.name }}</h6></li>
                  <li><h6 class="dropdown-header text-muted small">{{ currentUser.email }}</h6></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" routerLink="/dashboard"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
                  <li><a class="dropdown-item" routerLink="/analytics"><i class="bi bi-bar-chart me-2"></i>My Progress</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item text-danger" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .brand-logo-img { width: 42px; height: 42px; border-radius: 10px; object-fit: contain; background: rgba(255,255,255,0.15); padding: 2px; }
    .nav-link.active { font-weight: 600; }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // React to auth state changes
    setInterval(() => {
      this.isLoggedIn = this.authService.isAuthenticated();
      this.currentUser = this.authService.getCurrentUser();
    }, 500);
  }

  logout(): void {
    this.authService.logout();
  }
}

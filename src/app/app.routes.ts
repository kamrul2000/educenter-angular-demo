import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },

  // Student routes (protected)
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/student/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'subjects', canActivate: [authGuard], loadComponent: () => import('./pages/student/subjects/subjects.component').then(m => m.SubjectsComponent) },
  { path: 'subjects/:id', canActivate: [authGuard], loadComponent: () => import('./pages/student/chapter-list/chapter-list.component').then(m => m.ChapterListComponent) },
  { path: 'subjects/:subjectId/chapters/:chapterId', canActivate: [authGuard], loadComponent: () => import('./pages/student/chapter-detail/chapter-detail.component').then(m => m.ChapterDetailComponent) },
  { path: 'videos', canActivate: [authGuard], loadComponent: () => import('./pages/student/video-lessons/video-lessons.component').then(m => m.VideoLessonsComponent) },
  { path: 'mcq', canActivate: [authGuard], loadComponent: () => import('./pages/student/mcq-practice/mcq-practice.component').then(m => m.McqPracticeComponent) },
  { path: 'cq', canActivate: [authGuard], loadComponent: () => import('./pages/student/cq-practice/cq-practice.component').then(m => m.CqPracticeComponent) },
  { path: 'question-bank', canActivate: [authGuard], loadComponent: () => import('./pages/student/question-bank/question-bank.component').then(m => m.QuestionBankComponent) },
  { path: 'pdf-downloads', canActivate: [authGuard], loadComponent: () => import('./pages/student/pdf-downloads/pdf-downloads.component').then(m => m.PdfDownloadsComponent) },
  { path: 'mock-test', canActivate: [authGuard], loadComponent: () => import('./pages/student/mock-test/mock-test.component').then(m => m.MockTestComponent) },
  { path: 'analytics', canActivate: [authGuard], loadComponent: () => import('./pages/student/analytics/analytics.component').then(m => m.AnalyticsComponent) },

  // AI features
  { path: 'ai-tutor', canActivate: [authGuard], loadComponent: () => import('./pages/ai/ai-tutor/ai-tutor.component').then(m => m.AiTutorComponent) },
  { path: 'ai-homework', canActivate: [authGuard], loadComponent: () => import('./pages/ai/ai-homework/ai-homework.component').then(m => m.AiHomeworkComponent) },
  { path: 'ai-study-plan', canActivate: [authGuard], loadComponent: () => import('./pages/ai/ai-study-plan/ai-study-plan.component').then(m => m.AiStudyPlanComponent) },

  // Parent, Teacher, Admin
  { path: 'parent', canActivate: [authGuard], loadComponent: () => import('./pages/parent/parent-dashboard/parent-dashboard.component').then(m => m.ParentDashboardComponent) },
  { path: 'teacher', canActivate: [authGuard], loadComponent: () => import('./pages/teacher/teacher-panel/teacher-panel.component').then(m => m.TeacherPanelComponent) },
  { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./pages/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent) },

  // Fallback
  { path: '**', redirectTo: '' }
];

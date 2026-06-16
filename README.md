# ⭐ EduCenter — Learn Smart, Gain Confidence

> Bangladesh's premier digital education platform for Class 6–10 students.  
> Built with **Angular 17** · **Bootstrap 5** · **TypeScript** · **localStorage**

![EduCenter Banner](https://via.placeholder.com/1200x400/1d3557/white?text=EduCenter+—+Learn+Smart,+Gain+Confidence)

---

## 📋 Project Overview

EduCenter is a **full-featured Angular prototype** of a Bangladesh-focused EdTech SaaS platform designed for students in Class 6 through Class 10. It covers every aspect of digital learning — from subject notes and video lessons to AI tutoring and mock exams — all running entirely in the browser using `localStorage` as the data store. No backend, no database, no paid APIs required.

---

## ✨ Features

### 🎓 Student Features
- Class selection (6–10) with subject filtering
- **14 Subjects**: Bangla, English, Math, Science, ICT, BGS, Religion, Physics, Chemistry, Biology, Accounting, Finance, Business
- Chapter overview with notes, key points, formulas, infographics, mind maps
- Video lessons with playback speed selector & resume progress (localStorage)
- MCQ Practice (Practice Mode + Exam Mode with timer)
- CQ / Creative Questions with model answers and mark distribution
- Question Bank with filters (class, subject, chapter, board, year)
- PDF Downloads (Notes, Formulas, Suggestions, Model Tests)
- Mock Test System with timer, auto-submit, leaderboard & ranking
- Performance Analytics Dashboard (charts, heatmap, accuracy, streaks)

### 🤖 AI Features (Frontend Demo)
- **AI Tutor** — Chatbot with condition-based Bangla/English replies
- **Homework Solver** — Image upload preview + simulated solutions
- **Study Plan Generator** — Personalized weekly timetable from exam date & weak subjects

### 👨‍👩‍👧 Parent Dashboard
- Study hours tracking, attendance, scores, weak subjects
- WhatsApp/SMS alert preview toggle

### 👨‍🏫 Teacher Panel
- Upload notes, create exams, schedule live classes
- Student attendance management
- Recordings and submission tracking

### 🛡️ Admin Panel
- Manage subjects, chapters, students, teachers, question bank
- Analytics: revenue, user growth, activity log, course completion
- Reset demo data button

### 💰 Pricing
- **Free** — Limited notes & MCQs
- **Basic ৳99/month** — All notes, videos, analytics
- **Premium ৳199/month** — AI tools, mock tests, live class
- **Annual ৳999/year** — Everything + parent dashboard

---

## 🗂️ Angular Folder Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component
│   ├── app.config.ts             # App providers
│   ├── app.routes.ts             # All routes (lazy-loaded)
│   │
│   ├── models/                   # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── subject.model.ts
│   │   ├── quiz.model.ts
│   │   ├── progress.model.ts
│   │   └── pricing.model.ts
│   │
│   ├── services/                 # Injectable services
│   │   ├── auth.service.ts
│   │   ├── local-storage.service.ts
│   │   ├── demo-data.service.ts
│   │   ├── quiz.service.ts
│   │   ├── progress.service.ts
│   │   └── ai-demo.service.ts
│   │
│   ├── guards/
│   │   └── auth.guard.ts         # Route protection
│   │
│   ├── components/               # Reusable UI components
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── stat-card/
│   │   ├── subject-card/
│   │   ├── pricing-card/
│   │   └── dashboard-layout/
│   │
│   └── pages/                    # Feature pages (lazy-loaded)
│       ├── landing/
│       ├── auth/login/ & signup/
│       ├── pricing/
│       ├── student/
│       │   ├── dashboard/
│       │   ├── subjects/
│       │   ├── chapter-list/
│       │   ├── chapter-detail/
│       │   ├── video-lessons/
│       │   ├── mcq-practice/
│       │   ├── cq-practice/
│       │   ├── question-bank/
│       │   ├── pdf-downloads/
│       │   ├── mock-test/
│       │   └── analytics/
│       ├── ai/
│       │   ├── ai-tutor/
│       │   ├── ai-homework/
│       │   └── ai-study-plan/
│       ├── parent/parent-dashboard/
│       ├── teacher/teacher-panel/
│       └── admin/admin-panel/
│
├── styles.scss                   # Global styles
└── index.html                    # Bootstrap CDN + Icons CDN
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Angular CLI 17+

### Install Dependencies

```bash
npm install -g @angular/cli
npm install
```

### Run Locally

```bash
ng serve
# Open http://localhost:4200
```

### Build for Production

```bash
ng build --configuration production
```

---

## 🌐 Deploy to GitHub Pages

1. Create a GitHub repository named `educenter-angular-demo`
2. Push the project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EduCenter Angular"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/educenter-angular-demo.git
   git push -u origin main
   ```
3. Install deployment tool:
   ```bash
   npm install -g angular-cli-ghpages
   ```
4. Build & Deploy:
   ```bash
   ng build --configuration production --base-href /educenter-angular-demo/
   npx angular-cli-ghpages --dir=dist/educenter/browser
   ```
5. Go to `https://YOUR_USERNAME.github.io/educenter-angular-demo/`

---

## 🔑 Demo Login Credentials

| Role    | Email                  | Password | Dashboard Route  |
|---------|------------------------|----------|-----------------|
| Student | student@demo.com       | demo123  | /dashboard       |
| Parent  | parent@demo.com        | demo123  | /parent          |
| Teacher | teacher@demo.com       | demo123  | /teacher         |
| Admin   | admin@demo.com         | demo123  | /admin           |

> Click the **Quick Demo Login** buttons on the login page for instant access!

---

## 💾 localStorage Keys

All data is stored with the `educenter_` prefix:

| Key | Description |
|-----|-------------|
| `educenter_auth_state` | Current login session |
| `educenter_users` | Registered user list |
| `educenter_quiz_results` | MCQ & mock test scores |
| `educenter_progress_<userId>` | Study progress per user |
| `educenter_streak_<userId>` | Study streak data |
| `educenter_video_progress` | Video watch progress |
| `educenter_teacher_notes` | Teacher uploaded notes |
| `educenter_teacher_exams` | Teacher created exams |
| `educenter_teacher_live` | Scheduled live classes |

Use the **"Reset Demo Data"** button in Dashboard or Admin panel to clear all data.

---

## 🛣️ Route Map

| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/login` | Login |
| `/signup` | Sign Up |
| `/pricing` | Pricing Plans |
| `/dashboard` | Student Dashboard |
| `/subjects` | Subject List |
| `/subjects/:id` | Chapter List |
| `/subjects/:sid/chapters/:cid` | Chapter Detail |
| `/videos` | Video Lessons |
| `/mcq` | MCQ Practice |
| `/cq` | CQ Practice |
| `/question-bank` | Question Bank |
| `/pdf-downloads` | PDF Downloads |
| `/mock-test` | Mock Tests |
| `/analytics` | Performance Analytics |
| `/ai-tutor` | AI Tutor Chat |
| `/ai-homework` | Homework Solver |
| `/ai-study-plan` | Study Plan Generator |
| `/parent` | Parent Dashboard |
| `/teacher` | Teacher Panel |
| `/admin` | Admin Panel |

---

## 🔮 Future Improvement Ideas

- [ ] Firebase Firestore for real-time data sync
- [ ] PWA (Installable as mobile app)
- [ ] Real AI integration (Google Gemini / Claude API)
- [ ] Bangla OCR for homework image recognition
- [ ] Video streaming with custom player
- [ ] Live class with WebRTC
- [ ] Push notifications for study reminders
- [ ] Multi-language: Bangla + English toggle
- [ ] Teacher live grading & feedback
- [ ] SSC/JSC board exam countdown widget
- [ ] Gamification: badges, XP, leaderboard
- [ ] Offline mode with Service Worker
- [ ] Payment integration (bKash, Nagad, SSLCommerz)
- [ ] School management integration
- [ ] Parent-Teacher messaging system

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#1d3557` (Deep Blue) |
| Secondary | `#457b9d` |
| Success | `#2d6a4f` (Green) |
| Warning | `#f4a261` (Orange) |
| Danger | `#e63946` (Red) |
| Font | Inter + Hind Siliguri |
| Border Radius | 16px (cards), 20px (pill buttons) |
| Shadow | `0 4px 20px rgba(0,0,0,0.08)` |

---

## 📄 License

MIT License — Free to use, modify, and distribute for educational purposes.

---

**Made with ❤️ in Bangladesh 🇧🇩 | EduCenter — Learn Smart, Gain Confidence**

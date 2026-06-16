import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiDemoService, ChatMessage } from '../../../services/ai-demo.service';

@Component({
  selector: 'app-ai-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-tutor-page py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="chat-container card border-0 shadow-lg" style="border-radius:20px; overflow:hidden">

              <!-- Chat Header -->
              <div class="chat-header p-4 text-white" style="background: linear-gradient(135deg, #1d3557, #457b9d)">
                <div class="d-flex align-items-center gap-3">
                  <div class="ai-avatar">
                    <i class="bi bi-robot fs-3"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-0">EduCenter AI Tutor</h5>
                    <small class="opacity-75">
                      <span class="status-dot"></span>
                      Online — Ask me anything in Bangla or English!
                    </small>
                  </div>
                  <div class="ms-auto badge bg-warning text-dark">Demo Mode</div>
                </div>
                <!-- Suggested topics -->
                <div class="d-flex gap-2 flex-wrap mt-3">
                  <button *ngFor="let topic of suggestedTopics" class="btn btn-sm btn-outline-light rounded-pill" (click)="askTopic(topic)">
                    {{ topic }}
                  </button>
                </div>
              </div>

              <!-- Chat Messages -->
              <div class="chat-messages p-4" #chatBox style="height:450px; overflow-y:auto; background:#f8f9fa">
                <div *ngFor="let msg of messages" class="message-row mb-3" [class.user-row]="msg.role === 'user'" [class.ai-row]="msg.role === 'ai'">
                  <div class="d-flex align-items-end gap-2" [class.flex-row-reverse]="msg.role === 'user'">
                    <div class="msg-avatar flex-shrink-0" [class.user-avatar]="msg.role === 'user'" [class.ai-avatar-sm]="msg.role === 'ai'">
                      <i class="bi" [class]="msg.role === 'user' ? 'bi-person-fill' : 'bi-robot'"></i>
                    </div>
                    <div class="message-bubble" [class.user-bubble]="msg.role === 'user'" [class.ai-bubble]="msg.role === 'ai'">
                      <div [innerHTML]="formatMessage(msg.content)" class="message-content"></div>
                      <small class="opacity-50 d-block mt-1" style="font-size:0.65rem">{{ formatTime(msg.timestamp) }}</small>
                    </div>
                  </div>
                </div>

                <!-- Typing indicator -->
                <div *ngIf="isTyping" class="message-row ai-row mb-3">
                  <div class="d-flex align-items-end gap-2">
                    <div class="msg-avatar ai-avatar-sm"><i class="bi bi-robot"></i></div>
                    <div class="message-bubble ai-bubble">
                      <div class="typing-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Chat Input -->
              <div class="chat-input-area p-3 bg-white border-top">
                <div class="d-flex gap-2">
                  <input type="text" class="form-control rounded-pill" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" placeholder="Ask anything... (e.g. 'Pythagorean theorem কি?')" [disabled]="isTyping">
                  <button class="btn btn-primary rounded-circle send-btn flex-shrink-0" (click)="sendMessage()" [disabled]="!userInput.trim() || isTyping">
                    <i class="bi bi-send-fill"></i>
                  </button>
                </div>
                <div class="d-flex gap-2 mt-2 flex-wrap">
                  <button *ngFor="let quick of quickReplies" class="btn btn-sm btn-outline-secondary rounded-pill" (click)="quickAsk(quick)">{{ quick }}</button>
                </div>
              </div>
            </div>

            <!-- Info Card -->
            <div class="card border-0 shadow-sm mt-4" style="border-radius:16px">
              <div class="card-body p-4">
                <h6 class="fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i>How to use AI Tutor</h6>
                <div class="row g-3">
                  <div class="col-md-4 text-center" *ngFor="let tip of tips">
                    <div class="tip-icon mb-2">{{ tip.icon }}</div>
                    <h6 class="small fw-bold">{{ tip.title }}</h6>
                    <p class="text-muted small mb-0">{{ tip.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-avatar { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .status-dot { display: inline-block; width: 8px; height: 8px; background: #4caf50; border-radius: 50%; margin-right: 5px; }
    .msg-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
    .user-avatar { background: #1d3557; color: white; }
    .ai-avatar-sm { background: #e8f4fd; color: #1d3557; }
    .message-bubble { max-width: 75%; padding: 10px 14px; border-radius: 18px; }
    .user-bubble { background: #1d3557; color: white; border-bottom-right-radius: 4px; }
    .ai-bubble { background: white; color: #333; border: 1px solid #e9ecef; border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .message-content { white-space: pre-line; line-height: 1.5; }
    .typing-dots { display: flex; gap: 4px; padding: 4px 0; }
    .typing-dots span { width: 8px; height: 8px; background: #aaa; border-radius: 50%; animation: bounce 1s infinite; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
    .send-btn { width: 44px; height: 44px; }
    .tip-icon { font-size: 2rem; }
  `]
})
export class AiTutorComponent implements AfterViewChecked {
  @ViewChild('chatBox') chatBox!: ElementRef;
  messages: ChatMessage[] = [];
  userInput = '';
  isTyping = false;

  suggestedTopics = ['Pythagorean Theorem', 'Polynomial সূত্র', 'Newton\'s Laws', 'Cell Biology', 'English Tense'];
  quickReplies = ['আরও বুঝিয়ে দাও', 'উদাহরণ দাও', 'সূত্র কী?', 'সহজ ভাষায় বলো'];

  tips = [
    { icon: '🇧🇩', title: 'Bangla Support', desc: 'বাংলায় প্রশ্ন করুন — AI বাংলায় উত্তর দেবে' },
    { icon: '📚', title: 'All Subjects', desc: 'Math, Science, English, Physics — all supported' },
    { icon: '⚡', title: 'Instant Reply', desc: 'তাৎক্ষণিক ব্যাখ্যা ও উদাহরণ পান' },
  ];

  constructor(private aiService: AiDemoService) {
    this.addAIMessage('হ্যালো! আমি EduCenter AI Tutor। 👋\n\nআপনি বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন — Math, Science, English, Physics সব বিষয়ে সাহায্য করতে পারি!\n\nকী জানতে চান?');
  }

  ngAfterViewChecked(): void {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;
    const msg = this.userInput.trim();
    this.addUserMessage(msg);
    this.userInput = '';
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.addAIMessage(this.aiService.getTutorResponse(msg));
    }, 900 + Math.random() * 600);
  }

  askTopic(topic: string): void {
    this.userInput = topic;
    this.sendMessage();
  }

  quickAsk(text: string): void {
    this.userInput = text;
    this.sendMessage();
  }

  private addUserMessage(content: string): void {
    this.messages.push({ role: 'user', content, timestamp: new Date() });
  }

  private addAIMessage(content: string): void {
    this.messages.push({ role: 'ai', content, timestamp: new Date() });
  }

  formatMessage(content: string): string {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

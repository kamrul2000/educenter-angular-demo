import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, AuthState } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private authState = signal<AuthState>({
    isLoggedIn: false,
    currentUser: null,
    token: null
  });

  isLoggedIn = this.authState.asReadonly();

  constructor(private ls: LocalStorageService, private router: Router) {
    this.loadSession();
  }

  private loadSession(): void {
    const saved = this.ls.get<AuthState>('auth_state');
    if (saved?.isLoggedIn && saved.currentUser) {
      this.authState.set(saved);
    }
  }

  register(userData: Omit<User, 'id' | 'joinDate' | 'isActive'>): { success: boolean; message: string } {
    const users = this.ls.get<User[]>('users') || [];
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now(),
      joinDate: new Date().toISOString(),
      isActive: true
    };
    users.push(newUser);
    this.ls.set('users', users);
    return { success: true, message: 'Registration successful!' };
  }

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.ls.get<User[]>('users') || [];
    // Check demo accounts first
    const demoUser = this.getDemoUser(email, password);
    if (demoUser) {
      this.setSession(demoUser);
      return { success: true, message: 'Login successful!', user: demoUser };
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.setSession(user);
    return { success: true, message: 'Login successful!', user };
  }

  private getDemoUser(email: string, password: string): User | null {
    const demoAccounts: User[] = [
      { id: 'demo_student', name: 'Rahim (Student)', email: 'student@demo.com', password: 'demo123', role: 'student', class: 9, joinDate: '2024-01-01', isActive: true },
      { id: 'demo_parent', name: 'Mr. Karim (Parent)', email: 'parent@demo.com', password: 'demo123', role: 'parent', joinDate: '2024-01-01', isActive: true },
      { id: 'demo_teacher', name: 'Ms. Fatema (Teacher)', email: 'teacher@demo.com', password: 'demo123', role: 'teacher', joinDate: '2024-01-01', isActive: true },
      { id: 'demo_admin', name: 'Admin User', email: 'admin@demo.com', password: 'demo123', role: 'admin', joinDate: '2024-01-01', isActive: true },
    ];
    return demoAccounts.find(u => u.email === email && u.password === password) || null;
  }

  private setSession(user: User): void {
    const state: AuthState = { isLoggedIn: true, currentUser: user, token: 'demo_token_' + user.id };
    this.authState.set(state);
    this.ls.set('auth_state', state);
  }

  logout(): void {
    this.authState.set({ isLoggedIn: false, currentUser: null, token: null });
    this.ls.remove('auth_state');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.authState().currentUser;
  }

  isAuthenticated(): boolean {
    return this.authState().isLoggedIn;
  }

  updateUserClass(classNum: number): void {
    const state = this.authState();
    if (state.currentUser) {
      const updated: User = { ...state.currentUser, class: classNum };
      const newState: AuthState = { ...state, currentUser: updated };
      this.authState.set(newState);
      this.ls.set('auth_state', newState);
      // Also update in users list
      const users = this.ls.get<User[]>('users') || [];
      const idx = users.findIndex(u => u.id === updated.id);
      if (idx > -1) { users[idx] = updated; this.ls.set('users', users); }
    }
  }
}

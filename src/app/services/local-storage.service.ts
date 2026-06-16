import { Injectable } from '@angular/core';

/** Central service for all localStorage read/write operations */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private prefix = 'educenter_';

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage set error:', e);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) as T : null;
    } catch (e) {
      console.error('LocalStorage get error:', e);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /** Reset all EduCenter data from localStorage */
  resetAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  exists(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }
}

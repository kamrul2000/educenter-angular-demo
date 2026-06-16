export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed/plain for demo
  role: 'student' | 'parent' | 'teacher' | 'admin';
  class?: number; // 6–10 for students
  avatar?: string;
  phone?: string;
  joinDate: string;
  isActive: boolean;
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  token: string | null;
}

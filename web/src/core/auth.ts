import { create } from 'zustand';
import * as api from './api';

interface AuthState {
  user: string | null;
  signedIn: boolean;
  signIn: (u: string, p: string) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>(set => ({
  user: api.getUser(),
  signedIn: !!api.getToken(),
  async signIn(u, p) { await api.login(u, p); set({ user: api.getUser(), signedIn: true }); },
  signOut() { api.clearSession(); try { localStorage.removeItem('pid'); } catch { /* bị chặn */ } set({ user: null, signedIn: false }); },
}));

// Phiên hết hạn (code 10002) → tự đăng xuất.
api.setOnSessionExpired(() => useAuth.getState().signOut());

import { create } from 'zustand';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });

    try {
      // Mock login - in real implementation this would call API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        role: 'super_admin',
        firstName: 'Admin',
        lastName: 'User',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

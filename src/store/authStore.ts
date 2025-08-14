import { create } from 'zustand';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'member';
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      // Simulate API call with mock data for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data based on email
      let mockUser: User;

      if (email === 'admin@demo.com' && password === 'password123') {
        mockUser = {
          id: 'admin-1',
          email: 'admin@demo.com',
          role: 'super_admin',
          firstName: 'Admin',
          lastName: 'User',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email === 'manager@demo.com' && password === 'password123') {
        mockUser = {
          id: 'manager-1',
          email: 'manager@demo.com',
          role: 'facility_manager',
          firstName: 'Manager',
          lastName: 'User',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email === 'customer@demo.com' && password === 'password123') {
        mockUser = {
          id: 'customer-1',
          email: 'customer@demo.com',
          role: 'member',
          firstName: 'Customer',
          lastName: 'User',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        set({ isLoading: false });
        return { success: false, error: 'Invalid email or password' };
      }

      // Store mock token
      localStorage.setItem('authToken', 'mock-token-' + mockUser.id);

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };

      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   set({ isLoading: false });
      //   return { success: false, error: data.error || 'Login failed' };
      // }

      // localStorage.setItem('authToken', data.token);

      // set({
      //   user: data.user,
      //   isAuthenticated: true,
      //   isLoading: false
      // });

      // return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true });

    try {
      // Call the API for registration
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        set({ isLoading: false });
        return { success: false, error: result.error || 'Registration failed' };
      }

      // Store the token and user data
      localStorage.setItem('authToken', result.token);

      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
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

  checkAuth: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    set({ isLoading: true });

    try {
      // Mock auth check based on stored token
      if (token.startsWith('mock-token-')) {
        const userId = token.replace('mock-token-', '');
        let mockUser: User;

        switch (userId) {
          case 'admin-1':
            mockUser = {
              id: 'admin-1',
              email: 'admin@demo.com',
              role: 'super_admin',
              firstName: 'Admin',
              lastName: 'User',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            break;
          case 'manager-1':
            mockUser = {
              id: 'manager-1',
              email: 'manager@demo.com',
              role: 'facility_manager',
              firstName: 'Manager',
              lastName: 'User',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            break;
          case 'customer-1':
            mockUser = {
              id: 'customer-1',
              email: 'customer@demo.com',
              role: 'member',
              firstName: 'Customer',
              lastName: 'User',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            break;
          default:
            localStorage.removeItem('authToken');
            set({ isLoading: false });
            return;
        }

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        localStorage.removeItem('authToken');
        set({ isLoading: false });
      }

      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/auth/me', {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      // if (!response.ok) {
      //   localStorage.removeItem('authToken');
      //   return;
      // }

      // const data = await response.json();
      // set({
      //   user: data.user,
      //   isAuthenticated: true,
      //   isLoading: false
      // });
    } catch (error) {
      localStorage.removeItem('authToken');
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        set({ isLoading: false });
        return { success: false, error: result.error || 'Profile update failed' };
      }

      set({
        user: result.user,
        isLoading: false
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  },
}));

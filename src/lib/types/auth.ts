export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'facility_manager' | 'member';
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

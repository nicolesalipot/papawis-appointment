import { create } from 'zustand';
import { User, UserFilters, UserFormData, UserInvitation, UserStats, PaginationInfo } from '@/lib/types/user';

interface UserStore {
  // State
  users: User[];
  selectedUser: User | null;
  filters: UserFilters;
  pagination: PaginationInfo;
  stats: UserStats | null;
  invitations: UserInvitation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setPagination: (pagination: Partial<PaginationInfo>) => void;
  setStats: (stats: UserStats) => void;
  setInvitations: (invitations: UserInvitation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD Operations
  fetchUsers: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchInvitations: () => Promise<void>;
  createUser: (data: UserFormData) => Promise<User>;
  updateUser: (id: string, data: Partial<UserFormData>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => Promise<User>;

  // User Management Operations
  activateUser: (id: string) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string) => Promise<void>;
  bulkUpdateUsers: (userIds: string[], updates: Partial<User>) => Promise<void>;

  // Invitation Operations
  inviteUser: (email: string, role: string, assignedFacilities?: string[]) => Promise<UserInvitation>;
  cancelInvitation: (id: string) => Promise<void>;
  resendInvitation: (id: string) => Promise<void>;

  // Utility actions
  clearFilters: () => void;
  resetState: () => void;
}

const defaultFilters: UserFilters = {
  search: '',
  role: 'all',
  status: 'all',
  facility: '',
  membershipTier: 'all',
};

const defaultPagination: PaginationInfo = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  users: [],
  selectedUser: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  stats: null,
  invitations: [],
  isLoading: false,
  error: null,

  // Basic setters
  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    })),
  setPagination: (newPagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...newPagination } })),
  setStats: (stats) => set({ stats }),
  setInvitations: (invitations) => set({ invitations }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // CRUD Operations
  fetchUsers: async () => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role && filters.role !== 'all' && { role: filters.role }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.facility && { facility: filters.facility }),
        ...(filters.membershipTier && filters.membershipTier !== 'all' && { membershipTier: filters.membershipTier }),
      });

      const response = await fetch(`/api/users?${params}`);

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      set({
        users: data.users,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchUserStats: async () => {
    try {
      const response = await fetch('/api/users/stats');
      const stats = await response.json();

      if (!response.ok) {
        throw new Error(stats.error || 'Failed to fetch user stats');
      }

      set({ stats });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  },

  fetchInvitations: async () => {
    try {
      const response = await fetch('/api/invitations');
      const invitations = await response.json();

      if (!response.ok) {
        throw new Error(invitations.error || 'Failed to fetch invitations');
      }

      set({ invitations });
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const user = await response.json();

      if (!response.ok) {
        throw new Error(user.error || 'Failed to create user');
      }

      // Optimistic update
      set((state) => ({
        users: [user, ...state.users],
        isLoading: false,
      }));

      return user;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.error || 'Failed to update user');
      }

      // Update in state
      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? updatedUser : u
        ),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        isLoading: false,
      }));

      return updatedUser;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Remove from state
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/users/${id}`);
      const user = await response.json();

      if (!response.ok) {
        throw new Error(user.error || 'Failed to fetch user');
      }

      set({ selectedUser: user, isLoading: false });
      return user;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  // User Management Operations
  activateUser: async (id) => {
    await get().updateUser(id, { status: 'active' });
  },

  deactivateUser: async (id) => {
    await get().updateUser(id, { status: 'inactive' });
  },

  suspendUser: async (id) => {
    await get().updateUser(id, { status: 'suspended' });
  },

  resetUserPassword: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/users/${id}/reset-password`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  bulkUpdateUsers: async (userIds, updates) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/users/bulk-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update users');
      }

      // Refresh users list
      await get().fetchUsers();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  // Invitation Operations
  inviteUser: async (email, role, assignedFacilities) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, assignedFacilities }),
      });

      const invitation = await response.json();

      if (!response.ok) {
        throw new Error(invitation.error || 'Failed to send invitation');
      }

      // Update invitations list
      set((state) => ({
        invitations: [invitation, ...state.invitations],
        isLoading: false,
      }));

      return invitation;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelInvitation: async (id) => {
    try {
      const response = await fetch(`/api/invitations/${id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel invitation');
      }

      // Update invitation status
      set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.id === id ? { ...inv, status: 'cancelled' as const } : inv
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },

  resendInvitation: async (id) => {
    try {
      const response = await fetch(`/api/invitations/${id}/resend`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resend invitation');
      }

      const updatedInvitation = await response.json();

      // Update invitation
      set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.id === id ? updatedInvitation : inv
        ),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  },

  // Utility actions
  clearFilters: () => set({ filters: defaultFilters }),
  resetState: () => set({
    users: [],
    selectedUser: null,
    filters: defaultFilters,
    pagination: defaultPagination,
    stats: null,
    invitations: [],
    isLoading: false,
    error: null,
  }),
}));

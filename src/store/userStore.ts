import { create } from 'zustand';
import { User, UserFilters, UserFormData, UserInvitation, UserStats, PaginationInfo } from '../lib/types/user';

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
  updateUser: (id: string, data: Partial<UserFormData> | Partial<User>) => Promise<User>;
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

// Sample user data generator
const getSampleUsers = (): User[] => [
  // Super Admins
  {
    id: 'user-001',
    email: 'admin@facility.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 000-0001',
    dateOfBirth: '1985-03-15',
    address: '123 Admin Street, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'user-001',
    permissions: ['*'],
  },
  {
    id: 'user-002',
    email: 'sarah.admin@facility.com',
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9349186?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 000-0002',
    dateOfBirth: '1980-07-22',
    address: '456 Management Ave, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-002',
    permissions: ['*'],
  },
  // Facility Managers
  {
    id: 'user-003',
    email: 'john.manager@facility.com',
    firstName: 'John',
    lastName: 'Manager',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 111-0001',
    dateOfBirth: '1988-11-03',
    address: '789 Facility Road, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-003',
    assignedFacilities: ['facility-1', 'facility-2'],
    permissions: ['facilities.manage', 'bookings.manage', 'users.view'],
  },
  {
    id: 'user-004',
    email: 'emily.sports@facility.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 111-0002',
    dateOfBirth: '1992-05-18',
    address: '321 Sports Complex Dr, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-15T14:20:00Z',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-004',
    assignedFacilities: ['facility-3', 'facility-4'],
    permissions: ['facilities.manage', 'bookings.manage', 'users.view'],
  },
  {
    id: 'user-005',
    email: 'mike.events@facility.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'facility_manager',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 111-0003',
    dateOfBirth: '1987-09-12',
    address: '654 Event Plaza, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-01T11:45:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-002',
    assignedFacilities: ['facility-5'],
    permissions: ['facilities.manage', 'bookings.manage', 'users.view'],
  },
  // Members - Active Users
  {
    id: 'customer-001',
    email: 'john.smith@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-06-15',
    address: '123 Member Street, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-15T16:30:00Z',
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-003',
    updatedBy: 'customer-001',
    membershipTier: 'premium',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-002',
    email: 'sarah.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1993-04-22',
    address: '456 Fitness Ave, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-04-01T09:15:00Z',
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-003',
    updatedBy: 'customer-002',
    membershipTier: 'premium',
    emergencyContact: 'Jane Johnson - +1 (555) 234-5679',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-003',
    email: 'michael.brown@example.com',
    firstName: 'Michael',
    lastName: 'Brown',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1985-12-08',
    address: '789 Business Blvd, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-04-10T13:20:00Z',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-003',
    membershipTier: 'basic',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-004',
    email: 'emma.davis@example.com',
    firstName: 'Emma',
    lastName: 'Davis',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1991-08-30',
    address: '321 Swimming Lane, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-04-20T11:45:00Z',
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-004',
    membershipTier: 'basic',
    emergencyContact: 'Robert Davis - +1 (555) 456-7891',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-005',
    email: 'robert.wilson@example.com',
    firstName: 'Robert',
    lastName: 'Wilson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '1982-02-14',
    address: '654 Tennis Court Dr, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-05-01T15:30:00Z',
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-005',
    membershipTier: 'vip',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  // More Members with Different Statuses
  {
    id: 'customer-006',
    email: 'lisa.martinez@example.com',
    firstName: 'Lisa',
    lastName: 'Martinez',
    role: 'member',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 678-9012',
    dateOfBirth: '1989-10-25',
    address: '987 Auditorium St, City, State 12345',
    emailVerified: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'customer-006',
    updatedBy: 'customer-006',
    membershipTier: 'basic',
    permissions: ['profile.manage'],
  },
  {
    id: 'customer-007',
    email: 'david.lee@example.com',
    firstName: 'David',
    lastName: 'Lee',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 789-0123',
    dateOfBirth: '1994-07-12',
    address: '147 HIIT Street, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-05-15T12:15:00Z',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-007',
    membershipTier: 'premium',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-008',
    email: 'jennifer.taylor@example.com',
    firstName: 'Jennifer',
    lastName: 'Taylor',
    role: 'member',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 890-1234',
    dateOfBirth: '1986-01-19',
    address: '258 Board Room Ave, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-03-20T08:45:00Z',
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-003',
    updatedBy: 'user-002',
    membershipTier: 'vip',
    permissions: [],
  },
  {
    id: 'customer-009',
    email: 'carlos.rodriguez@example.com',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 901-2345',
    dateOfBirth: '1975-11-03',
    address: '369 Aqua Lane, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-02-28T14:20:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-009',
    membershipTier: 'basic',
    emergencyContact: 'Maria Rodriguez - +1 (555) 901-2346',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-010',
    email: 'amanda.white@example.com',
    firstName: 'Amanda',
    lastName: 'White',
    role: 'member',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 012-3456',
    dateOfBirth: '1983-05-27',
    address: '741 Tennis Academy Rd, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'user-004',
    membershipTier: 'premium',
    permissions: ['profile.manage'],
  },
  // Additional Recent Members
  {
    id: 'customer-011',
    email: 'kevin.park@example.com',
    firstName: 'Kevin',
    lastName: 'Park',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 123-0987',
    dateOfBirth: '1996-03-08',
    address: '852 Dance Studio St, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-06-01T17:30:00Z',
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-003',
    updatedBy: 'customer-011',
    membershipTier: 'basic',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-012',
    email: 'alex.thompson@example.com',
    firstName: 'Alex',
    lastName: 'Thompson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 234-0987',
    dateOfBirth: '1987-09-14',
    address: '963 Strategy Blvd, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: '2024-06-10T09:45:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-003',
    updatedBy: 'customer-012',
    membershipTier: 'vip',
    emergencyContact: 'Jordan Thompson - +1 (555) 234-0988',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  {
    id: 'customer-013',
    email: 'maria.gonzalez@example.com',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 345-0987',
    dateOfBirth: '1992-12-02',
    address: '159 Pilates Plaza, City, State 12345',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    createdAt: '2024-06-15T13:00:00Z',
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-004',
    updatedBy: 'customer-013',
    membershipTier: 'premium',
    permissions: ['bookings.create', 'bookings.manage_own', 'profile.manage'],
  },
  // Maintenance and Service Accounts
  {
    id: 'maintenance-001',
    email: 'maintenance@facility.com',
    firstName: 'Maintenance',
    lastName: 'Team',
    role: 'member',
    status: 'active',
    phone: '+1 (555) 000-1000',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-001',
    membershipTier: 'basic',
    permissions: ['bookings.create', 'facilities.access'],
  },
  {
    id: 'admin-001',
    email: 'facilities@facility.com',
    firstName: 'Facility',
    lastName: 'Admin',
    role: 'facility_manager',
    status: 'active',
    phone: '+1 (555) 000-2000',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-001',
    assignedFacilities: ['facility-1', 'facility-2', 'facility-3', 'facility-4', 'facility-5'],
    permissions: ['facilities.manage', 'bookings.manage', 'maintenance.schedule'],
  }
];

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
      // Generate sample user data for demonstration
      const sampleUsers = getSampleUsers();

      // Apply filters
      let filteredUsers = sampleUsers.filter(user => {
        const searchMatch = !filters.search ||
          user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.phone?.toLowerCase().includes(filters.search.toLowerCase());

        const roleMatch = !filters.role || filters.role === 'all' || user.role === filters.role;
        const statusMatch = !filters.status || filters.status === 'all' || user.status === filters.status;
        const membershipMatch = !filters.membershipTier ||
          filters.membershipTier === 'all' ||
          user.membershipTier === filters.membershipTier ||
          (user.role !== 'member'); // Non-members always match membership filter

        const facilityMatch = !filters.facility ||
          (user.assignedFacilities?.includes(filters.facility)) ||
          (user.role === 'member'); // Members don't have assigned facilities, so they match all facility filters

        return searchMatch && roleMatch && statusMatch && membershipMatch && facilityMatch;
      });

      // Sort by creation date (newest first)
      filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pagination.pageSize);
      const paginationInfo = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / pagination.pageSize),
      };

      // Simulate loading delay
      setTimeout(() => {
        set({
          users: paginatedUsers,
          pagination: paginationInfo,
          isLoading: false,
        });
      }, 300);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchUserStats: async () => {
    try {
      // Generate sample user stats for demonstration
      const sampleStats: UserStats = {
        total: 17,
        active: 12,
        inactive: 2,
        pending: 1,
        byRole: {
          super_admin: 2,
          facility_manager: 4,
          member: 11,
        },
        recentSignups: 5, // Last 30 days
        activeToday: 8,
      };

      // Simulate loading delay
      setTimeout(() => {
        set({ stats: sampleStats });
      }, 200);
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

  updateUser: async (id, data: Partial<UserFormData> | Partial<User>) => {
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

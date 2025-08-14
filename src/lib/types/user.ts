export type UserRole = 'super_admin' | 'facility_manager' | 'member';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;

  // Profile information
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;

  // System metadata
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Role-specific data
  assignedFacilities?: string[]; // For facility_manager role
  membershipTier?: 'basic' | 'premium' | 'vip'; // For member role
  permissions?: string[];
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  token: string;
  assignedFacilities?: string[];
}

export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  facility?: string;
  membershipTier?: 'basic' | 'premium' | 'vip' | 'all';
  joinedAfter?: string;
  joinedBefore?: string;
  lastActiveAfter?: string;
  lastActiveBefore?: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  assignedFacilities?: string[];
  membershipTier?: 'basic' | 'premium' | 'vip';
  sendInvitation?: boolean;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  users: User[];
  pagination: PaginationInfo;
  filters: UserFilters;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: {
    super_admin: number;
    facility_manager: number;
    member: number;
  };
  recentSignups: number;
  activeToday: number;
}

// Permission system
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Role configuration
export const USER_ROLES: Record<UserRole, { label: string; description: string; color: string }> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access and administration',
    color: 'red',
  },
  facility_manager: {
    label: 'Facility Manager',
    description: 'Manage assigned facilities and bookings',
    color: 'blue',
  },
  member: {
    label: 'Member',
    description: 'Book facilities and manage personal account',
    color: 'green',
  },
};

export const USER_STATUS_CONFIG: Record<UserStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'green' },
  inactive: { label: 'Inactive', color: 'gray' },
  pending: { label: 'Pending', color: 'yellow' },
  suspended: { label: 'Suspended', color: 'red' },
};

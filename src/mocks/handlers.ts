import { http, HttpResponse } from 'msw';
import { User as AuthUser } from '@/lib/types/auth';
import { Facility } from '@/lib/types/facility';
import { User, UserInvitation, UserStats } from '@/lib/types/user';

// Mock data
const mockAuthUser: AuthUser = {
  id: '1',
  email: 'admin@demo.com',
  role: 'super_admin',
  firstName: 'Admin',
  lastName: 'User',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock facilities data
let mockFacilities: Facility[] = [
  {
    id: 'facility-1',
    name: 'Tennis Court A',
    type: 'tennis_court',
    capacity: 4,
    location: 'North Wing',
    description: 'Professional grade tennis court with LED lighting and all-weather surface. Perfect for singles and doubles matches.',
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    },
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
        alt: 'Tennis Court A - Main View',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    amenities: ['LED Lighting', 'All-Weather Surface', 'Equipment Storage'],
    pricePerHour: 25,
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'facility-2',
    name: 'Basketball Court',
    type: 'basketball_court',
    capacity: 10,
    location: 'Main Building',
    description: 'Indoor basketball court with professional hardwood flooring and adjustable hoops. Suitable for full court games and practice sessions.',
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        alt: 'Basketball Court - Full Court View',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    amenities: ['Hardwood Floor', 'Adjustable Hoops', 'Sound System', 'Air Conditioning'],
    pricePerHour: 35,
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-20T09:15:00Z',
  },
  {
    id: 'facility-3',
    name: 'Olympic Swimming Pool',
    type: 'swimming_pool',
    capacity: 50,
    location: 'Pool Complex',
    description: 'Olympic-sized swimming pool with 8 lanes, perfect for competitive swimming, training, and recreational activities.',
    operatingHours: {
      monday: { isOpen: true, openTime: '05:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '05:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '05:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '05:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '05:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '19:00' },
    },
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
        alt: 'Olympic Swimming Pool',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    amenities: ['8 Lanes', 'Starting Blocks', 'Timing System', 'Lifeguard Station', 'Changing Rooms'],
    pricePerHour: 45,
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T16:20:00Z',
  },
  {
    id: 'facility-4',
    name: 'Fitness Gym',
    type: 'gym',
    capacity: 30,
    location: 'East Wing',
    description: 'Modern fitness facility equipped with cardio machines, weight training equipment, and functional training area.',
    operatingHours: {
      monday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        alt: 'Fitness Gym - Equipment Area',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    amenities: ['Cardio Equipment', 'Weight Training', 'Functional Training Area', 'Lockers', 'Towel Service'],
    pricePerHour: 20,
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
  },
  {
    id: 'facility-5',
    name: 'Squash Court 1',
    type: 'squash_court',
    capacity: 4,
    location: 'South Wing',
    description: 'Regulation squash court with glass back wall for viewing. Climate controlled with professional lighting.',
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    },
    images: [
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        alt: 'Squash Court 1',
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
    ],
    status: 'maintenance',
    amenities: ['Glass Back Wall', 'Climate Control', 'Professional Lighting', 'Equipment Rental'],
    pricePerHour: 30,
    createdBy: 'admin-1',
    updatedBy: 'admin-1',
    createdAt: '2024-01-12T15:45:00Z',
    updatedAt: '2024-01-28T10:20:00Z',
  },
];

// Mock users data
let mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@demo.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+1-555-0101',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    permissions: ['all'],
  },
  {
    id: 'user-2',
    email: 'john.manager@demo.com',
    firstName: 'John',
    lastName: 'Manager',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1-555-0102',
    emailVerified: true,
    lastLoginAt: '2024-01-28T14:30:00Z',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    assignedFacilities: ['facility-1', 'facility-2'],
  },
  {
    id: 'user-3',
    email: 'sarah.coach@demo.com',
    firstName: 'Sarah',
    lastName: 'Coach',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150',
    phone: '+1-555-0103',
    emailVerified: true,
    lastLoginAt: '2024-01-29T09:15:00Z',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-25T11:30:00Z',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    assignedFacilities: ['facility-3', 'facility-4'],
  },
  {
    id: 'user-4',
    email: 'mike.member@demo.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    phone: '+1-555-0104',
    emailVerified: true,
    lastLoginAt: '2024-01-29T18:20:00Z',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-28T20:15:00Z',
    createdBy: 'user-2',
    updatedBy: 'user-4',
    membershipTier: 'premium',
  },
  {
    id: 'user-5',
    email: 'emma.wilson@demo.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    phone: '+1-555-0105',
    emailVerified: true,
    lastLoginAt: '2024-01-28T16:45:00Z',
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-27T14:30:00Z',
    createdBy: 'user-2',
    updatedBy: 'user-5',
    membershipTier: 'basic',
  },
  {
    id: 'user-6',
    email: 'alex.davis@demo.com',
    firstName: 'Alex',
    lastName: 'Davis',
    role: 'member',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    phone: '+1-555-0106',
    emailVerified: true,
    lastLoginAt: '2024-01-15T12:00:00Z',
    createdAt: '2024-01-15T18:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    createdBy: 'user-3',
    updatedBy: 'user-1',
    membershipTier: 'basic',
  },
  {
    id: 'user-7',
    email: 'lisa.pending@demo.com',
    firstName: 'Lisa',
    lastName: 'Pending',
    role: 'member',
    status: 'pending',
    phone: '+1-555-0107',
    emailVerified: false,
    createdAt: '2024-01-28T20:00:00Z',
    updatedAt: '2024-01-28T20:00:00Z',
    createdBy: 'user-2',
    updatedBy: 'user-2',
    membershipTier: 'basic',
  },
];

// Mock invitations
let mockInvitations: UserInvitation[] = [
  {
    id: 'inv-1',
    email: 'new.manager@demo.com',
    role: 'facility_manager',
    invitedBy: 'user-1',
    invitedAt: '2024-01-29T10:00:00Z',
    expiresAt: '2024-02-05T10:00:00Z',
    status: 'pending',
    token: 'inv-token-1',
    assignedFacilities: ['facility-5'],
  },
  {
    id: 'inv-2',
    email: 'jane.newuser@demo.com',
    role: 'member',
    invitedBy: 'user-2',
    invitedAt: '2024-01-28T15:00:00Z',
    expiresAt: '2024-02-04T15:00:00Z',
    status: 'pending',
    token: 'inv-token-2',
  },
];

// Mock user stats
const mockUserStats: UserStats = {
  total: mockUsers.length,
  active: mockUsers.filter(u => u.status === 'active').length,
  inactive: mockUsers.filter(u => u.status === 'inactive').length,
  pending: mockUsers.filter(u => u.status === 'pending').length,
  byRole: {
    super_admin: mockUsers.filter(u => u.role === 'super_admin').length,
    facility_manager: mockUsers.filter(u => u.role === 'facility_manager').length,
    member: mockUsers.filter(u => u.role === 'member').length,
  },
  recentSignups: mockUsers.filter(u => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(u.createdAt) > weekAgo;
  }).length,
  activeToday: mockUsers.filter(u => {
    if (!u.lastLoginAt) return false;
    const today = new Date();
    const loginDate = new Date(u.lastLoginAt);
    return loginDate.toDateString() === today.toDateString();
  }).length,
};

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    // Mock validation
    if (body.email === 'admin@demo.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: mockAuthUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      });
    }

    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authorization = request.headers.get('Authorization');

    if (authorization?.includes('mock-jwt-token')) {
      return HttpResponse.json({ user: mockAuthUser });
    }

    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }),

    // Facilities endpoints
  http.get('/api/facilities', ({ request }) => {
    console.log('🎯 MSW: Intercepted GET /api/facilities');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const type = url.searchParams.get('type') || 'all';
    const status = url.searchParams.get('status') || 'all';
    const location = url.searchParams.get('location') || '';

    // Mock delay for realistic loading
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredFacilities = mockFacilities;

        // Apply filters
        if (search) {
          filteredFacilities = filteredFacilities.filter(f =>
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.type.toLowerCase().includes(search.toLowerCase()) ||
            f.location.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (type !== 'all') {
          filteredFacilities = filteredFacilities.filter(f => f.type === type);
        }

        if (status !== 'all') {
          filteredFacilities = filteredFacilities.filter(f => f.status === status);
        }

        if (location) {
          filteredFacilities = filteredFacilities.filter(f =>
            f.location.toLowerCase().includes(location.toLowerCase())
          );
        }

        // Pagination
        const total = filteredFacilities.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedFacilities = filteredFacilities.slice(startIndex, endIndex);

        resolve(HttpResponse.json({
          facilities: paginatedFacilities,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
          filters: { search, type, status, location },
        }));
      }, 300); // 300ms delay
    });
  }),

  http.get('/api/facilities/:id', ({ params }) => {
    const facility = mockFacilities.find(f => f.id === params.id);
    if (!facility) {
      return HttpResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(facility);
  }),

  http.post('/api/facilities', async ({ request }) => {
    const body = await request.json() as any;

    // Mock validation
    if (!body.name || !body.type || !body.capacity) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newFacility = {
      id: `facility-${Date.now()}`,
      ...body,
      status: 'active',
      images: body.images || [],
      createdBy: 'current-user-id',
      updatedBy: 'current-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFacilities.unshift(newFacility);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(newFacility));
      }, 500);
    });
  }),

  http.patch('/api/facilities/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const facilityIndex = mockFacilities.findIndex(f => f.id === params.id);

    if (facilityIndex === -1) {
      return HttpResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    mockFacilities[facilityIndex] = {
      ...mockFacilities[facilityIndex],
      ...body,
      updatedBy: 'current-user-id',
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(mockFacilities[facilityIndex]));
      }, 500);
    });
  }),

  http.delete('/api/facilities/:id', ({ params }) => {
    const facilityIndex = mockFacilities.findIndex(f => f.id === params.id);

    if (facilityIndex === -1) {
      return HttpResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    mockFacilities.splice(facilityIndex, 1);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ success: true }));
      }, 300);
    });
  }),

  // User Management endpoints
  http.get('/api/users', ({ request }) => {
    console.log('🎯 MSW: Intercepted GET /api/users');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || 'all';
    const status = url.searchParams.get('status') || 'all';
    const membershipTier = url.searchParams.get('membershipTier') || 'all';

    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredUsers = [...mockUsers];

        // Apply filters
        if (search) {
          filteredUsers = filteredUsers.filter(user =>
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (role !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.role === role);
        }

        if (status !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.status === status);
        }

        if (membershipTier !== 'all') {
          filteredUsers = filteredUsers.filter(user => user.membershipTier === membershipTier);
        }

        // Pagination
        const total = filteredUsers.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        resolve(HttpResponse.json({
          users: paginatedUsers,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
          filters: { search, role, status, membershipTier },
        }));
      }, 300);
    });
  }),

  http.get('/api/users/stats', () => {
    return HttpResponse.json(mockUserStats);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);
    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as any;

    // Mock validation
    if (!body.firstName || !body.lastName || !body.email || !body.role) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      ...body,
      status: 'active',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user-id',
      updatedBy: 'current-user-id',
    };

    mockUsers.unshift(newUser);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(newUser));
      }, 500);
    });
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const userIndex = mockUsers.findIndex(u => u.id === params.id);

    if (userIndex === -1) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...body,
      updatedBy: 'current-user-id',
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(mockUsers[userIndex]));
      }, 500);
    });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const userIndex = mockUsers.findIndex(u => u.id === params.id);

    if (userIndex === -1) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    mockUsers.splice(userIndex, 1);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ success: true }));
      }, 300);
    });
  }),

  // User management operations
  http.post('/api/users/:id/reset-password', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id);

    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Password reset email sent'
    });
  }),

  http.patch('/api/users/bulk-update', async ({ request }) => {
    const body = await request.json() as { userIds: string[], updates: any };

    body.userIds.forEach(userId => {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...body.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    });

    return HttpResponse.json({ success: true });
  }),

  // Invitation endpoints
  http.get('/api/invitations', () => {
    return HttpResponse.json(mockInvitations);
  }),

  http.post('/api/invitations', async ({ request }) => {
    const body = await request.json() as any;

    const newInvitation: UserInvitation = {
      id: `inv-${Date.now()}`,
      email: body.email,
      role: body.role,
      invitedBy: 'current-user-id',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      token: `token-${Date.now()}`,
      assignedFacilities: body.assignedFacilities,
    };

    mockInvitations.unshift(newInvitation);

    return HttpResponse.json(newInvitation);
  }),

  http.post('/api/invitations/:id/cancel', ({ params }) => {
    const invIndex = mockInvitations.findIndex(inv => inv.id === params.id);

    if (invIndex !== -1) {
      mockInvitations[invIndex].status = 'cancelled';
    }

    return HttpResponse.json({ success: true });
  }),

  http.post('/api/invitations/:id/resend', ({ params }) => {
    const invIndex = mockInvitations.findIndex(inv => inv.id === params.id);

    if (invIndex !== -1) {
      mockInvitations[invIndex].invitedAt = new Date().toISOString();
      mockInvitations[invIndex].expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }

    return HttpResponse.json(mockInvitations[invIndex]);
  }),
];

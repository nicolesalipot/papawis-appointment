import { http, HttpResponse } from 'msw';
import { User as AuthUser } from '@/lib/types/auth';
import { Facility } from '@/lib/types/facility';
import { User, UserInvitation, UserStats } from '@/lib/types/user';
import { Booking, BookingStats, CalendarEvent, FacilityAvailability, TimeSlot } from '@/lib/types/booking';

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

// Mock bookings data with current/upcoming dates for calendar visibility
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

let mockBookings: Booking[] = [
  {
    id: 'booking-1',
    facilityId: 'facility-1',
    facilityName: 'Tennis Court A',
    customerId: 'user-4',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.member@demo.com',
    customerPhone: '+1-555-0104',
    title: 'Tennis Training Session',
    description: 'Regular weekly tennis training',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0).toISOString(),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
    duration: 60,
    participants: 2,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 25,
    totalAmount: 25,
    paymentStatus: 'paid',
    isRecurring: false,
    notes: 'Bring own rackets',
    source: 'admin',
    createdBy: 'user-1',
    updatedBy: 'user-1',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: 'booking-2',
    facilityId: 'facility-2',
    facilityName: 'Basketball Court',
    customerId: 'user-5',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@demo.com',
    title: 'Basketball Practice',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0).toISOString(),
    duration: 120,
    participants: 8,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 30,
    totalAmount: 60,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEnd: new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString(),
    parentBookingId: 'booking-2',
    notes: 'Team practice session',
    source: 'customer',
    createdBy: 'user-5',
    updatedBy: 'user-5',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
  {
    id: 'booking-3',
    facilityId: 'facility-3',
    facilityName: 'Swimming Pool',
    customerId: 'user-6',
    customerName: 'Alex Davis',
    customerEmail: 'alex.davis@demo.com',
    title: 'Swimming Lessons',
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0).toISOString(),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0).toISOString(),
    duration: 60,
    participants: 1,
    status: 'pending',
    type: 'regular',
    pricePerHour: 35,
    totalAmount: 35,
    paymentStatus: 'pending',
    isRecurring: false,
    notes: 'Beginner level',
    source: 'customer',
    createdBy: 'user-6',
    updatedBy: 'user-6',
    createdAt: '2024-01-29T15:00:00Z',
    updatedAt: '2024-01-29T15:00:00Z',
  },
  {
    id: 'booking-4',
    facilityId: 'facility-1',
    facilityName: 'Tennis Court A',
    customerId: 'user-4',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.member@demo.com',
    title: 'Tennis Tournament',
    description: 'Monthly club tournament',
    startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 13, 0).toISOString(),
    endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 17, 0).toISOString(),
    duration: 240,
    participants: 16,
    status: 'confirmed',
    type: 'event',
    pricePerHour: 25,
    totalAmount: 100,
    paymentStatus: 'paid',
    isRecurring: false,
    tags: ['tournament', 'club-event'],
    notes: 'Prize money: $500',
    internalNotes: 'Need extra staff for this event',
    source: 'admin',
    createdBy: 'user-2',
    updatedBy: 'user-2',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 'booking-5',
    facilityId: 'facility-4',
    facilityName: 'Gym',
    customerId: 'user-5',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@demo.com',
    title: 'Personal Training',
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0).toISOString(),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 0).toISOString(),
    duration: 60,
    participants: 1,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 50,
    totalAmount: 50,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEnd: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()).toISOString(),
    parentBookingId: 'booking-5',
    notes: 'Focus on cardio and strength',
    source: 'customer',
    createdBy: 'user-5',
    updatedBy: 'user-5',
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-29T19:30:00Z',
  },
  // Additional bookings for this week to populate calendar
  {
    id: 'booking-6',
    facilityId: 'facility-3',
    facilityName: 'Swimming Pool',
    customerId: 'user-4',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.member@demo.com',
    title: 'Morning Swim',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0).toISOString(),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0).toISOString(),
    duration: 60,
    participants: 1,
    status: 'completed',
    type: 'regular',
    pricePerHour: 35,
    totalAmount: 35,
    paymentStatus: 'paid',
    isRecurring: false,
    source: 'customer',
    createdBy: 'user-4',
    updatedBy: 'user-4',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-27T14:00:00Z',
  },
  {
    id: 'booking-7',
    facilityId: 'facility-2',
    facilityName: 'Basketball Court',
    customerId: 'user-5',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@demo.com',
    title: 'Team Practice',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0).toISOString(),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0).toISOString(),
    duration: 120,
    participants: 10,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 30,
    totalAmount: 60,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    notes: 'Bring water bottles',
    source: 'customer',
    createdBy: 'user-5',
    updatedBy: 'user-5',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-27T14:00:00Z',
  },
  {
    id: 'booking-8',
    facilityId: 'facility-4',
    facilityName: 'Gym',
    customerId: 'user-6',
    customerName: 'Alex Davis',
    customerEmail: 'alex.davis@demo.com',
    title: 'Strength Training',
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 20, 0).toISOString(),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 21, 30).toISOString(),
    duration: 90,
    participants: 1,
    status: 'pending',
    type: 'regular',
    pricePerHour: 50,
    totalAmount: 75,
    paymentStatus: 'pending',
    isRecurring: false,
    notes: 'Upper body focus',
    source: 'customer',
    createdBy: 'user-6',
    updatedBy: 'user-6',
    createdAt: '2024-01-29T15:00:00Z',
    updatedAt: '2024-01-29T15:00:00Z',
  },
];

// Generate more bookings for realistic dataset
const generateAdditionalBookings = () => {
  const additionalBookings: Booking[] = [];
  const facilities = mockFacilities;
  const users = mockUsers.filter(u => u.role === 'member');

  // Generate bookings for the next 14 days
  for (let i = 0; i < 15; i++) {
    const facility = facilities[Math.floor(Math.random() * facilities.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const bookingDate = new Date(today);
    bookingDate.setDate(today.getDate() + Math.floor(Math.random() * 14));

    const startHour = 8 + Math.floor(Math.random() * 12); // 8 AM to 8 PM
    const duration = [60, 90, 120][Math.floor(Math.random() * 3)];

    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    const statuses: Booking['status'][] = ['confirmed', 'pending', 'completed'];
    const types: Booking['type'][] = ['regular', 'recurring', 'event'];

    additionalBookings.push({
      id: `booking-${9 + i}`,
      facilityId: facility.id,
      facilityName: facility.name,
      customerId: user.id,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      customerPhone: user.phone,
      title: `${facility.name} Session`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      participants: Math.floor(Math.random() * 8) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      pricePerHour: facility.pricePerHour,
      totalAmount: (facility.pricePerHour * duration) / 60,
      paymentStatus: 'paid',
      isRecurring: Math.random() > 0.7,
      source: Math.random() > 0.5 ? 'customer' : 'admin',
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(bookingDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(bookingDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return additionalBookings;
};

mockBookings = [...mockBookings, ...generateAdditionalBookings()];

// Mock booking statistics
const mockBookingStats: BookingStats = {
  total: mockBookings.length,
  confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
  pending: mockBookings.filter(b => b.status === 'pending').length,
  cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
  completed: mockBookings.filter(b => b.status === 'completed').length,
  byType: {
    regular: mockBookings.filter(b => b.type === 'regular').length,
    recurring: mockBookings.filter(b => b.type === 'recurring').length,
    event: mockBookings.filter(b => b.type === 'event').length,
    maintenance: mockBookings.filter(b => b.type === 'maintenance').length,
  },
  revenue: {
    total: mockBookings.reduce((sum, b) => sum + b.totalAmount, 0),
    thisMonth: mockBookings
      .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + b.totalAmount, 0),
    lastMonth: mockBookings
      .filter(b => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return new Date(b.createdAt).getMonth() === lastMonth.getMonth();
      })
      .reduce((sum, b) => sum + b.totalAmount, 0),
    growth: 15.5, // Mock growth percentage
  },
  utilization: {
    overall: 68.5,
    thisWeek: 72.3,
    lastWeek: 65.8,
  },
  topFacilities: mockFacilities.slice(0, 3).map(f => ({
    facilityId: f.id,
    facilityName: f.name,
    bookingCount: mockBookings.filter(b => b.facilityId === f.id).length,
    revenue: mockBookings
      .filter(b => b.facilityId === f.id)
      .reduce((sum, b) => sum + b.totalAmount, 0),
  })),
};

// Helper functions for booking system
const getBookingColor = (status: Booking['status'], type: Booking['type']): string => {
  if (status === 'cancelled') return '#ef4444'; // red
  if (status === 'completed') return '#6b7280'; // gray
  if (status === 'pending') return '#f59e0b'; // yellow

  switch (type) {
    case 'event': return '#f97316'; // orange
    case 'recurring': return '#8b5cf6'; // purple
    case 'maintenance': return '#dc2626'; // red
    case 'blocked': return '#374151'; // gray
    default: return '#3b82f6'; // blue
  }
};

const generateTimeSlots = (facilityId: string, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const facility = mockFacilities.find(f => f.id === facilityId);

  if (!facility) return slots;

  // Generate slots from 8 AM to 10 PM in 1-hour intervals
  for (let hour = 8; hour < 22; hour++) {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, 0, 0, 0);

    // Check if this slot is booked
    const isBooked = mockBookings.some(booking =>
      booking.facilityId === facilityId &&
      booking.status !== 'cancelled' &&
      new Date(booking.startTime) <= startTime &&
      new Date(booking.endTime) > startTime
    );

    slots.push({
      id: `slot-${facilityId}-${date}-${hour}`,
      facilityId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      capacity: facility.capacity,
      availableSpots: isBooked ? 0 : facility.capacity,
      pricePerHour: facility.pricePerHour,
      isAvailable: !isBooked,
      isBlocked: false,
    });
  }

  return slots;
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

  // Booking Management endpoints
  http.get('/api/bookings', ({ request }) => {
    console.log('🎯 MSW: Intercepted GET /api/bookings');
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const search = url.searchParams.get('search') || '';
    const facilityId = url.searchParams.get('facilityId') || '';
    const customerId = url.searchParams.get('customerId') || '';
    const status = url.searchParams.get('status') || 'all';
    const type = url.searchParams.get('type') || 'all';
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';

    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredBookings = [...mockBookings];

        // Apply filters
        if (search) {
          filteredBookings = filteredBookings.filter(booking =>
            booking.title.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
            booking.facilityName.toLowerCase().includes(search.toLowerCase()) ||
            booking.customerEmail.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (facilityId) {
          filteredBookings = filteredBookings.filter(booking => booking.facilityId === facilityId);
        }

        if (customerId) {
          filteredBookings = filteredBookings.filter(booking => booking.customerId === customerId);
        }

        if (status !== 'all') {
          filteredBookings = filteredBookings.filter(booking => booking.status === status);
        }

        if (type !== 'all') {
          filteredBookings = filteredBookings.filter(booking => booking.type === type);
        }

        if (startDate) {
          filteredBookings = filteredBookings.filter(booking =>
            new Date(booking.startTime) >= new Date(startDate)
          );
        }

        if (endDate) {
          filteredBookings = filteredBookings.filter(booking =>
            new Date(booking.endTime) <= new Date(endDate)
          );
        }

        // Sort by start time (newest first)
        filteredBookings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

        // Pagination
        const total = filteredBookings.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

        resolve(HttpResponse.json({
          bookings: paginatedBookings,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
          filters: { search, facilityId, customerId, status, type, startDate, endDate },
        }));
      }, 400);
    });
  }),

  http.get('/api/bookings/stats', () => {
    return HttpResponse.json(mockBookingStats);
  }),

  http.get('/api/bookings/calendar', ({ request }) => {
    console.log('🎯 MSW: Intercepted GET /api/bookings/calendar');
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate') || '';
    const endDate = url.searchParams.get('endDate') || '';
    const facilities = url.searchParams.get('facilities')?.split(',') || [];
    const showCancelled = url.searchParams.get('showCancelled') === 'true';
    const showCompleted = url.searchParams.get('showCompleted') === 'true';

    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredBookings = [...mockBookings];

        // Filter by date range
        if (startDate && endDate) {
          filteredBookings = filteredBookings.filter(booking => {
            const bookingStart = new Date(booking.startTime);
            return bookingStart >= new Date(startDate) && bookingStart <= new Date(endDate);
          });
        }

        // Filter by facilities
        if (facilities.length > 0) {
          filteredBookings = filteredBookings.filter(booking =>
            facilities.includes(booking.facilityId)
          );
        }

        // Filter by status
        if (!showCancelled) {
          filteredBookings = filteredBookings.filter(booking => booking.status !== 'cancelled');
        }

        if (!showCompleted) {
          filteredBookings = filteredBookings.filter(booking => booking.status !== 'completed');
        }

        // Transform to calendar events
        const calendarEvents: CalendarEvent[] = filteredBookings.map(booking => ({
          id: `event-${booking.id}`,
          bookingId: booking.id,
          title: booking.title,
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
          facilityId: booking.facilityId,
          facilityName: booking.facilityName,
          customerName: booking.customerName,
          status: booking.status,
          type: booking.type,
          participants: booking.participants,
          color: getBookingColor(booking.status, booking.type),
        }));

        resolve(HttpResponse.json(calendarEvents));
      }, 300);
    });
  }),

  http.get('/api/bookings/:id', ({ params }) => {
    const booking = mockBookings.find(b => b.id === params.id);
    if (!booking) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json(booking);
  }),

  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json() as any;

    // Mock validation
    if (!body.facilityId || !body.customerId || !body.startTime || !body.endTime) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for conflicts (simplified)
    const conflicts = mockBookings.filter(booking =>
      booking.facilityId === body.facilityId &&
      booking.status !== 'cancelled' &&
      (
        (new Date(body.startTime) >= new Date(booking.startTime) &&
         new Date(body.startTime) < new Date(booking.endTime)) ||
        (new Date(body.endTime) > new Date(booking.startTime) &&
         new Date(body.endTime) <= new Date(booking.endTime))
      )
    );

    if (conflicts.length > 0) {
      return HttpResponse.json(
        { error: 'Time slot conflict detected', conflicts },
        { status: 409 }
      );
    }

    const facility = mockFacilities.find(f => f.id === body.facilityId);
    const customer = mockUsers.find(u => u.id === body.customerId);

    const duration = Math.floor((new Date(body.endTime).getTime() - new Date(body.startTime).getTime()) / (1000 * 60));

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      facilityId: body.facilityId,
      facilityName: facility?.name || 'Unknown Facility',
      customerId: body.customerId,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone,
      title: body.title,
      description: body.description,
      startTime: body.startTime,
      endTime: body.endTime,
      duration,
      participants: body.participants || 1,
      status: 'confirmed',
      type: body.type || 'regular',
      pricePerHour: facility?.pricePerHour || 25,
      totalAmount: facility ? (facility.pricePerHour * duration) / 60 : 0,
      paymentStatus: 'pending',
      isRecurring: body.isRecurring || false,
      recurrencePattern: body.recurrencePattern,
      recurrenceEnd: body.recurrenceEnd,
      notes: body.notes,
      tags: body.tags,
      source: 'admin',
      createdBy: 'current-user-id',
      updatedBy: 'current-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBookings.unshift(newBooking);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(newBooking));
      }, 600);
    });
  }),

  http.patch('/api/bookings/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    const bookingIndex = mockBookings.findIndex(b => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      ...body,
      updatedBy: 'current-user-id',
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(mockBookings[bookingIndex]));
      }, 500);
    });
  }),

  http.delete('/api/bookings/:id', ({ params }) => {
    const bookingIndex = mockBookings.findIndex(b => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    mockBookings.splice(bookingIndex, 1);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ success: true }));
      }, 400);
    });
  }),

  http.post('/api/bookings/:id/cancel', async ({ params, request }) => {
    const body = await request.json() as any;
    const bookingIndex = mockBookings.findIndex(b => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    mockBookings[bookingIndex] = {
      ...mockBookings[bookingIndex],
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'current-user-id',
      cancellationReason: body.reason || 'No reason provided',
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(mockBookings[bookingIndex]);
  }),

  http.get('/api/bookings/check-availability', ({ request }) => {
    const url = new URL(request.url);
    const facilityId = url.searchParams.get('facilityId');
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');
    const excludeBookingId = url.searchParams.get('excludeBookingId');

    const conflicts = mockBookings.filter(booking =>
      booking.facilityId === facilityId &&
      booking.status !== 'cancelled' &&
      booking.id !== excludeBookingId &&
      (
        (new Date(startTime!) >= new Date(booking.startTime) &&
         new Date(startTime!) < new Date(booking.endTime)) ||
        (new Date(endTime!) > new Date(booking.startTime) &&
         new Date(endTime!) <= new Date(booking.endTime))
      )
    );

    const validation = {
      isValid: conflicts.length === 0,
      conflicts: conflicts.map(booking => ({
        conflictingBookingId: booking.id,
        conflictType: 'overlap' as const,
        message: `Conflicts with existing booking: ${booking.title}`,
      })),
      warnings: [],
      suggestions: conflicts.length > 0 ? ['Try selecting a different time slot'] : [],
    };

    return HttpResponse.json(validation);
  }),

  http.get('/api/facilities/:facilityId/availability', ({ params, request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Generate mock availability data
    const availability: FacilityAvailability[] = [];
    const start = new Date(startDate!);
    const end = new Date(endDate!);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      availability.push({
        facilityId: params.facilityId as string,
        date: dateStr,
        timeSlots: generateTimeSlots(params.facilityId as string, dateStr),
        operatingHours: { open: '08:00', close: '22:00' },
        isHoliday: false,
      });
    }

    return HttpResponse.json(availability);
  }),

  http.get('/api/facilities/:facilityId/time-slots', ({ params, request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    const timeSlots = generateTimeSlots(params.facilityId as string, date!);
    return HttpResponse.json(timeSlots);
  }),
];

import type { Facility, FacilityStatus } from '@/lib/types/facility';
import type {
  Booking,
  TimeSlot,
  BookingRule,
  FacilityAvailability
} from '@/lib/types/booking';
import type {
  User,
  UserActivity,
  UserInvitation,
  UserStats
} from '@/lib/types/user';
import type {
  BookingAnalytics,
  RevenueAnalytics,
  FacilityAnalytics,
  UserAnalytics,
  TimeSeriesData,
  PeakHourData,
  MetricCard
} from '@/lib/types/analytics';

// Sample Facilities Data
export const sampleFacilities: Facility[] = [
  {
    id: 'fac-001',
    name: 'Tennis Court A',
    type: 'tennis_court',
    capacity: 4,
    location: 'North Wing',
    description: 'Professional-grade tennis court with all-weather surface',
    status: 'active',
    amenities: ['Lighting', 'Net included', 'Seating area'],
    pricePerHour: 45,
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-001',
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&q=80',
        alt: 'Tennis Court A - Professional Grade Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-001-2',
        url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80',
        alt: 'Tennis Court A - Night View with Lighting',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-001-3',
        url: '/sample-images/tennis-court-sample.svg',
        alt: 'Tennis Court A - Sample Court Layout',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-002',
    name: 'Tennis Court B',
    type: 'tennis_court',
    capacity: 4,
    location: 'North Wing',
    description: 'Professional-grade tennis court with all-weather surface',
    status: 'maintenance',
    amenities: ['Lighting', 'Net included', 'Seating area'],
    pricePerHour: 45,
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-002',
        url: 'https://images.unsplash.com/photo-1544717684-19bb1709ac40?w=600&h=400&fit=crop&q=80',
        alt: 'Tennis Court B - Clay Court Surface',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-003',
    name: 'Basketball Court',
    type: 'basketball_court',
    capacity: 10,
    location: 'South Wing',
    description: 'Indoor basketball court with professional hoops',
    status: 'active',
    amenities: ['Air conditioning', 'Sound system', 'Scoreboard'],
    pricePerHour: 60,
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
    },
    images: [
      {
        id: 'img-003',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&q=80',
        alt: 'Basketball Court - Indoor Professional Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-003-2',
        url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=400&fit=crop&q=80',
        alt: 'Basketball Court - Full Court View',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-004',
    name: 'Swimming Pool',
    type: 'swimming_pool',
    capacity: 25,
    location: 'East Wing',
    description: 'Olympic-size swimming pool with lane dividers',
    status: 'active',
    amenities: ['Heated pool', 'Lifeguard', 'Changing rooms', 'Showers'],
    pricePerHour: 75,
    operatingHours: {
      monday: { isOpen: true, openTime: '05:30', closeTime: '21:30' },
      tuesday: { isOpen: true, openTime: '05:30', closeTime: '21:30' },
      wednesday: { isOpen: true, openTime: '05:30', closeTime: '21:30' },
      thursday: { isOpen: true, openTime: '05:30', closeTime: '21:30' },
      friday: { isOpen: true, openTime: '05:30', closeTime: '21:30' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
    },
    images: [
      {
        id: 'img-004',
        url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop&q=80',
        alt: 'Swimming Pool - Olympic Size Pool',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-004-2',
        url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop&q=80',
        alt: 'Swimming Pool - Lane Dividers and Diving Board',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-004-3',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
        alt: 'Swimming Pool - Pool Deck and Lounge Area',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-005',
    name: 'Volleyball Court',
    type: 'volleyball_court',
    capacity: 12,
    location: 'Central Area',
    description: 'Indoor volleyball court with professional net and markings',
    status: 'active',
    amenities: ['Professional net', 'Air conditioning', 'Seating'],
    pricePerHour: 50,
    operatingHours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-005',
        url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop&q=80',
        alt: 'Volleyball Court - Professional Indoor Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-005-2',
        url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop&q=80',
        alt: 'Volleyball Court - Net and Court Markings',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-006',
    name: 'Fitness Gym',
    type: 'gym',
    capacity: 30,
    location: 'West Wing',
    description: 'Fully equipped fitness center with modern equipment',
    status: 'active',
    amenities: ['Cardio equipment', 'Weight machines', 'Free weights', 'Air conditioning'],
    pricePerHour: 25,
    operatingHours: {
      monday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    },
    images: [
      {
        id: 'img-006',
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&q=80',
        alt: 'Fitness Gym - Modern Equipment Area',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-006-2',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80',
        alt: 'Fitness Gym - Cardio Equipment Section',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-006-3',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
        alt: 'Fitness Gym - Free Weights Area',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-007',
    name: 'Squash Court 1',
    type: 'squash_court',
    capacity: 2,
    location: 'Lower Level',
    description: 'Professional squash court with glass back wall',
    status: 'active',
    amenities: ['Air conditioning', 'Towel service', 'Equipment rental'],
    pricePerHour: 40,
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-007',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80',
        alt: 'Squash Court 1 - Glass Back Wall Professional Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-007-2',
        url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&h=400&fit=crop&q=80',
        alt: 'Squash Court 1 - Side View and Court Dimensions',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-008',
    name: 'Badminton Court',
    type: 'badminton_court',
    capacity: 4,
    location: 'Central Area',
    description: 'Professional badminton court with competition-grade flooring',
    status: 'inactive',
    amenities: ['Professional nets', 'Air conditioning', 'Equipment rental'],
    pricePerHour: 35,
    operatingHours: {
      monday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      tuesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      wednesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      thursday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      friday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      saturday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
      sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
    },
    images: [
      {
        id: 'img-008',
        url: 'https://images.unsplash.com/photo-1626252196-1e676d8baa14?w=600&h=400&fit=crop&q=80',
        alt: 'Badminton Court - Professional Competition Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-008-2',
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop&q=80',
        alt: 'Badminton Court - Multiple Courts View',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-009',
    name: 'Fitness & Wellness Gym',
    type: 'gym',
    capacity: 30,
    location: 'Wellness Center, Floor 2',
    description: 'State-of-the-art fitness facility with modern equipment, free weights, and cardio machines.',
    status: 'active',
    amenities: ['Cardio Machines', 'Free Weights', 'Weight Machines'],
    pricePerHour: 45,
    operatingHours: {
      monday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      tuesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      wednesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      thursday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      friday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    },
    images: [
      {
        id: 'img-009',
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80',
        alt: 'Fitness & Wellness Gym - Cardio Equipment Section',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-009-2',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
        alt: 'Fitness & Wellness Gym - Free Weights Area',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-010',
    name: 'Championship Football Field',
    type: 'football_field',
    capacity: 22,
    location: 'Stadium Complex, Main Field',
    description: 'Full-size football field with natural grass and stadium seating for competitive matches.',
    status: 'active',
    amenities: ['Stadium Lighting', 'Natural Grass', 'Goal Posts'],
    pricePerHour: 300,
    operatingHours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    },
    images: [
      {
        id: 'img-010',
        url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&q=80',
        alt: 'Championship Football Field - Full Stadium View',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-010-2',
        url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&h=400&fit=crop&q=80',
        alt: 'Championship Football Field - Natural Grass Surface',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fac-011',
    name: 'Squash Court Alpha',
    type: 'squash_court',
    capacity: 2,
    location: 'Racquet Sports Center, Court A',
    description: 'Professional squash court with glass back wall for spectators and premium playing surface.',
    status: 'active',
    amenities: ['Glass Back Wall', 'Professional Flooring', 'Equipment Rental'],
    pricePerHour: 65,
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    images: [
      {
        id: 'img-011',
        url: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&h=400&fit=crop&q=80',
        alt: 'Squash Court Alpha - Glass Back Wall Professional Court',
        isPrimary: true,
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img-011-2',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80',
        alt: 'Squash Court Alpha - Side View and Court Dimensions',
        isPrimary: false,
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Sample Customers Data (Legacy - kept for compatibility)
export const sampleCustomers = [
  { id: 'cust-001', name: 'John Doe', email: 'john.doe@email.com', phone: '+1-555-0101' },
  { id: 'cust-002', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '+1-555-0102' },
  { id: 'cust-003', name: 'Michael Chen', email: 'michael.chen@email.com', phone: '+1-555-0103' },
  { id: 'cust-004', name: 'Emily Rodriguez', email: 'emily.rodriguez@email.com', phone: '+1-555-0104' },
  { id: 'cust-005', name: 'David Thompson', email: 'david.thompson@email.com', phone: '+1-555-0105' },
  { id: 'cust-006', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', phone: '+1-555-0106' },
  { id: 'cust-007', name: 'James Taylor', email: 'james.taylor@email.com', phone: '+1-555-0107' },
  { id: 'cust-008', name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '+1-555-0108' },
  { id: 'cust-009', name: 'Robert Brown', email: 'robert.brown@email.com', phone: '+1-555-0109' },
  { id: 'cust-010', name: 'Amanda Jones', email: 'amanda.jones@email.com', phone: '+1-555-0110' },
];

// Sample Users Data with Roles and Status
export const sampleUsers: User[] = [
  {
    id: 'user-001',
    email: 'admin@sportscomplex.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0001',
    dateOfBirth: '1985-03-15',
    address: '123 Admin Street, City, State 12345',
    emergencyContact: '+1-555-0999',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    permissions: ['all'],
  },
  {
    id: 'user-002',
    email: 'manager.courts@sportscomplex.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0002',
    dateOfBirth: '1990-07-22',
    address: '456 Manager Lane, City, State 12345',
    emergencyContact: '+1-555-0998',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-002',
    assignedFacilities: ['fac-001', 'fac-002', 'fac-005', 'fac-008'],
    permissions: ['facility_management', 'booking_management'],
  },
  {
    id: 'user-003',
    email: 'manager.aquatics@sportscomplex.com',
    firstName: 'Bob',
    lastName: 'Martinez',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0003',
    dateOfBirth: '1988-11-10',
    address: '789 Pool Ave, City, State 12345',
    emergencyContact: '+1-555-0997',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-003',
    assignedFacilities: ['fac-004'],
    permissions: ['facility_management', 'booking_management'],
  },
  {
    id: 'user-004',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0101',
    dateOfBirth: '1992-05-18',
    address: '321 Member St, City, State 12345',
    emergencyContact: '+1-555-0996',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-004',
    membershipTier: 'premium',
    permissions: ['booking_create', 'booking_manage'],
  },
  {
    id: 'user-005',
    email: 'sarah.wilson@email.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0102',
    dateOfBirth: '1995-09-25',
    address: '654 Wilson Way, City, State 12345',
    emergencyContact: '+1-555-0995',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-005',
    membershipTier: 'vip',
    permissions: ['booking_create', 'booking_manage'],
  },
  {
    id: 'user-006',
    email: 'michael.chen@email.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'member',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0103',
    dateOfBirth: '1991-12-03',
    address: '987 Chen Circle, City, State 12345',
    emergencyContact: '+1-555-0994',
    emailVerified: false,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    createdBy: 'user-002',
    updatedBy: 'user-002',
    membershipTier: 'basic',
    permissions: [],
  },
  {
    id: 'user-007',
    email: 'emily.rodriguez@email.com',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    role: 'member',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0104',
    dateOfBirth: '1993-04-14',
    address: '147 Rodriguez Road, City, State 12345',
    emergencyContact: '+1-555-0993',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-007',
    membershipTier: 'premium',
    permissions: ['booking_create', 'booking_manage'],
  },
  {
    id: 'user-008',
    email: 'david.thompson@email.com',
    firstName: 'David',
    lastName: 'Thompson',
    role: 'member',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0105',
    dateOfBirth: '1987-08-29',
    address: '258 Thompson Terrace, City, State 12345',
    emergencyContact: '+1-555-0992',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-008',
    membershipTier: 'basic',
    permissions: ['booking_create'],
  },
  {
    id: 'user-009',
    email: 'lisa.anderson@email.com',
    firstName: 'Lisa',
    lastName: 'Anderson',
    role: 'member',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0106',
    dateOfBirth: '1989-06-17',
    address: '369 Anderson Ave, City, State 12345',
    emergencyContact: '+1-555-0991',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-002',
    updatedBy: 'user-001',
    membershipTier: 'basic',
    permissions: [],
  },
  {
    id: 'user-010',
    email: 'manager.indoor@sportscomplex.com',
    firstName: 'Tom',
    lastName: 'Harrison',
    role: 'facility_manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+1-555-0004',
    dateOfBirth: '1986-02-28',
    address: '741 Harrison Heights, City, State 12345',
    emergencyContact: '+1-555-0990',
    emailVerified: true,
    lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-001',
    updatedBy: 'user-010',
    assignedFacilities: ['fac-003', 'fac-006', 'fac-007', 'fac-009', 'fac-010', 'fac-011'],
    permissions: ['facility_management', 'booking_management'],
  },
];

// Sample Bookings Data
export const sampleBookings: Booking[] = [
  {
    id: 'book-001',
    facilityId: 'fac-001',
    facilityName: 'Tennis Court A',
    customerId: 'cust-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1-555-0101',
    title: 'Tennis Practice Session',
    description: 'Weekly tennis practice',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    duration: 60,
    participants: 2,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 45,
    totalAmount: 45,
    paymentStatus: 'paid',
    isRecurring: false,
    notes: 'Please ensure court is well-lit',
    source: 'customer',
    createdBy: 'cust-001',
    updatedBy: 'cust-001',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-002',
    facilityId: 'fac-003',
    facilityName: 'Basketball Court',
    customerId: 'cust-002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1-555-0102',
    title: 'Basketball Team Practice',
    description: 'Team training session',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    duration: 120,
    participants: 8,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 60,
    totalAmount: 120,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    notes: 'Equipment provided by team',
    source: 'customer',
    createdBy: 'cust-002',
    updatedBy: 'cust-002',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-003',
    facilityId: 'fac-004',
    facilityName: 'Swimming Pool',
    customerId: 'cust-003',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerPhone: '+1-555-0103',
    title: 'Swimming Lessons',
    description: 'Private swimming lesson',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(), // 7 hours from now
    duration: 60,
    participants: 1,
    status: 'pending',
    type: 'regular',
    pricePerHour: 75,
    totalAmount: 75,
    paymentStatus: 'pending',
    isRecurring: false,
    notes: 'First-time swimmer',
    source: 'customer',
    createdBy: 'cust-003',
    updatedBy: 'cust-003',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-004',
    facilityId: 'fac-005',
    facilityName: 'Volleyball Court',
    customerId: 'cust-004',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rodriguez@email.com',
    customerPhone: '+1-555-0104',
    title: 'Volleyball Tournament',
    description: 'Inter-company volleyball tournament',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // Tomorrow + 4 hours
    duration: 240,
    participants: 12,
    status: 'confirmed',
    type: 'event',
    pricePerHour: 50,
    totalAmount: 200,
    paymentStatus: 'paid',
    isRecurring: false,
    notes: 'Tournament setup required',
    source: 'admin',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-005',
    facilityId: 'fac-006',
    facilityName: 'Fitness Gym',
    customerId: 'cust-005',
    customerName: 'David Thompson',
    customerEmail: 'david.thompson@email.com',
    customerPhone: '+1-555-0105',
    title: 'Personal Training',
    description: 'One-on-one fitness training',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    duration: 60,
    participants: 1,
    status: 'completed',
    type: 'regular',
    pricePerHour: 25,
    totalAmount: 25,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    notes: 'Focus on cardio',
    source: 'customer',
    createdBy: 'cust-005',
    updatedBy: 'cust-005',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-006',
    facilityId: 'fac-007',
    facilityName: 'Squash Court 1',
    customerId: 'cust-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@email.com',
    customerPhone: '+1-555-0106',
    title: 'Squash Match',
    description: 'Competitive squash match',
    startTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    endTime: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(), // 9 hours from now
    duration: 60,
    participants: 2,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 40,
    totalAmount: 40,
    paymentStatus: 'paid',
    isRecurring: false,
    notes: 'Equipment rental included',
    source: 'customer',
    createdBy: 'cust-006',
    updatedBy: 'cust-006',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-007',
    facilityId: 'fac-001',
    facilityName: 'Tennis Court A',
    customerId: 'cust-007',
    customerName: 'James Taylor',
    customerEmail: 'james.taylor@email.com',
    customerPhone: '+1-555-0107',
    title: 'Tennis Doubles',
    description: 'Doubles tennis match with friends',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    endTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    duration: 60,
    participants: 4,
    status: 'no_show',
    type: 'regular',
    pricePerHour: 45,
    totalAmount: 45,
    paymentStatus: 'refunded',
    isRecurring: false,
    notes: 'Customer did not show up',
    source: 'customer',
    createdBy: 'cust-007',
    updatedBy: 'admin',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  }
];

// Dashboard Statistics
export const dashboardStats = {
  totalBookingsToday: 24,
  totalBookingsTodayChange: 12,
  activeFacilities: 8,
  activeFacilitiesChange: 2,
  totalUsers: 156,
  totalUsersChange: 5,
  utilizationRate: 78,
  utilizationRateChange: -3,

  // Weekly revenue data for charts
  weeklyRevenue: [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 1450 },
    { day: 'Wed', amount: 1100 },
    { day: 'Thu', amount: 1650 },
    { day: 'Fri', amount: 1800 },
    { day: 'Sat', amount: 2100 },
    { day: 'Sun', amount: 1900 },
  ],

  // Facility usage data
  facilityUsage: [
    { name: 'Tennis Court A', bookings: 42, revenue: 1890 },
    { name: 'Basketball Court', bookings: 38, revenue: 2280 },
    { name: 'Swimming Pool', bookings: 35, revenue: 2625 },
    { name: 'Volleyball Court', bookings: 28, revenue: 1400 },
    { name: 'Fitness Gym', bookings: 156, revenue: 3900 },
    { name: 'Squash Court 1', bookings: 24, revenue: 960 },
  ],

  // Booking status distribution
  bookingStatusDistribution: [
    { status: 'Confirmed', count: 142, percentage: 71 },
    { status: 'Pending', count: 28, percentage: 14 },
    { status: 'Completed', count: 24, percentage: 12 },
    { status: 'Cancelled', count: 6, percentage: 3 },
  ],
};

// Utility functions
export const getActiveFacilities = () =>
  sampleFacilities.filter(facility => facility.status === 'active');

export const getTodaysBookings = () => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  return sampleBookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate >= startOfDay && bookingDate < endOfDay;
  });
};

export const getRecentBookings = (limit: number = 5) =>
  sampleBookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

export const getFacilityStatusSummary = () => {
  const statusCounts: Record<FacilityStatus, number> = {
    active: 0,
    inactive: 0,
    maintenance: 0,
    closed: 0,
  };

  sampleFacilities.forEach(facility => {
    statusCounts[facility.status]++;
  });

  return statusCounts;
};

export const getCurrentlyOccupiedFacilities = () => {
  const now = new Date();
  const occupiedFacilityIds = new Set(
    sampleBookings
      .filter(booking => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        return booking.status === 'confirmed' && start <= now && end > now;
      })
      .map(booking => booking.facilityId)
  );

  return sampleFacilities.map(facility => ({
    ...facility,
    isCurrentlyOccupied: occupiedFacilityIds.has(facility.id),
  }));
};

// Sample User Activities
export const sampleUserActivities: UserActivity[] = [
  {
    id: 'activity-001',
    userId: 'user-004',
    action: 'booking_created',
    description: 'Created a new booking for Tennis Court A',
    metadata: { bookingId: 'book-001', facilityId: 'fac-001' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    id: 'activity-002',
    userId: 'user-005',
    action: 'booking_created',
    description: 'Created a new booking for Basketball Court',
    metadata: { bookingId: 'book-002', facilityId: 'fac-003' },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: 'activity-003',
    userId: 'user-002',
    action: 'facility_updated',
    description: 'Updated facility Tennis Court B status to maintenance',
    metadata: { facilityId: 'fac-002', oldStatus: 'active', newStatus: 'maintenance' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    id: 'activity-004',
    userId: 'user-001',
    action: 'user_suspended',
    description: 'Suspended user Lisa Anderson',
    metadata: { targetUserId: 'user-009', reason: 'Policy violation' },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.10',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  {
    id: 'activity-005',
    userId: 'user-007',
    action: 'booking_cancelled',
    description: 'Cancelled booking for Volleyball Court',
    metadata: { bookingId: 'book-004', reason: 'Schedule conflict' },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  },
];

// Sample User Invitations
export const sampleUserInvitations: UserInvitation[] = [
  {
    id: 'inv-001',
    email: 'new.manager@sportscomplex.com',
    role: 'facility_manager',
    invitedBy: 'user-001',
    invitedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    token: 'inv_token_abc123xyz',
    assignedFacilities: ['fac-008'],
  },
  {
    id: 'inv-002',
    email: 'premium.member@email.com',
    role: 'member',
    invitedBy: 'user-002',
    invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    token: 'inv_token_def456uvw',
  },
  {
    id: 'inv-003',
    email: 'expired.invitation@email.com',
    role: 'member',
    invitedBy: 'user-002',
    invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    token: 'inv_token_ghi789rst',
  },
];

// Sample Analytics Data
export const sampleBookingAnalytics: BookingAnalytics = {
  totalBookings: 247,
  confirmedBookings: 186,
  cancelledBookings: 28,
  completedBookings: 124,
  pendingBookings: 15,
  noShowBookings: 18,
  totalRevenue: 14850,
  averageBookingValue: 60.12,
  conversionRate: 88.7,
  cancellationRate: 11.3,
  noShowRate: 7.3,
};

export const sampleRevenueAnalytics: RevenueAnalytics = {
  totalRevenue: 14850,
  monthlyRevenue: 8250,
  yearlyRevenue: 125600,
  previousMonthRevenue: 7100,
  revenueGrowth: 16.2,
  averageRevenuePerBooking: 60.12,
  averageRevenuePerUser: 148.5,
  projectedMonthlyRevenue: 9500,
};

export const sampleFacilityAnalytics: FacilityAnalytics[] = [
  {
    facilityId: 'fac-001',
    facilityName: 'Tennis Court A',
    totalBookings: 45,
    totalRevenue: 2025,
    utilizationRate: 78.5,
    averageBookingDuration: 75,
    peakHours: ['18:00', '19:00', '20:00'],
    popularDays: ['Saturday', 'Sunday', 'Tuesday'],
    averageRating: 4.6,
    capacityUtilization: 85.2,
  },
  {
    facilityId: 'fac-003',
    facilityName: 'Basketball Court',
    totalBookings: 38,
    totalRevenue: 2280,
    utilizationRate: 82.1,
    averageBookingDuration: 90,
    peakHours: ['17:00', '18:00', '19:00'],
    popularDays: ['Wednesday', 'Friday', 'Saturday'],
    averageRating: 4.7,
    capacityUtilization: 76.3,
  },
  {
    facilityId: 'fac-004',
    facilityName: 'Swimming Pool',
    totalBookings: 52,
    totalRevenue: 3900,
    utilizationRate: 69.8,
    averageBookingDuration: 60,
    peakHours: ['06:00', '18:00', '19:00'],
    popularDays: ['Monday', 'Wednesday', 'Friday'],
    averageRating: 4.8,
    capacityUtilization: 72.4,
  },
  {
    facilityId: 'fac-006',
    facilityName: 'Fitness Gym',
    totalBookings: 89,
    totalRevenue: 2225,
    utilizationRate: 91.2,
    averageBookingDuration: 45,
    peakHours: ['06:00', '17:00', '18:00'],
    popularDays: ['Monday', 'Tuesday', 'Thursday'],
    averageRating: 4.5,
    capacityUtilization: 68.9,
  },
];

export const sampleUserAnalytics: UserAnalytics = {
  totalUsers: 156,
  activeUsers: 142,
  newUsersThisMonth: 12,
  churnRate: 2.8,
  averageBookingsPerUser: 1.58,
  averageLifetimeValue: 245.80,
  userGrowthRate: 8.7,
  topCustomers: [
    {
      id: 'user-005',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      totalBookings: 23,
      totalSpent: 1725,
      lastBookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      membershipType: 'vip',
    },
    {
      id: 'user-004',
      name: 'John Doe',
      email: 'john.doe@email.com',
      totalBookings: 18,
      totalSpent: 1350,
      lastBookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      membershipType: 'premium',
    },
    {
      id: 'user-007',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      totalBookings: 15,
      totalSpent: 1125,
      lastBookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      membershipType: 'premium',
    },
  ],
};

// Sample Time Series Data for Charts
export const sampleBookingTrends: TimeSeriesData[] = [
  { date: '2024-02-01', value: 18, label: 'Bookings', category: 'daily' },
  { date: '2024-02-02', value: 22, label: 'Bookings', category: 'daily' },
  { date: '2024-02-03', value: 15, label: 'Bookings', category: 'daily' },
  { date: '2024-02-04', value: 28, label: 'Bookings', category: 'daily' },
  { date: '2024-02-05', value: 32, label: 'Bookings', category: 'daily' },
  { date: '2024-02-06', value: 35, label: 'Bookings', category: 'daily' },
  { date: '2024-02-07', value: 29, label: 'Bookings', category: 'daily' },
  { date: '2024-02-08', value: 24, label: 'Bookings', category: 'daily' },
  { date: '2024-02-09', value: 27, label: 'Bookings', category: 'daily' },
  { date: '2024-02-10', value: 31, label: 'Bookings', category: 'daily' },
  { date: '2024-02-11', value: 26, label: 'Bookings', category: 'daily' },
  { date: '2024-02-12', value: 33, label: 'Bookings', category: 'daily' },
  { date: '2024-02-13', value: 38, label: 'Bookings', category: 'daily' },
  { date: '2024-02-14', value: 25, label: 'Bookings', category: 'daily' },
];

export const sampleRevenueTrends: TimeSeriesData[] = [
  { date: '2024-02-01', value: 1080, label: 'Revenue', category: 'daily' },
  { date: '2024-02-02', value: 1320, label: 'Revenue', category: 'daily' },
  { date: '2024-02-03', value: 900, label: 'Revenue', category: 'daily' },
  { date: '2024-02-04', value: 1680, label: 'Revenue', category: 'daily' },
  { date: '2024-02-05', value: 1920, label: 'Revenue', category: 'daily' },
  { date: '2024-02-06', value: 2100, label: 'Revenue', category: 'daily' },
  { date: '2024-02-07', value: 1740, label: 'Revenue', category: 'daily' },
  { date: '2024-02-08', value: 1440, label: 'Revenue', category: 'daily' },
  { date: '2024-02-09', value: 1620, label: 'Revenue', category: 'daily' },
  { date: '2024-02-10', value: 1860, label: 'Revenue', category: 'daily' },
  { date: '2024-02-11', value: 1560, label: 'Revenue', category: 'daily' },
  { date: '2024-02-12', value: 1980, label: 'Revenue', category: 'daily' },
  { date: '2024-02-13', value: 2280, label: 'Revenue', category: 'daily' },
  { date: '2024-02-14', value: 1500, label: 'Revenue', category: 'daily' },
];

export const samplePeakHoursData: PeakHourData[] = [
  { hour: '06:00', bookings: 12, revenue: 720, utilization: 45.2 },
  { hour: '07:00', bookings: 8, revenue: 480, utilization: 32.1 },
  { hour: '08:00', bookings: 5, revenue: 300, utilization: 18.7 },
  { hour: '09:00', bookings: 3, revenue: 180, utilization: 12.3 },
  { hour: '10:00', bookings: 4, revenue: 240, utilization: 15.8 },
  { hour: '11:00', bookings: 6, revenue: 360, utilization: 24.1 },
  { hour: '12:00', bookings: 9, revenue: 540, utilization: 36.4 },
  { hour: '13:00', bookings: 7, revenue: 420, utilization: 28.2 },
  { hour: '14:00', bookings: 8, revenue: 480, utilization: 32.1 },
  { hour: '15:00', bookings: 11, revenue: 660, utilization: 42.3 },
  { hour: '16:00', bookings: 14, revenue: 840, utilization: 58.7 },
  { hour: '17:00', bookings: 18, revenue: 1080, utilization: 72.4 },
  { hour: '18:00', bookings: 22, revenue: 1320, utilization: 89.2 },
  { hour: '19:00', bookings: 25, revenue: 1500, utilization: 95.6 },
  { hour: '20:00', bookings: 19, revenue: 1140, utilization: 78.9 },
  { hour: '21:00', bookings: 12, revenue: 720, utilization: 52.3 },
  { hour: '22:00', bookings: 6, revenue: 360, utilization: 28.1 },
];

// Sample Metric Cards for Dashboard
export const sampleMetricCards: MetricCard[] = [
  {
    title: 'Total Bookings',
    value: 247,
    change: 12.5,
    trend: 'up',
    format: 'number',
    color: 'blue',
    description: 'Total bookings this month',
  },
  {
    title: 'Revenue',
    value: 14850,
    change: 16.2,
    trend: 'up',
    format: 'currency',
    color: 'green',
    description: 'Total revenue this month',
  },
  {
    title: 'Active Users',
    value: 142,
    change: 8.7,
    trend: 'up',
    format: 'number',
    color: 'purple',
    description: 'Currently active users',
  },
  {
    title: 'Utilization Rate',
    value: 78.5,
    change: -2.3,
    trend: 'down',
    format: 'percentage',
    color: 'orange',
    description: 'Overall facility utilization',
  },
];

// Sample User Statistics
export const sampleUserStats: UserStats = {
  total: 156,
  active: 142,
  inactive: 8,
  pending: 6,
  byRole: {
    super_admin: 1,
    facility_manager: 3,
    member: 152,
  },
  recentSignups: 12,
  activeToday: 89,
};

// Additional Diverse Booking Scenarios
export const additionalSampleBookings: Booking[] = [
  {
    id: 'book-008',
    facilityId: 'fac-010',
    facilityName: 'Championship Football Field',
    customerId: 'user-005',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1-555-0102',
    title: 'Corporate Football Tournament',
    description: 'Annual company football tournament finals',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 3 days + 4 hours
    duration: 240,
    participants: 22,
    status: 'confirmed',
    type: 'event',
    pricePerHour: 300,
    totalAmount: 1200,
    paymentStatus: 'paid',
    isRecurring: false,
    notes: 'Special event setup required, catering included',
    tags: ['corporate', 'tournament', 'special'],
    source: 'admin',
    createdBy: 'user-002',
    updatedBy: 'user-002',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-009',
    facilityId: 'fac-009',
    facilityName: 'Fitness & Wellness Gym',
    customerId: 'user-007',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.rodriguez@email.com',
    customerPhone: '+1-555-0104',
    title: 'Morning Yoga Class',
    description: 'Daily morning yoga session',
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // Tomorrow morning
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // +1 hour
    duration: 60,
    participants: 15,
    status: 'confirmed',
    type: 'recurring',
    pricePerHour: 45,
    totalAmount: 45,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'daily',
    recurrenceEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Bring yoga mats, instructor provided',
    tags: ['yoga', 'wellness', 'group'],
    source: 'customer',
    createdBy: 'user-007',
    updatedBy: 'user-007',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-010',
    facilityId: 'fac-011',
    facilityName: 'Squash Court Alpha',
    customerId: 'user-004',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1-555-0101',
    title: 'Squash League Match',
    description: 'Semi-final league match',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // +90 minutes
    duration: 90,
    participants: 2,
    status: 'pending',
    type: 'event',
    pricePerHour: 65,
    totalAmount: 97.5,
    paymentStatus: 'pending',
    isRecurring: false,
    notes: 'Tournament match - referee required',
    tags: ['tournament', 'league', 'competitive'],
    source: 'customer',
    createdBy: 'user-004',
    updatedBy: 'user-004',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-011',
    facilityId: 'fac-004',
    facilityName: 'Swimming Pool',
    customerId: 'user-006',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerPhone: '+1-555-0103',
    title: 'Pool Maintenance Block',
    description: 'Weekly pool maintenance and cleaning',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 hours
    duration: 180,
    participants: 0,
    status: 'confirmed',
    type: 'maintenance',
    pricePerHour: 0,
    totalAmount: 0,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    notes: 'Facility unavailable during maintenance',
    internalNotes: 'Check chemical levels and clean filters',
    tags: ['maintenance', 'cleaning'],
    source: 'admin',
    createdBy: 'user-003',
    updatedBy: 'user-003',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-012',
    facilityId: 'fac-006',
    facilityName: 'Fitness Gym',
    customerId: 'user-005',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1-555-0102',
    title: 'Personal Training Session',
    description: 'Advanced strength training with personal trainer',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    duration: 60,
    participants: 1,
    status: 'confirmed',
    type: 'regular',
    pricePerHour: 25,
    totalAmount: 25,
    paymentStatus: 'paid',
    isRecurring: true,
    recurrencePattern: 'weekly',
    recurrenceEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'VIP member - premium trainer assigned',
    tags: ['personal-training', 'vip', 'strength'],
    source: 'customer',
    createdBy: 'user-005',
    updatedBy: 'user-005',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'book-013',
    facilityId: 'fac-001',
    facilityName: 'Tennis Court A',
    customerId: 'user-008',
    customerName: 'David Thompson',
    customerEmail: 'david.thompson@email.com',
    customerPhone: '+1-555-0105',
    title: 'Tennis Lesson Cancelled',
    description: 'Weekly tennis lesson - cancelled due to weather',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    endTime: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hours ago
    duration: 60,
    participants: 2,
    status: 'cancelled',
    type: 'regular',
    pricePerHour: 45,
    totalAmount: 45,
    paymentStatus: 'refunded',
    isRecurring: true,
    recurrencePattern: 'weekly',
    notes: 'Weather-related cancellation',
    cancelledAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    cancelledBy: 'user-002',
    cancellationReason: 'Weather conditions unsafe',
    tags: ['lesson', 'weather-cancelled'],
    source: 'customer',
    createdBy: 'user-008',
    updatedBy: 'user-002',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];

// Sample Time Slots for Different Facilities
export const sampleTimeSlots: TimeSlot[] = [
  // Tennis Court A - Today
  {
    id: 'slot-001',
    facilityId: 'fac-001',
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    capacity: 4,
    availableSpots: 2,
    pricePerHour: 45,
    isAvailable: true,
    isBlocked: false,
  },
  {
    id: 'slot-002',
    facilityId: 'fac-001',
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    capacity: 4,
    availableSpots: 0,
    pricePerHour: 45,
    isAvailable: false,
    isBlocked: false,
  },
  {
    id: 'slot-003',
    facilityId: 'fac-001',
    startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    capacity: 4,
    availableSpots: 4,
    pricePerHour: 45,
    isAvailable: true,
    isBlocked: false,
  },
  // Basketball Court - Today
  {
    id: 'slot-004',
    facilityId: 'fac-003',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    capacity: 10,
    availableSpots: 2,
    pricePerHour: 60,
    isAvailable: true,
    isBlocked: false,
  },
  {
    id: 'slot-005',
    facilityId: 'fac-003',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    capacity: 10,
    availableSpots: 10,
    pricePerHour: 60,
    isAvailable: true,
    isBlocked: false,
  },
  // Swimming Pool - Blocked for maintenance
  {
    id: 'slot-006',
    facilityId: 'fac-004',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(), // Tomorrow + 3 hours
    capacity: 25,
    availableSpots: 0,
    pricePerHour: 75,
    isAvailable: false,
    isBlocked: true,
    blockReason: 'Scheduled maintenance',
  },
  // Fitness Gym - Multiple slots
  {
    id: 'slot-007',
    facilityId: 'fac-006',
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    capacity: 30,
    availableSpots: 15,
    pricePerHour: 25,
    isAvailable: true,
    isBlocked: false,
  },
  {
    id: 'slot-008',
    facilityId: 'fac-006',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    capacity: 30,
    availableSpots: 1,
    pricePerHour: 25,
    isAvailable: true,
    isBlocked: false,
  },
];

// Sample Facility Availability for different dates
export const sampleFacilityAvailability: FacilityAvailability[] = [
  {
    facilityId: 'fac-001',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlots: sampleTimeSlots.filter(slot => slot.facilityId === 'fac-001'),
    operatingHours: {
      open: '06:00',
      close: '22:00',
    },
    isHoliday: false,
  },
  {
    facilityId: 'fac-003',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlots: sampleTimeSlots.filter(slot => slot.facilityId === 'fac-003'),
    operatingHours: {
      open: '06:00',
      close: '23:00',
    },
    isHoliday: false,
  },
  {
    facilityId: 'fac-004',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    timeSlots: sampleTimeSlots.filter(slot => slot.facilityId === 'fac-004'),
    operatingHours: {
      open: '05:30',
      close: '21:30',
    },
    isHoliday: false,
    specialHours: {
      open: '08:00',
      close: '18:00',
      reason: 'Maintenance day - limited hours',
    },
  },
  {
    facilityId: 'fac-006',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlots: sampleTimeSlots.filter(slot => slot.facilityId === 'fac-006'),
    operatingHours: {
      open: '05:00',
      close: '23:00',
    },
    isHoliday: false,
  },
];

// Sample Booking Rules and Policies
export const sampleBookingRules: BookingRule[] = [
  {
    id: 'rule-001',
    name: 'Advance Booking Limit',
    description: 'Members can book facilities up to 14 days in advance',
    facilityId: undefined, // Global rule
    ruleType: 'advance_booking',
    isActive: true,
    minAdvanceHours: 1,
    maxAdvanceHours: 336, // 14 days
    userRoles: ['member'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-002',
    name: 'Premium Member Extended Booking',
    description: 'Premium and VIP members can book up to 30 days in advance',
    facilityId: undefined, // Global rule
    ruleType: 'advance_booking',
    isActive: true,
    minAdvanceHours: 1,
    maxAdvanceHours: 720, // 30 days
    userRoles: ['facility_manager', 'super_admin'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-003',
    name: 'Tennis Court Booking Duration',
    description: 'Tennis court bookings must be between 1-3 hours',
    facilityId: 'fac-001',
    ruleType: 'duration',
    isActive: true,
    minDurationMinutes: 60,
    maxDurationMinutes: 180,
    userRoles: ['member', 'facility_manager', 'super_admin'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-004',
    name: 'Gym Session Limit',
    description: 'Members can book maximum 2 gym sessions per day',
    facilityId: 'fac-006',
    ruleType: 'user_limit',
    isActive: true,
    maxBookingsPerDay: 2,
    userRoles: ['member'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-005',
    name: 'Swimming Pool Cancellation Policy',
    description: 'Swimming pool bookings can be cancelled up to 4 hours before',
    facilityId: 'fac-004',
    ruleType: 'cancellation',
    isActive: true,
    maxCancellationHours: 4,
    userRoles: ['member', 'facility_manager', 'super_admin'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-006',
    name: 'Football Field Event Booking',
    description: 'Football field requires minimum 2-hour booking for events',
    facilityId: 'fac-010',
    ruleType: 'duration',
    isActive: true,
    minDurationMinutes: 120,
    maxDurationMinutes: 480, // 8 hours max
    userRoles: ['facility_manager', 'super_admin'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-007',
    name: 'Member Weekly Booking Limit',
    description: 'Basic members limited to 3 bookings per week',
    facilityId: undefined, // Global rule
    ruleType: 'user_limit',
    isActive: true,
    maxBookingsPerUser: 3,
    userRoles: ['member'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'rule-008',
    name: 'Squash Court Prime Time',
    description: 'Squash courts have different pricing during peak hours (17:00-21:00)',
    facilityId: 'fac-007',
    ruleType: 'capacity',
    isActive: true,
    timeSlots: ['17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'],
    userRoles: ['member', 'facility_manager', 'super_admin'],
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Utility Functions for Enhanced Sample Data

// Get all bookings (combined original + additional)
export const getAllBookings = (): Booking[] => [
  ...sampleBookings,
  ...additionalSampleBookings,
];

// Get users by role
export const getUsersByRole = (role: string) =>
  sampleUsers.filter(user => user.role === role);

// Get active users
export const getActiveUsers = () =>
  sampleUsers.filter(user => user.status === 'active');

// Get bookings by status
export const getBookingsByStatus = (status: string) =>
  getAllBookings().filter(booking => booking.status === status);

// Get bookings by facility
export const getBookingsByFacility = (facilityId: string) =>
  getAllBookings().filter(booking => booking.facilityId === facilityId);

// Get upcoming bookings
export const getUpcomingBookings = (hours: number = 24) => {
  const now = new Date();
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

  return getAllBookings().filter(booking => {
    const startTime = new Date(booking.startTime);
    return startTime > now && startTime <= futureTime && booking.status === 'confirmed';
  });
};

// Get booking statistics
export const getBookingStatistics = () => {
  const allBookings = getAllBookings();

  return {
    total: allBookings.length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    pending: allBookings.filter(b => b.status === 'pending').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    noShow: allBookings.filter(b => b.status === 'no_show').length,
    totalRevenue: allBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };
};

// Get facility utilization
export const getFacilityUtilization = () => {
  const allBookings = getAllBookings();
  const facilitiesWithBookings = sampleFacilities.map(facility => {
    const facilityBookings = allBookings.filter(b => b.facilityId === facility.id);
    const confirmedBookings = facilityBookings.filter(b => b.status === 'confirmed');

    return {
      ...facility,
      totalBookings: facilityBookings.length,
      confirmedBookings: confirmedBookings.length,
      revenue: facilityBookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0),
      utilizationRate: confirmedBookings.length / facilityBookings.length * 100 || 0,
    };
  });

  return facilitiesWithBookings.sort((a, b) => b.totalBookings - a.totalBookings);
};

// Get recent user activities
export const getRecentActivities = (limit: number = 10) =>
  sampleUserActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

// Get pending invitations
export const getPendingInvitations = () =>
  sampleUserInvitations.filter(inv => inv.status === 'pending');

// Get available time slots for today
export const getTodayAvailableSlots = () =>
  sampleTimeSlots.filter(slot => slot.isAvailable && !slot.isBlocked);

// Get booking rules by facility
export const getBookingRulesByFacility = (facilityId: string) =>
  sampleBookingRules.filter(rule =>
    rule.facilityId === facilityId || rule.facilityId === undefined
  ).filter(rule => rule.isActive);

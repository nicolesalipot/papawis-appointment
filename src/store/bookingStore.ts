import { create } from 'zustand';
import type {
  Booking,
  BookingFilters,
  BookingFormData,
  BookingStats,
  PaginationInfo,
  CalendarEvent,
  CalendarView,
  FacilityAvailability,
  TimeSlot,
  BookingValidation
} from '../lib/types/booking';

interface BookingStore {
  // State
  bookings: Booking[];
  selectedBooking: Booking | null;
  filters: BookingFilters;
  pagination: PaginationInfo;
  stats: BookingStats | null;
  calendarEvents: CalendarEvent[];
  calendarView: CalendarView;
  facilityAvailability: Record<string, FacilityAvailability[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setBookings: (bookings: Booking[]) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  setFilters: (filters: Partial<BookingFilters>) => void;
  setPagination: (pagination: Partial<PaginationInfo>) => void;
  setStats: (stats: BookingStats) => void;
  setCalendarEvents: (events: CalendarEvent[]) => void;
  setCalendarView: (view: Partial<CalendarView>) => void;
  setFacilityAvailability: (facilityId: string, availability: FacilityAvailability[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD Operations
  fetchBookings: () => Promise<void>;
  fetchBookingStats: () => Promise<void>;
  fetchCalendarEvents: (startDate: string, endDate: string) => Promise<void>;
  fetchFacilityAvailability: (facilityId: string, startDate: string, endDate: string) => Promise<void>;
  createBooking: (data: BookingFormData) => Promise<Booking>;
  updateBooking: (id: string, data: Partial<BookingFormData> | Partial<Booking>) => Promise<Booking>;
  deleteBooking: (id: string) => Promise<void>;
  getBookingById: (id: string) => Promise<Booking>;

  // Booking Management Operations
  confirmBooking: (id: string) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  completeBooking: (id: string) => Promise<void>;
  markNoShow: (id: string) => Promise<void>;
  rescheduleBooking: (id: string, newStartTime: string, newEndTime: string) => Promise<void>;

  // Availability Operations
  checkAvailability: (facilityId: string, startTime: string, endTime: string, excludeBookingId?: string) => Promise<BookingValidation>;
  getAvailableTimeSlots: (facilityId: string, date: string) => Promise<TimeSlot[]>;
  blockTimeSlot: (facilityId: string, startTime: string, endTime: string, reason: string) => Promise<void>;
  unblockTimeSlot: (facilityId: string, startTime: string, endTime: string) => Promise<void>;

  // Utility actions
  clearFilters: () => void;
  resetState: () => void;
  refreshData: () => Promise<void>;
}

const defaultFilters: BookingFilters = {
  search: '',
  status: 'all',
  type: 'all',
  paymentStatus: 'all',
  source: 'all',
};

const defaultPagination: PaginationInfo = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
};

const defaultCalendarView: CalendarView = {
  view: 'week',
  currentDate: new Date(),
  selectedFacilities: [],
  showCancelled: false,
  showCompleted: true,
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial state
  bookings: [],
  selectedBooking: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  stats: null,
  calendarEvents: [],
  calendarView: defaultCalendarView,
  facilityAvailability: {},
  isLoading: false,
  error: null,

  // Basic setters
  setBookings: (bookings) => set({ bookings }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    })),
  setPagination: (newPagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...newPagination } })),
  setStats: (stats) => set({ stats }),
  setCalendarEvents: (events) => set({ calendarEvents: events }),
  setCalendarView: (newView) =>
    set((state) => ({ calendarView: { ...state.calendarView, ...newView } })),
  setFacilityAvailability: (facilityId, availability) =>
    set((state) => ({
      facilityAvailability: {
        ...state.facilityAvailability,
        [facilityId]: availability,
      },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // CRUD Operations
  fetchBookings: async () => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      // Generate sample booking data for demonstration
      const sampleBookings: Booking[] = [
        // Customer-1 bookings
        {
          id: 'booking-customer-001',
          facilityId: 'fac-001',
          facilityName: 'Tennis Court A',
          customerId: 'customer-1',
          customerName: 'Customer User',
          customerEmail: 'customer@demo.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Tennis Practice Session',
          description: 'Weekly tennis practice with coach',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 90 min later
          duration: 90,
          participants: 2,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 45,
          totalAmount: 67.50,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          notes: 'Bring own rackets and water',
          tags: ['tennis', 'practice'],
          source: 'customer',
          createdBy: 'customer-1',
          updatedBy: 'customer-1',
          createdAt: '2024-12-10T10:00:00Z',
          updatedAt: '2024-12-10T10:00:00Z',
        },
        {
          id: 'booking-customer-002',
          facilityId: 'fac-006',
          facilityName: 'Fitness Gym',
          customerId: 'customer-1',
          customerName: 'Customer User',
          customerEmail: 'customer@demo.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Morning Workout',
          description: 'Personal training session focusing on strength training',
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour later
          duration: 60,
          participants: 1,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 25,
          totalAmount: 25.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          notes: 'Focus on upper body exercises',
          tags: ['fitness', 'training'],
          source: 'customer',
          createdBy: 'customer-1',
          updatedBy: 'customer-1',
          createdAt: '2024-12-12T08:00:00Z',
          updatedAt: '2024-12-12T08:00:00Z',
        },
        {
          id: 'booking-customer-003',
          facilityId: 'fac-004',
          facilityName: 'Swimming Pool',
          customerId: 'customer-1',
          customerName: 'Customer User',
          customerEmail: 'customer@demo.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Swimming Lessons',
          description: 'Advanced swimming technique improvement',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour later
          duration: 60,
          participants: 1,
          status: 'pending',
          type: 'regular',
          pricePerHour: 75,
          totalAmount: 75.00,
          paymentStatus: 'pending',
          isRecurring: false,
          notes: 'Working on butterfly stroke technique',
          tags: ['swimming', 'lessons'],
          source: 'customer',
          createdBy: 'customer-1',
          updatedBy: 'customer-1',
          createdAt: '2024-12-13T14:30:00Z',
          updatedAt: '2024-12-13T14:30:00Z',
        },
        {
          id: 'booking-customer-004',
          facilityId: 'fac-003',
          facilityName: 'Basketball Court',
          customerId: 'customer-1',
          customerName: 'Customer User',
          customerEmail: 'customer@demo.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Basketball Game',
          description: 'Casual basketball game with friends',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(), // 2 hours later
          duration: 120,
          participants: 8,
          status: 'completed',
          type: 'regular',
          pricePerHour: 60,
          totalAmount: 120.00,
          paymentStatus: 'paid',
          isRecurring: false,
          notes: 'Great game, everyone had fun!',
          tags: ['basketball', 'recreation'],
          source: 'customer',
          createdBy: 'customer-1',
          updatedBy: 'customer-1',
          createdAt: '2024-12-11T16:00:00Z',
          updatedAt: '2024-12-12T20:00:00Z',
        },
        {
          id: 'booking-customer-005',
          facilityId: 'fac-005',
          facilityName: 'Volleyball Court',
          customerId: 'customer-1',
          customerName: 'Customer User',
          customerEmail: 'customer@demo.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Volleyball Practice',
          description: 'Team practice for upcoming tournament',
          startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 90 min later
          duration: 90,
          participants: 6,
          status: 'cancelled',
          type: 'regular',
          pricePerHour: 50,
          totalAmount: 75.00,
          paymentStatus: 'refunded',
          isRecurring: false,
          cancellationReason: 'Weather conditions',
          cancelledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          cancelledBy: 'customer-1',
          notes: 'Will reschedule for next week',
          tags: ['volleyball', 'practice'],
          source: 'customer',
          createdBy: 'customer-1',
          updatedBy: 'customer-1',
          createdAt: '2024-12-08T10:00:00Z',
          updatedAt: '2024-12-09T09:00:00Z',
        },
        // Other users' bookings
        {
          id: 'booking-001',
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerId: 'customer-001',
          customerName: 'John Smith',
          customerEmail: 'john.smith@example.com',
          customerPhone: '+1 (555) 123-4567',
          title: 'Team Building Session',
          description: 'Quarterly team building activities and workshops',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          duration: 120,
          participants: 12,
          status: 'confirmed',
          type: 'event',
          pricePerHour: 75,
          totalAmount: 150.00,
          paymentStatus: 'paid',
          isRecurring: false,
          notes: 'Catering required for 12 people',
          tags: ['team-building', 'workshop'],
          source: 'admin',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-12-10T10:00:00Z',
          updatedAt: '2024-12-10T10:00:00Z',
        },
        {
          id: 'booking-002',
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerId: 'customer-002',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah.johnson@example.com',
          customerPhone: '+1 (555) 234-5678',
          title: 'Yoga Class',
          description: 'Weekly Hatha yoga session for beginners',
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 90 min later
          duration: 90,
          participants: 8,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 60,
          totalAmount: 90.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['yoga', 'fitness'],
          source: 'customer',
          createdBy: 'customer-002',
          updatedBy: 'customer-002',
          createdAt: '2024-12-08T14:30:00Z',
          updatedAt: '2024-12-08T14:30:00Z',
        },
        {
          id: 'booking-003',
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerId: 'customer-003',
          customerName: 'Michael Brown',
          customerEmail: 'michael.brown@example.com',
          customerPhone: '+1 (555) 345-6789',
          title: 'Client Presentation',
          description: 'Important quarterly business review with key stakeholders',
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          duration: 90,
          participants: 5,
          status: 'pending',
          type: 'regular',
          pricePerHour: 75,
          totalAmount: 112.50,
          paymentStatus: 'pending',
          isRecurring: false,
          tags: ['business', 'presentation'],
          source: 'customer',
          createdBy: 'customer-003',
          updatedBy: 'customer-003',
          createdAt: '2024-12-12T09:15:00Z',
          updatedAt: '2024-12-12T09:15:00Z',
        },
        {
          id: 'booking-004',
          facilityId: 'facility-3',
          facilityName: 'Swimming Pool',
          customerId: 'customer-004',
          customerName: 'Emma Davis',
          customerEmail: 'emma.davis@example.com',
          customerPhone: '+1 (555) 456-7890',
          title: 'Swim Training',
          description: 'Personal swimming lessons and technique improvement',
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          duration: 60,
          participants: 1,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 40,
          totalAmount: 40.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['swimming', 'training'],
          source: 'customer',
          createdBy: 'customer-004',
          updatedBy: 'customer-004',
          createdAt: '2024-12-11T16:20:00Z',
          updatedAt: '2024-12-11T16:20:00Z',
        },
        {
          id: 'booking-005',
          facilityId: 'facility-4',
          facilityName: 'Tennis Court 1',
          customerId: 'customer-005',
          customerName: 'Robert Wilson',
          customerEmail: 'robert.wilson@example.com',
          customerPhone: '+1 (555) 567-8901',
          title: 'Tennis Match',
          description: 'Doubles tennis match with friends',
          startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
          duration: 120,
          participants: 4,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 50,
          totalAmount: 100.00,
          paymentStatus: 'paid',
          isRecurring: false,
          tags: ['tennis', 'recreation'],
          source: 'customer',
          createdBy: 'customer-005',
          updatedBy: 'customer-005',
          createdAt: '2024-12-13T11:45:00Z',
          updatedAt: '2024-12-13T11:45:00Z',
        },
        {
          id: 'booking-006',
          facilityId: 'facility-5',
          facilityName: 'Auditorium',
          customerId: 'customer-006',
          customerName: 'Lisa Martinez',
          customerEmail: 'lisa.martinez@example.com',
          customerPhone: '+1 (555) 678-9012',
          title: 'Product Launch Event',
          description: 'Company-wide product launch presentation and demonstration',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          duration: 180,
          participants: 150,
          status: 'pending',
          type: 'event',
          pricePerHour: 200,
          totalAmount: 600.00,
          paymentStatus: 'pending',
          isRecurring: false,
          notes: 'Need AV equipment setup, catering for 150 people',
          tags: ['product-launch', 'corporate'],
          source: 'customer',
          createdBy: 'customer-006',
          updatedBy: 'customer-006',
          createdAt: '2024-12-14T09:30:00Z',
          updatedAt: '2024-12-14T09:30:00Z',
        },
        {
          id: 'booking-007',
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerId: 'customer-007',
          customerName: 'David Lee',
          customerEmail: 'david.lee@example.com',
          title: 'HIIT Training Session',
          description: 'High-intensity interval training class',
          startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
          endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          duration: 45,
          participants: 15,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 60,
          totalAmount: 45.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['fitness', 'hiit'],
          source: 'customer',
          createdBy: 'customer-007',
          updatedBy: 'customer-007',
          createdAt: '2024-12-13T14:15:00Z',
          updatedAt: '2024-12-13T14:15:00Z',
        },
        // Past bookings
        {
          id: 'booking-008',
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerId: 'customer-008',
          customerName: 'Jennifer Taylor',
          customerEmail: 'jennifer.taylor@example.com',
          title: 'Board Meeting',
          description: 'Monthly board of directors meeting',
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          duration: 120,
          participants: 8,
          status: 'completed',
          type: 'event',
          pricePerHour: 75,
          totalAmount: 150.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'monthly',
          tags: ['board', 'meeting'],
          source: 'admin',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-12-07T08:00:00Z',
          updatedAt: '2024-12-11T16:00:00Z',
        },
        {
          id: 'booking-009',
          facilityId: 'facility-3',
          facilityName: 'Swimming Pool',
          customerId: 'customer-009',
          customerName: 'Carlos Rodriguez',
          customerEmail: 'carlos.rodriguez@example.com',
          title: 'Aqua Aerobics',
          description: 'Water aerobics class for seniors',
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          duration: 60,
          participants: 12,
          status: 'completed',
          type: 'regular',
          pricePerHour: 40,
          totalAmount: 40.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['aqua-aerobics', 'seniors'],
          source: 'customer',
          createdBy: 'customer-009',
          updatedBy: 'customer-009',
          createdAt: '2024-12-05T10:30:00Z',
          updatedAt: '2024-12-12T17:00:00Z',
        },
        {
          id: 'booking-010',
          facilityId: 'facility-4',
          facilityName: 'Tennis Court 1',
          customerId: 'customer-010',
          customerName: 'Amanda White',
          customerEmail: 'amanda.white@example.com',
          title: 'Tennis Lesson',
          description: 'Private tennis coaching session',
          startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          duration: 60,
          participants: 1,
          status: 'no_show',
          type: 'regular',
          pricePerHour: 50,
          totalAmount: 50.00,
          paymentStatus: 'paid',
          isRecurring: false,
          notes: 'Customer did not show up',
          tags: ['tennis', 'lesson'],
          source: 'customer',
          createdBy: 'customer-010',
          updatedBy: 'admin',
          createdAt: '2024-12-12T13:20:00Z',
          updatedAt: '2024-12-14T15:30:00Z',
        },
        {
          id: 'booking-011',
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerId: 'customer-011',
          customerName: 'Kevin Park',
          customerEmail: 'kevin.park@example.com',
          title: 'Dance Class',
          description: 'Contemporary dance workshop',
          startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
          duration: 90,
          participants: 20,
          status: 'cancelled',
          type: 'event',
          pricePerHour: 60,
          totalAmount: 90.00,
          paymentStatus: 'refunded',
          isRecurring: false,
          cancellationReason: 'Instructor illness',
          cancelledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          cancelledBy: 'admin',
          tags: ['dance', 'workshop'],
          source: 'customer',
          createdBy: 'customer-011',
          updatedBy: 'admin',
          createdAt: '2024-12-05T16:45:00Z',
          updatedAt: '2024-12-08T10:15:00Z',
        },
        // Maintenance and blocked bookings
        {
          id: 'booking-012',
          facilityId: 'facility-3',
          facilityName: 'Swimming Pool',
          customerId: 'maintenance-001',
          customerName: 'Maintenance Team',
          customerEmail: 'maintenance@facility.com',
          title: 'Pool Maintenance',
          description: 'Weekly pool cleaning and chemical balancing',
          startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days from now
          endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          duration: 120,
          participants: 2,
          status: 'confirmed',
          type: 'maintenance',
          pricePerHour: 0,
          totalAmount: 0,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['maintenance', 'cleaning'],
          source: 'admin',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-12-01T08:00:00Z',
          updatedAt: '2024-12-01T08:00:00Z',
        },
        {
          id: 'booking-013',
          facilityId: 'facility-5',
          facilityName: 'Auditorium',
          customerId: 'admin-001',
          customerName: 'Facility Admin',
          customerEmail: 'admin@facility.com',
          title: 'Equipment Installation',
          description: 'Installing new sound system and lighting equipment',
          startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
          duration: 240,
          participants: 5,
          status: 'confirmed',
          type: 'blocked',
          pricePerHour: 0,
          totalAmount: 0,
          paymentStatus: 'paid',
          isRecurring: false,
          notes: 'Facility unavailable for bookings during installation',
          tags: ['installation', 'equipment'],
          source: 'admin',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-12-10T12:00:00Z',
          updatedAt: '2024-12-10T12:00:00Z',
        },
        // Today's bookings
        {
          id: 'booking-014',
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerId: 'customer-012',
          customerName: 'Alex Thompson',
          customerEmail: 'alex.thompson@example.com',
          title: 'Strategy Meeting',
          description: 'Quarterly strategy planning session',
          startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
          endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
          duration: 120,
          participants: 6,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 75,
          totalAmount: 150.00,
          paymentStatus: 'paid',
          isRecurring: false,
          tags: ['strategy', 'planning'],
          source: 'customer',
          createdBy: 'customer-012',
          updatedBy: 'customer-012',
          createdAt: '2024-12-10T09:00:00Z',
          updatedAt: '2024-12-10T09:00:00Z',
        },
        {
          id: 'booking-015',
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerId: 'customer-013',
          customerName: 'Maria Gonzalez',
          customerEmail: 'maria.gonzalez@example.com',
          title: 'Pilates Class',
          description: 'Beginner-friendly Pilates session',
          startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
          endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(), // 7 hours from now
          duration: 60,
          participants: 10,
          status: 'confirmed',
          type: 'regular',
          pricePerHour: 60,
          totalAmount: 60.00,
          paymentStatus: 'paid',
          isRecurring: true,
          recurrencePattern: 'weekly',
          tags: ['pilates', 'fitness'],
          source: 'customer',
          createdBy: 'customer-013',
          updatedBy: 'customer-013',
          createdAt: '2024-12-12T15:30:00Z',
          updatedAt: '2024-12-12T15:30:00Z',
        }
      ];

      // Apply filters
      let filteredBookings = sampleBookings.filter(booking => {
        const searchMatch = !filters.search ||
          booking.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
          booking.facilityName.toLowerCase().includes(filters.search.toLowerCase());

        const facilityMatch = !filters.facilityId || booking.facilityId === filters.facilityId;
        const customerMatch = !filters.customerId || booking.customerId === filters.customerId;
        const statusMatch = !filters.status || filters.status === 'all' || booking.status === filters.status;
        const typeMatch = !filters.type || filters.type === 'all' || booking.type === filters.type;
        const paymentMatch = !filters.paymentStatus || filters.paymentStatus === 'all' || booking.paymentStatus === filters.paymentStatus;
        const sourceMatch = !filters.source || filters.source === 'all' || booking.source === filters.source;

        return searchMatch && facilityMatch && customerMatch && statusMatch && typeMatch && paymentMatch && sourceMatch;
      });

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const paginatedBookings = filteredBookings.slice(startIndex, startIndex + pagination.pageSize);
      const paginationInfo = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredBookings.length,
        totalPages: Math.ceil(filteredBookings.length / pagination.pageSize),
      };

      // Simulate loading delay
      setTimeout(() => {
        set({
          bookings: paginatedBookings,
          pagination: paginationInfo,
          isLoading: false,
        });
      }, 400);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchBookingStats: async () => {
    try {
      // Generate sample booking stats for demonstration
      const sampleStats: BookingStats = {
        total: 156,
        confirmed: 98,
        pending: 23,
        cancelled: 15,
        completed: 20,
        byType: {
          regular: 89,
          recurring: 34,
          event: 21,
          maintenance: 12,
        },
        revenue: {
          total: 45670.50,
          thisMonth: 12430.75,
          lastMonth: 10850.25,
          growth: 14.6, // percentage
        },
        utilization: {
          overall: 78.5, // percentage
          thisWeek: 82.3,
          lastWeek: 75.8,
        },
        topFacilities: [
          {
            facilityId: 'facility-2',
            facilityName: 'Fitness Studio',
            bookingCount: 45,
            revenue: 12450.00,
          },
          {
            facilityId: 'facility-1',
            facilityName: 'Conference Room A',
            bookingCount: 38,
            revenue: 9875.50,
          },
          {
            facilityId: 'facility-3',
            facilityName: 'Gym',
            bookingCount: 32,
            revenue: 8760.25,
          },
          {
            facilityId: 'facility-6',
            facilityName: 'Party Hall',
            bookingCount: 18,
            revenue: 7320.00,
          },
        ],
      };

      // Simulate loading delay
      setTimeout(() => {
        set({ stats: sampleStats });
      }, 200);
    } catch (error) {
      console.error('Failed to fetch booking stats:', error);
    }
  },

  fetchCalendarEvents: async (startDate: string, endDate: string) => {
    const { calendarView } = get();
    set({ isLoading: true, error: null });

    try {
      // Generate sample calendar events for demonstration
      const sampleEvents: CalendarEvent[] = [
        {
          id: 'evt-1',
          bookingId: 'booking-1',
          title: 'Team Building Session',
          start: new Date(2024, 11, 15, 9, 0), // Dec 15, 2024, 9:00 AM
          end: new Date(2024, 11, 15, 11, 0),   // Dec 15, 2024, 11:00 AM
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerName: 'John Smith',
          status: 'confirmed',
          type: 'event',
          participants: 12,
          color: '#3b82f6', // Blue
        },
        {
          id: 'evt-2',
          bookingId: 'booking-2',
          title: 'Yoga Class',
          start: new Date(2024, 11, 16, 14, 0), // Dec 16, 2024, 2:00 PM
          end: new Date(2024, 11, 16, 15, 30),   // Dec 16, 2024, 3:30 PM
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerName: 'Sarah Johnson',
          status: 'confirmed',
          type: 'regular',
          participants: 8,
          color: '#10b981', // Green
        },
        {
          id: 'evt-3',
          bookingId: 'booking-3',
          title: 'Client Meeting',
          start: new Date(2024, 11, 17, 10, 30), // Dec 17, 2024, 10:30 AM
          end: new Date(2024, 11, 17, 12, 0),    // Dec 17, 2024, 12:00 PM
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerName: 'Michael Brown',
          status: 'pending',
          type: 'regular',
          participants: 5,
          color: '#f59e0b', // Yellow
        },
        {
          id: 'evt-4',
          bookingId: 'booking-4',
          title: 'Equipment Maintenance',
          start: new Date(2024, 11, 18, 8, 0),  // Dec 18, 2024, 8:00 AM
          end: new Date(2024, 11, 18, 10, 0),   // Dec 18, 2024, 10:00 AM
          facilityId: 'facility-3',
          facilityName: 'Gym',
          customerName: 'Maintenance Team',
          status: 'confirmed',
          type: 'maintenance',
          participants: 2,
          color: '#ef4444', // Red
        },
        {
          id: 'evt-5',
          bookingId: 'booking-5',
          title: 'Weekly Training',
          start: new Date(2024, 11, 19, 16, 0), // Dec 19, 2024, 4:00 PM
          end: new Date(2024, 11, 19, 18, 0),   // Dec 19, 2024, 6:00 PM
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerName: 'Emma Davis',
          status: 'confirmed',
          type: 'recurring',
          participants: 15,
          color: '#8b5cf6', // Purple
        },
        {
          id: 'evt-6',
          bookingId: 'booking-6',
          title: 'Board Meeting',
          start: new Date(2024, 11, 20, 9, 0),  // Dec 20, 2024, 9:00 AM
          end: new Date(2024, 11, 20, 11, 30),  // Dec 20, 2024, 11:30 AM
          facilityId: 'facility-4',
          facilityName: 'Boardroom',
          customerName: 'Robert Wilson',
          status: 'confirmed',
          type: 'event',
          participants: 8,
          color: '#3b82f6', // Blue
        },
        {
          id: 'evt-7',
          bookingId: 'booking-7',
          title: 'Photography Workshop',
          start: new Date(2024, 11, 21, 13, 0), // Dec 21, 2024, 1:00 PM
          end: new Date(2024, 11, 21, 16, 0),   // Dec 21, 2024, 4:00 PM
          facilityId: 'facility-5',
          facilityName: 'Art Studio',
          customerName: 'Lisa Martinez',
          status: 'confirmed',
          type: 'event',
          participants: 10,
          color: '#f97316', // Orange
        },
        {
          id: 'evt-8',
          bookingId: 'booking-8',
          title: 'Private Training',
          start: new Date(2024, 11, 22, 7, 0),  // Dec 22, 2024, 7:00 AM
          end: new Date(2024, 11, 22, 8, 0),    // Dec 22, 2024, 8:00 AM
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerName: 'David Lee',
          status: 'confirmed',
          type: 'regular',
          participants: 1,
          color: '#10b981', // Green
        },
        {
          id: 'evt-9',
          bookingId: 'booking-9',
          title: 'Birthday Party',
          start: new Date(2024, 11, 23, 14, 0), // Dec 23, 2024, 2:00 PM
          end: new Date(2024, 11, 23, 18, 0),   // Dec 23, 2024, 6:00 PM
          facilityId: 'facility-6',
          facilityName: 'Party Hall',
          customerName: 'Jennifer Taylor',
          status: 'confirmed',
          type: 'event',
          participants: 25,
          color: '#ec4899', // Pink
        },
        {
          id: 'evt-10',
          bookingId: 'booking-10',
          title: 'Dance Class',
          start: new Date(2024, 11, 24, 19, 0), // Dec 24, 2024, 7:00 PM
          end: new Date(2024, 11, 24, 20, 30),  // Dec 24, 2024, 8:30 PM
          facilityId: 'facility-7',
          facilityName: 'Dance Studio',
          customerName: 'Carlos Rodriguez',
          status: 'pending',
          type: 'regular',
          participants: 12,
          color: '#f59e0b', // Yellow
        },
        // Add more events for different times today and this week
        {
          id: 'evt-today-1',
          bookingId: 'booking-today-1',
          title: 'Morning Workout',
          start: new Date(new Date().setHours(8, 0, 0, 0)),
          end: new Date(new Date().setHours(9, 30, 0, 0)),
          facilityId: 'facility-2',
          facilityName: 'Fitness Studio',
          customerName: 'Alex Johnson',
          status: 'confirmed',
          type: 'regular',
          participants: 1,
          color: '#10b981', // Green
        },
        {
          id: 'evt-today-2',
          bookingId: 'booking-today-2',
          title: 'Project Presentation',
          start: new Date(new Date().setHours(14, 0, 0, 0)),
          end: new Date(new Date().setHours(15, 30, 0, 0)),
          facilityId: 'facility-1',
          facilityName: 'Conference Room A',
          customerName: 'Tech Team',
          status: 'confirmed',
          type: 'event',
          participants: 8,
          color: '#3b82f6', // Blue
        },
        {
          id: 'evt-tomorrow-1',
          bookingId: 'booking-tomorrow-1',
          title: 'Swimming Lesson',
          start: new Date(new Date(Date.now() + 24 * 60 * 60 * 1000).setHours(16, 0, 0, 0)),
          end: new Date(new Date(Date.now() + 24 * 60 * 60 * 1000).setHours(17, 0, 0, 0)),
          facilityId: 'facility-8',
          facilityName: 'Swimming Pool',
          customerName: 'Amanda White',
          status: 'confirmed',
          type: 'regular',
          participants: 4,
          color: '#06b6d4', // Cyan
        },
      ];

      // Filter events based on date range and facility filters
      const filteredEvents = sampleEvents.filter(event => {
        const eventDate = new Date(event.start);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check date range
        const isInRange = eventDate >= start && eventDate <= end;

        // Check facility filter
        const facilityMatch = calendarView.selectedFacilities.length === 0 ||
          calendarView.selectedFacilities.includes(event.facilityId);

        // Check status filters
        const statusMatch = (calendarView.showCancelled || event.status !== 'cancelled') &&
          (calendarView.showCompleted || event.status !== 'completed');

        return isInRange && facilityMatch && statusMatch;
      });

      // Simulate loading delay
      setTimeout(() => {
        set({ calendarEvents: filteredEvents, isLoading: false });
      }, 500);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
    }
  },

  fetchFacilityAvailability: async (facilityId: string, startDate: string, endDate: string) => {
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`/api/facilities/${facilityId}/availability?${params}`);
      const availability = await response.json();

      if (!response.ok) {
        throw new Error(availability.error || 'Failed to fetch availability');
      }

      get().setFacilityAvailability(facilityId, availability);
    } catch (error) {
      console.error('Failed to fetch facility availability:', error);
    }
  },

  createBooking: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const booking = await response.json();

      if (!response.ok) {
        throw new Error(booking.error || 'Failed to create booking');
      }

      // Optimistic update
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isLoading: false,
      }));

      return booking;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  updateBooking: async (id, data: Partial<BookingFormData> | Partial<Booking>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const updatedBooking = await response.json();

      if (!response.ok) {
        throw new Error(updatedBooking.error || 'Failed to update booking');
      }

      // Update in state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? updatedBooking : b
        ),
        selectedBooking: state.selectedBooking?.id === id ? updatedBooking : state.selectedBooking,
        isLoading: false,
      }));

      return updatedBooking;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete booking');
      }

      // Remove from state
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
        selectedBooking: state.selectedBooking?.id === id ? null : state.selectedBooking,
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

  getBookingById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${id}`);
      const booking = await response.json();

      if (!response.ok) {
        throw new Error(booking.error || 'Failed to fetch booking');
      }

      set({ selectedBooking: booking, isLoading: false });
      return booking;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  // Booking Management Operations
  confirmBooking: async (id) => {
    await get().updateBooking(id, { status: 'confirmed' });
  },

  cancelBooking: async (id, reason) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const updatedBooking = await response.json();

      if (!response.ok) {
        throw new Error(updatedBooking.error || 'Failed to cancel booking');
      }

      // Update in state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? updatedBooking : b
        ),
        selectedBooking: state.selectedBooking?.id === id ? updatedBooking : state.selectedBooking,
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

  completeBooking: async (id) => {
    await get().updateBooking(id, { status: 'completed' });
  },

  markNoShow: async (id) => {
    await get().updateBooking(id, { status: 'no_show' });
  },

  rescheduleBooking: async (id, newStartTime, newEndTime) => {
    await get().updateBooking(id, {
      startTime: newStartTime,
      endTime: newEndTime
    });
  },

  // Availability Operations
  checkAvailability: async (facilityId, startTime, endTime, excludeBookingId) => {
    try {
      const params = new URLSearchParams({
        facilityId,
        startTime,
        endTime,
        ...(excludeBookingId && { excludeBookingId }),
      });

      const response = await fetch(`/api/bookings/check-availability?${params}`);
      const validation = await response.json();

      if (!response.ok) {
        throw new Error(validation.error || 'Failed to check availability');
      }

      return validation;
    } catch (error) {
      throw error;
    }
  },

  getAvailableTimeSlots: async (facilityId, date) => {
    try {
      const response = await fetch(`/api/facilities/${facilityId}/time-slots?date=${date}`);
      const timeSlots = await response.json();

      if (!response.ok) {
        throw new Error(timeSlots.error || 'Failed to fetch time slots');
      }

      return timeSlots;
    } catch (error) {
      throw error;
    }
  },

  blockTimeSlot: async (facilityId, startTime, endTime, reason) => {
    try {
      const response = await fetch(`/api/facilities/${facilityId}/block-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime, endTime, reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to block time slot');
      }
    } catch (error) {
      throw error;
    }
  },

  unblockTimeSlot: async (facilityId, startTime, endTime) => {
    try {
      const response = await fetch(`/api/facilities/${facilityId}/unblock-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime, endTime }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unblock time slot');
      }
    } catch (error) {
      throw error;
    }
  },

  // Utility actions
  clearFilters: () => set({ filters: defaultFilters }),
  resetState: () => set({
    bookings: [],
    selectedBooking: null,
    filters: defaultFilters,
    pagination: defaultPagination,
    stats: null,
    calendarEvents: [],
    calendarView: defaultCalendarView,
    facilityAvailability: {},
    isLoading: false,
    error: null,
  }),

  refreshData: async () => {
    const { fetchBookings, fetchBookingStats } = get();
    await Promise.all([
      fetchBookings(),
      fetchBookingStats(),
    ]);
  },
}));

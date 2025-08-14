import { create } from 'zustand';
import {
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
} from '@/lib/types/booking';

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
  updateBooking: (id: string, data: Partial<BookingFormData>) => Promise<Booking>;
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
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.facilityId && { facilityId: filters.facilityId }),
        ...(filters.customerId && { customerId: filters.customerId }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.type && filters.type !== 'all' && { type: filters.type }),
        ...(filters.paymentStatus && filters.paymentStatus !== 'all' && { paymentStatus: filters.paymentStatus }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.source && filters.source !== 'all' && { source: filters.source }),
      });

      const response = await fetch(`/api/bookings?${params}`);

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      set({
        bookings: data.bookings,
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

  fetchBookingStats: async () => {
    try {
      const response = await fetch('/api/bookings/stats');
      const stats = await response.json();

      if (!response.ok) {
        throw new Error(stats.error || 'Failed to fetch booking stats');
      }

      set({ stats });
    } catch (error) {
      console.error('Failed to fetch booking stats:', error);
    }
  },

  fetchCalendarEvents: async (startDate: string, endDate: string) => {
    const { calendarView } = get();
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(calendarView.selectedFacilities.length > 0 && {
          facilities: calendarView.selectedFacilities.join(',')
        }),
        showCancelled: calendarView.showCancelled.toString(),
        showCompleted: calendarView.showCompleted.toString(),
      });

      const response = await fetch(`/api/bookings/calendar?${params}`);
      const events = await response.json();

      if (!response.ok) {
        throw new Error(events.error || 'Failed to fetch calendar events');
      }

      set({ calendarEvents: events, isLoading: false });
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

  updateBooking: async (id, data) => {
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

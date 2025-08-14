import { create } from 'zustand';
import { Facility, FacilityFilters, FacilityFormData, PaginationInfo } from '@/lib/types/facility';

interface FacilityStore {
  // State
  facilities: Facility[];
  selectedFacility: Facility | null;
  filters: FacilityFilters;
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;

  // Actions
  setFacilities: (facilities: Facility[]) => void;
  setSelectedFacility: (facility: Facility | null) => void;
  setFilters: (filters: Partial<FacilityFilters>) => void;
  setPagination: (pagination: Partial<PaginationInfo>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD Operations
  fetchFacilities: () => Promise<void>;
  createFacility: (data: FacilityFormData) => Promise<Facility>;
  updateFacility: (id: string, data: Partial<FacilityFormData>) => Promise<Facility>;
  deleteFacility: (id: string) => Promise<void>;
  getFacilityById: (id: string) => Promise<Facility>;

  // Utility actions
  clearFilters: () => void;
  resetState: () => void;
}

const defaultFilters: FacilityFilters = {
  search: '',
  type: 'all',
  status: 'all',
  location: '',
};

const defaultPagination: PaginationInfo = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

export const useFacilityStore = create<FacilityStore>((set, get) => ({
  // Initial state
  facilities: [],
  selectedFacility: null,
  filters: defaultFilters,
  pagination: defaultPagination,
  isLoading: false,
  error: null,

  // Basic setters
  setFacilities: (facilities) => set({ facilities }),
  setSelectedFacility: (facility) => set({ selectedFacility: facility }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    })),
  setPagination: (newPagination) =>
    set((state) => ({ pagination: { ...state.pagination, ...newPagination } })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // CRUD Operations
  fetchFacilities: async () => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.type && filters.type !== 'all' && { type: filters.type }),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.location && { location: filters.location }),
      });

      const response = await fetch(`/api/facilities?${params}`);

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch facilities');
      }

      set({
        facilities: data.facilities,
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

  createFacility: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const facility = await response.json();

      if (!response.ok) {
        throw new Error(facility.error || 'Failed to create facility');
      }

      // Optimistic update
      set((state) => ({
        facilities: [facility, ...state.facilities],
        isLoading: false,
      }));

      return facility;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  updateFacility: async (id, data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const updatedFacility = await response.json();

      if (!response.ok) {
        throw new Error(updatedFacility.error || 'Failed to update facility');
      }

      // Update in state
      set((state) => ({
        facilities: state.facilities.map((f) =>
          f.id === id ? updatedFacility : f
        ),
        selectedFacility: state.selectedFacility?.id === id ? updatedFacility : state.selectedFacility,
        isLoading: false,
      }));

      return updatedFacility;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFacility: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete facility');
      }

      // Remove from state
      set((state) => ({
        facilities: state.facilities.filter((f) => f.id !== id),
        selectedFacility: state.selectedFacility?.id === id ? null : state.selectedFacility,
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

  getFacilityById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/facilities/${id}`);
      const facility = await response.json();

      if (!response.ok) {
        throw new Error(facility.error || 'Failed to fetch facility');
      }

      set({ selectedFacility: facility, isLoading: false });
      return facility;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false,
      });
      throw error;
    }
  },

  // Utility actions
  clearFilters: () => set({ filters: defaultFilters }),
  resetState: () => set({
    facilities: [],
    selectedFacility: null,
    filters: defaultFilters,
    pagination: defaultPagination,
    isLoading: false,
    error: null,
  }),
}));

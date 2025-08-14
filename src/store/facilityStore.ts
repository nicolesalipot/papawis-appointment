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
      // Generate sample facility data for demonstration
      const sampleFacilities: Facility[] = [
        {
          id: 'facility-1',
          name: 'Center Court Tennis',
          description: 'Professional tennis court with high-quality artificial grass surface and excellent lighting for day and evening play.',
          type: 'tennis_court',
          location: 'Sports Complex A, Court 1',
          capacity: 4,
          pricePerHour: 85,
          amenities: ['Professional Lighting', 'Equipment Rental', 'Locker Rooms', 'Wifi', 'Parking', 'Accessibility'],
          coordinates: { lat: 40.7831, lng: -73.9712 },
          operatingHours: {
            monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
            sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
          },
          images: [
            {
              id: 'img-1',
              url: 'https://images.unsplash.com/photo-1554068292-f8b3aab1ab4b?w=800&h=600&fit=crop',
              alt: 'Tennis court overview',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-2',
          name: 'Olympic Basketball Court',
          description: 'Regulation size basketball court with professional hardwood flooring and adjustable hoops.',
          type: 'basketball_court',
          location: 'Sports Complex B, Gym 1',
          capacity: 15,
          pricePerHour: 120,
          amenities: ['Sound System', 'Scoreboard', 'Air Conditioning', 'Locker Rooms', 'Wifi', 'Parking'],
          coordinates: { lat: 40.7814, lng: -73.9776 },
          operatingHours: {
            monday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
            tuesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
            wednesday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
            thursday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
            friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
            saturday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
            sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
          },
          images: [
            {
              id: 'img-2',
              url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
              alt: 'Basketball court interior',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-3',
          name: 'Aquatic Center Pool',
          description: 'Olympic-size swimming pool with 8 lanes, perfect for competitive swimming and training.',
          type: 'swimming_pool',
          location: 'Aquatic Center, Main Pool',
          capacity: 50,
          pricePerHour: 200,
          amenities: ['Lane Ropes', 'Starting Blocks', 'Diving Boards', 'Pool Side Seating', 'Changing Rooms', 'Wifi'],
          coordinates: { lat: 40.7789, lng: -73.9441 },
          operatingHours: {
            monday: { isOpen: true, openTime: '05:00', closeTime: '22:00' },
            tuesday: { isOpen: true, openTime: '05:00', closeTime: '22:00' },
            wednesday: { isOpen: true, openTime: '05:00', closeTime: '22:00' },
            thursday: { isOpen: true, openTime: '05:00', closeTime: '22:00' },
            friday: { isOpen: true, openTime: '05:00', closeTime: '22:00' },
            saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
            sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          },
          images: [
            {
              id: 'img-3',
              url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
              alt: 'Swimming pool lanes',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-4',
          name: 'Fitness & Wellness Gym',
          description: 'State-of-the-art fitness facility with modern equipment, free weights, and cardio machines.',
          type: 'gym',
          location: 'Wellness Center, Floor 2',
          capacity: 30,
          pricePerHour: 45,
          amenities: ['Cardio Machines', 'Free Weights', 'Weight Machines', 'Mirror Walls', 'Air Conditioning', 'Towel Service'],
          coordinates: { lat: 40.7505, lng: -73.9934 },
          operatingHours: {
            monday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
            tuesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
            wednesday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
            thursday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
            friday: { isOpen: true, openTime: '05:00', closeTime: '23:00' },
            saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
            sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          },
          images: [
            {
              id: 'img-4',
              url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
              alt: 'Modern gym equipment',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-5',
          name: 'Championship Football Field',
          description: 'Full-size football field with natural grass and stadium seating for competitive matches.',
          type: 'football_field',
          location: 'Stadium Complex, Main Field',
          capacity: 22,
          pricePerHour: 300,
          amenities: ['Stadium Lighting', 'Natural Grass', 'Goal Posts', 'Team Benches', 'Scoreboard', 'Spectator Seating'],
          coordinates: { lat: 40.7282, lng: -74.0776 },
          operatingHours: {
            monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
            saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
            sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
          },
          images: [
            {
              id: 'img-5',
              url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
              alt: 'Football field with stadium',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'maintenance',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-6',
          name: 'Squash Court Alpha',
          description: 'Professional squash court with glass back wall for spectators and premium playing surface.',
          type: 'squash_court',
          location: 'Racquet Sports Center, Court A',
          capacity: 2,
          pricePerHour: 65,
          amenities: ['Glass Back Wall', 'Professional Flooring', 'Equipment Rental', 'Air Conditioning', 'Viewing Area'],
          coordinates: { lat: 40.7580, lng: -73.9855 },
          operatingHours: {
            monday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
            tuesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
            wednesday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
            thursday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
            friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
            saturday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
            sunday: { isOpen: false, openTime: '09:00', closeTime: '19:00' },
          },
          images: [
            {
              id: 'img-6',
              url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
              alt: 'Professional squash court',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-7',
          name: 'Volleyball Court Premier',
          description: 'Professional volleyball court with high-quality sand surface perfect for beach volleyball or indoor play.',
          type: 'volleyball_court',
          location: 'Sports Complex C, Court 1',
          capacity: 12,
          pricePerHour: 75,
          amenities: ['Professional Net', 'Sand Court', 'Flood Lighting', 'Spectator Seating', 'Equipment Storage', 'Wifi'],
          coordinates: { lat: 40.7614, lng: -73.9776 },
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
              id: 'img-7',
              url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop',
              alt: 'Volleyball court with sand',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-8',
          name: 'Track & Field Arena',
          description: 'Professional athletics track with field events area, perfect for running, jumping, and throwing sports.',
          type: 'track_field',
          location: 'Athletic Center, Main Track',
          capacity: 100,
          pricePerHour: 150,
          amenities: ['400m Track', 'Field Events Area', 'Stadium Seating', 'Timing System', 'Equipment Storage', 'Parking'],
          coordinates: { lat: 40.7549, lng: -73.9840 },
          operatingHours: {
            monday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
            tuesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
            wednesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
            thursday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
            friday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
            saturday: { isOpen: true, openTime: '07:00', closeTime: '19:00' },
            sunday: { isOpen: true, openTime: '07:00', closeTime: '19:00' },
          },
          images: [
            {
              id: 'img-8',
              url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
              alt: 'Professional athletics track',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'facility-9',
          name: 'Badminton Court Elite',
          description: 'Professional badminton court with competition-grade flooring and excellent ventilation system.',
          type: 'badminton_court',
          location: 'Racquet Sports Center, Court B',
          capacity: 4,
          pricePerHour: 55,
          amenities: ['Professional Nets', 'Competition Flooring', 'Air Conditioning', 'Equipment Rental', 'Spectator Area', 'Parking'],
          coordinates: { lat: 40.7484, lng: -73.9857 },
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
              id: 'img-9',
              url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop',
              alt: 'Professional badminton court',
              isPrimary: true,
              uploadedAt: '2024-01-01T00:00:00Z'
            }
          ],
          status: 'active',
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      // Apply filters and pagination
      let filteredFacilities = sampleFacilities.filter(facility => {
        const searchMatch = !filters.search ||
          facility.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          facility.description.toLowerCase().includes(filters.search.toLowerCase());
        const typeMatch = !filters.type || filters.type === 'all' || facility.type === filters.type;
        const statusMatch = !filters.status || filters.status === 'all' || facility.status === filters.status;
        return searchMatch && typeMatch && statusMatch;
      });

      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const paginatedFacilities = filteredFacilities.slice(startIndex, startIndex + pagination.pageSize);
      const paginationInfo = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: filteredFacilities.length,
        totalPages: Math.ceil(filteredFacilities.length / pagination.pageSize),
      };

      setTimeout(() => {
        set({
          facilities: paginatedFacilities,
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

  createFacility: async (data) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new facility object
      const newFacility: Facility = {
        id: `facility-${Date.now()}`,
        name: data.name,
        type: data.type,
        capacity: data.capacity,
        location: data.location,
        description: data.description,
        operatingHours: data.operatingHours,
        images: data.images ? data.images.map((file, index) => ({
          id: `img-${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          alt: `${data.name} image ${index + 1}`,
          isPrimary: index === 0,
          uploadedAt: new Date().toISOString(),
        })) : [],
        status: 'active',
        amenities: data.amenities,
        pricePerHour: data.pricePerHour,
        createdBy: 'current-user',
        updatedBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to state
      set((state) => ({
        facilities: [newFacility, ...state.facilities],
        isLoading: false,
      }));

      return newFacility;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const state = get();
      const existingFacility = state.facilities.find(f => f.id === id);

      if (!existingFacility) {
        throw new Error('Facility not found');
      }

      const updatedFacility: Facility = {
        ...existingFacility,
        ...data,
        updatedBy: 'current-user',
        updatedAt: new Date().toISOString(),
      };

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

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

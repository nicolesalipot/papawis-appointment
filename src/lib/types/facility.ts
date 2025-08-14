export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  capacity: number;
  location: string;
  description: string;
  operatingHours: OperatingHours;
  images: FacilityImage[];
  status: FacilityStatus;
  amenities: string[];
  pricePerHour?: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format;
}

export type FacilityType =
  | 'tennis_court'
  | 'basketball_court'
  | 'volleyball_court'
  | 'swimming_pool'
  | 'football_field'
  | 'gym'
  | 'squash_court'
  | 'badminton_court'
  | 'track_field'
  | 'other';

export type FacilityStatus = 'active' | 'inactive' | 'maintenance' | 'closed';

export interface FacilityFilters {
  search?: string;
  type?: FacilityType | 'all';
  status?: FacilityStatus | 'all';
  location?: string;
  minCapacity?: number;
  maxCapacity?: number;
}

export interface FacilityFormData {
  name: string;
  type: FacilityType;
  capacity: number;
  location: string;
  description: string;
  operatingHours: OperatingHours;
  amenities: string[];
  pricePerHour?: number;
  images?: File[];
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FacilityListResponse {
  facilities: Facility[];
  pagination: PaginationInfo;
  filters: FacilityFilters;
}

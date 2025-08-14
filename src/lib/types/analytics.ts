export interface BookingAnalytics {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  pendingBookings: number;
  noShowBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  conversionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  previousMonthRevenue: number;
  revenueGrowth: number;
  averageRevenuePerBooking: number;
  averageRevenuePerUser: number;
  projectedMonthlyRevenue: number;
}

export interface FacilityAnalytics {
  facilityId: string;
  facilityName: string;
  totalBookings: number;
  totalRevenue: number;
  utilizationRate: number;
  averageBookingDuration: number;
  peakHours: string[];
  popularDays: string[];
  averageRating: number;
  capacityUtilization: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  churnRate: number;
  averageBookingsPerUser: number;
  averageLifetimeValue: number;
  topCustomers: TopCustomer[];
  userGrowthRate: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  membershipType?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface ChartData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

export interface PeakHourData {
  hour: string;
  bookings: number;
  revenue: number;
  utilization: number;
}

export interface DateRangeAnalytics {
  startDate: string;
  endDate: string;
  bookings: BookingAnalytics;
  revenue: RevenueAnalytics;
  facilities: FacilityAnalytics[];
  users: UserAnalytics;
  timeSeriesData: {
    bookings: TimeSeriesData[];
    revenue: TimeSeriesData[];
    users: TimeSeriesData[];
  };
  peakHours: PeakHourData[];
  topFacilities: FacilityAnalytics[];
  monthlyComparison: {
    currentMonth: BookingAnalytics;
    previousMonth: BookingAnalytics;
    yearOverYear: BookingAnalytics;
  };
}

export interface AnalyticsFilters {
  dateRange: {
    startDate: string;
    endDate: string;
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  };
  facilityIds: string[];
  userTypes: string[];
  bookingTypes: string[];
  bookingStatuses: string[];
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dataType: 'bookings' | 'revenue' | 'facilities' | 'users' | 'all';
  includeCharts: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'progress';
  size: 'small' | 'medium' | 'large';
  data: any;
  refreshInterval?: number;
  isLoading?: boolean;
  error?: string;
}

export interface AnalyticsStore {
  // Data
  bookingAnalytics: BookingAnalytics | null;
  revenueAnalytics: RevenueAnalytics | null;
  facilityAnalytics: FacilityAnalytics[];
  userAnalytics: UserAnalytics | null;
  dateRangeAnalytics: DateRangeAnalytics | null;

  // Charts data
  bookingTrends: TimeSeriesData[];
  revenueTrends: TimeSeriesData[];
  facilityPerformance: ChartData[];
  userGrowth: TimeSeriesData[];
  peakHoursData: PeakHourData[];

  // UI State
  filters: AnalyticsFilters;
  selectedDateRange: { startDate: string; endDate: string };
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Dashboard
  dashboardWidgets: DashboardWidget[];

  // Actions
  fetchAnalytics: (filters?: Partial<AnalyticsFilters>) => Promise<void>;
  fetchBookingAnalytics: () => Promise<void>;
  fetchRevenueAnalytics: () => Promise<void>;
  fetchFacilityAnalytics: () => Promise<void>;
  fetchUserAnalytics: () => Promise<void>;
  fetchDateRangeAnalytics: (startDate: string, endDate: string) => Promise<void>;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  exportData: (options: ExportOptions) => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

// Utility types for chart configurations
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'composed';
  title: string;
  xAxisKey: string;
  yAxisKey?: string;
  dataKey: string | string[];
  colors: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  responsive?: boolean;
}

export interface MetricCard {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ComponentType;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
  description?: string;
}

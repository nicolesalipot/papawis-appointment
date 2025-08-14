import { create } from "zustand";
import {
  AnalyticsStore,
  BookingAnalytics,
  RevenueAnalytics,
  FacilityAnalytics,
  UserAnalytics,
  DateRangeAnalytics,
  TimeSeriesData,
  ChartData,
  PeakHourData,
  AnalyticsFilters,
  ExportOptions,
  DashboardWidget
} from "@/lib/types/analytics";

const defaultFilters: AnalyticsFilters = {
  dateRange: {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    preset: 'month'
  },
  facilityIds: [],
  userTypes: [],
  bookingTypes: [],
  bookingStatuses: []
};

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  // Data state
  bookingAnalytics: null,
  revenueAnalytics: null,
  facilityAnalytics: [],
  userAnalytics: null,
  dateRangeAnalytics: null,

  // Charts data
  bookingTrends: [],
  revenueTrends: [],
  facilityPerformance: [],
  userGrowth: [],
  peakHoursData: [],

  // UI State
  filters: defaultFilters,
  selectedDateRange: {
    startDate: defaultFilters.dateRange.startDate,
    endDate: defaultFilters.dateRange.endDate
  },
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Dashboard
  dashboardWidgets: [],

  // Actions
  fetchAnalytics: async (filters) => {
    const state = get();
    set({ isLoading: true, error: null });

    try {
      const updatedFilters = { ...state.filters, ...filters };

      // Fetch all analytics data with individual error handling
      const results = await Promise.allSettled([
        state.fetchBookingAnalytics().catch(err => {
          console.error("Booking analytics failed:", err);
          throw err;
        }),
        state.fetchRevenueAnalytics().catch(err => {
          console.error("Revenue analytics failed:", err);
          throw err;
        }),
        state.fetchFacilityAnalytics().catch(err => {
          console.error("Facility analytics failed:", err);
          throw err;
        }),
        state.fetchUserAnalytics().catch(err => {
          console.error("User analytics failed:", err);
          throw err;
        })
      ]);

      // Check if any requests failed
      const failedResults = results.filter(result => result.status === 'rejected');
      if (failedResults.length > 0) {
        const firstError = failedResults[0] as PromiseRejectedResult;
        throw new Error(`Analytics fetch failed: ${firstError.reason}`);
      }

      set({
        filters: updatedFilters,
        lastUpdated: new Date().toISOString(),
        isLoading: false
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch analytics",
        isLoading: false
      });
    }
  },

  fetchBookingAnalytics: async () => {
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        facilityIds: filters.facilityIds.join(','),
        bookingTypes: filters.bookingTypes.join(','),
        bookingStatuses: filters.bookingStatuses.join(',')
      });

      const response = await fetch(`/api/analytics/bookings?${params}`);
      if (!response.ok) throw new Error("Failed to fetch booking analytics");

      const data: BookingAnalytics = await response.json();
      set({ bookingAnalytics: data });
    } catch (error) {
      console.error("Error fetching booking analytics:", error);
      throw error;
    }
  },

  fetchRevenueAnalytics: async () => {
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        facilityIds: filters.facilityIds.join(',')
      });

      const response = await fetch(`/api/analytics/revenue?${params}`);
      if (!response.ok) throw new Error("Failed to fetch revenue analytics");

      const data: RevenueAnalytics = await response.json();

      // Also fetch revenue trends
      const trendsResponse = await fetch(`/api/analytics/revenue/trends?${params}`);
      const trendsData: TimeSeriesData[] = trendsResponse.ok ? await trendsResponse.json() : [];

      set({
        revenueAnalytics: data,
        revenueTrends: trendsData
      });
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      throw error;
    }
  },

  fetchFacilityAnalytics: async () => {
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        facilityIds: filters.facilityIds.join(',')
      });

      const response = await fetch(`/api/analytics/facilities?${params}`);
      if (!response.ok) throw new Error("Failed to fetch facility analytics");

      const data: FacilityAnalytics[] = await response.json();

      // Convert to chart data for performance visualization
      const performanceData: ChartData[] = data.map(facility => ({
        name: facility.facilityName,
        value: facility.totalRevenue,
        percentage: facility.utilizationRate,
        trend: facility.utilizationRate > 70 ? 'up' : facility.utilizationRate > 40 ? 'stable' : 'down'
      }));

      set({
        facilityAnalytics: data,
        facilityPerformance: performanceData
      });
    } catch (error) {
      console.error("Error fetching facility analytics:", error);
      throw error;
    }
  },

  fetchUserAnalytics: async () => {
    try {
      const { filters } = get();
      const params = new URLSearchParams({
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate,
        userTypes: filters.userTypes.join(',')
      });

      const response = await fetch(`/api/analytics/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch user analytics");

      const data: UserAnalytics = await response.json();

      // Also fetch user growth trends
      const growthResponse = await fetch(`/api/analytics/users/growth?${params}`);
      const growthData: TimeSeriesData[] = growthResponse.ok ? await growthResponse.json() : [];

      set({
        userAnalytics: data,
        userGrowth: growthData
      });
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      throw error;
    }
  },

  fetchDateRangeAnalytics: async (startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams({
        startDate,
        endDate
      });

      const response = await fetch(`/api/analytics/date-range?${params}`);
      if (!response.ok) throw new Error("Failed to fetch date range analytics");

      const data: DateRangeAnalytics = await response.json();

      // Also fetch booking trends for the date range
      const trendsResponse = await fetch(`/api/analytics/bookings/trends?${params}`);
      const bookingTrendsData: TimeSeriesData[] = trendsResponse.ok ? await trendsResponse.json() : [];

      // Fetch peak hours data
      const peakHoursResponse = await fetch(`/api/analytics/peak-hours?${params}`);
      const peakHoursData: PeakHourData[] = peakHoursResponse.ok ? await peakHoursResponse.json() : [];

      set({
        dateRangeAnalytics: data,
        bookingTrends: bookingTrendsData,
        peakHoursData,
        selectedDateRange: { startDate, endDate },
        lastUpdated: new Date().toISOString(),
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch date range analytics",
        isLoading: false
      });
    }
  },

  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
  },

  setDateRange: (startDate: string, endDate: string) => {
    const currentFilters = get().filters;
    const updatedFilters = {
      ...currentFilters,
      dateRange: {
        ...currentFilters.dateRange,
        startDate,
        endDate,
        preset: 'custom'
      }
    };

    set({
      filters: updatedFilters,
      selectedDateRange: { startDate, endDate }
    });
  },

  exportData: async (options: ExportOptions) => {
    try {
      const params = new URLSearchParams({
        format: options.format,
        dataType: options.dataType,
        includeCharts: options.includeCharts.toString(),
        startDate: options.dateRange.startDate,
        endDate: options.dateRange.endDate
      });

      const response = await fetch(`/api/analytics/export?${params}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error("Failed to export data");

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filename = `analytics-${options.dataType}-${new Date().toISOString().split('T')[0]}.${options.format}`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  },

  refreshDashboard: async () => {
    const { fetchAnalytics, filters } = get();
    await fetchAnalytics(filters);
  }
}));

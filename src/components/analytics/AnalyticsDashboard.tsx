import { useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Clock,
  BarChart3,
  Download,
} from "lucide-react";
import { useAnalyticsStore } from "@/store/analyticsStore";
import {
  MetricCard,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
} from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function AnalyticsDashboard() {
  const {
    bookingAnalytics,
    revenueAnalytics,
    facilityAnalytics,
    userAnalytics,
    bookingTrends,
    revenueTrends,
    facilityPerformance,
    userGrowth,
    peakHoursData,
    isLoading,
    error,
    lastUpdated,

    exportData,
  } = useAnalyticsStore();

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      await exportData({
        format,
        dataType: "all",
        includeCharts: format === "pdf",
        dateRange: {
          startDate: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        },
      });
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-destructive text-lg font-medium">
          Failed to load analytics data
        </div>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  // Prepare chart data
  const bookingStatusData = bookingAnalytics
    ? [
        {
          name: "Confirmed",
          value: bookingAnalytics.confirmedBookings,
          color: "#10b981",
        },
        {
          name: "Pending",
          value: bookingAnalytics.pendingBookings,
          color: "#f59e0b",
        },
        {
          name: "Cancelled",
          value: bookingAnalytics.cancelledBookings,
          color: "#ef4444",
        },
        {
          name: "Completed",
          value: bookingAnalytics.completedBookings,
          color: "#8b5cf6",
        },
        {
          name: "No Show",
          value: bookingAnalytics.noShowBookings,
          color: "#6b7280",
        },
      ]
    : [];

  const facilityRevenueData = facilityAnalytics.map((facility) => ({
    name: facility.facilityName,
    revenue: facility.totalRevenue,
    utilization: facility.utilizationRate,
    bookings: facility.totalBookings,
  }));

  const topFacilitiesData = facilityAnalytics
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map((facility) => ({
      name:
        facility.facilityName.length > 12
          ? facility.facilityName.substring(0, 12) + "..."
          : facility.facilityName,
      value: facility.totalRevenue,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your facility management performance
          </p>
          {lastUpdated && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <MetricCard
              title="Total Bookings"
              value={bookingAnalytics?.totalBookings || 0}
              change={
                bookingAnalytics
                  ? (bookingAnalytics.confirmedBookings /
                      bookingAnalytics.totalBookings) *
                      100 -
                    80
                  : 0
              }
              trend="up"
              icon={Calendar}
              color="blue"
              description="Total bookings this period"
            />

            <MetricCard
              title="Total Revenue"
              value={revenueAnalytics?.totalRevenue || 0}
              change={revenueAnalytics?.revenueGrowth || 0}
              trend={
                revenueAnalytics && revenueAnalytics.revenueGrowth > 0
                  ? "up"
                  : "down"
              }
              icon={DollarSign}
              color="green"
              format="currency"
              description="Revenue generated this period"
            />

            <MetricCard
              title="Active Users"
              value={userAnalytics?.activeUsers || 0}
              change={userAnalytics?.userGrowthRate || 0}
              trend="up"
              icon={Users}
              color="purple"
              description="Currently active users"
            />

            <MetricCard
              title="Avg. Utilization"
              value={
                facilityAnalytics.length > 0
                  ? facilityAnalytics.reduce(
                      (sum, f) => sum + f.utilizationRate,
                      0
                    ) / facilityAnalytics.length
                  : 0
              }
              change={5.2}
              trend="up"
              icon={BarChart3}
              color="orange"
              format="percentage"
              description="Average facility utilization rate"
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <LineChart
            title="Booking Trends"
            data={bookingTrends}
            xAxisKey="date"
            lines={[
              {
                dataKey: "value",
                name: "Daily Bookings",
                color: "hsl(var(--primary))",
              },
            ]}
            height={320}
          />
        )}

        {/* Revenue Trends */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <AreaChart
            title="Revenue Trends"
            data={revenueTrends}
            xAxisKey="date"
            areas={[
              {
                dataKey: "value",
                name: "Daily Revenue",
                color: "#10b981",
              },
            ]}
            height={320}
          />
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Distribution */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <PieChart
            title="Booking Status Distribution"
            data={bookingStatusData}
            height={320}
            showLabels={true}
          />
        )}

        {/* Top Facilities by Revenue */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <BarChart
            title="Top Facilities by Revenue"
            data={topFacilitiesData}
            xAxisKey="name"
            bars={[
              {
                dataKey: "value",
                name: "Revenue",
                color: "hsl(var(--primary))",
              },
            ]}
            height={320}
            orientation="vertical"
          />
        )}

        {/* User Growth */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <LineChart
            title="User Growth"
            data={userGrowth}
            xAxisKey="date"
            lines={[
              {
                dataKey: "value",
                name: "Total Users",
                color: "#8b5cf6",
              },
            ]}
            height={320}
          />
        )}
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Analysis */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <BarChart
            title="Peak Hours Analysis"
            data={peakHoursData}
            xAxisKey="hour"
            bars={[
              {
                dataKey: "bookings",
                name: "Bookings",
                color: "#3b82f6",
              },
              {
                dataKey: "utilization",
                name: "Utilization %",
                color: "#10b981",
              },
            ]}
            height={320}
          />
        )}

        {/* Facility Performance Comparison */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <BarChart
            title="Facility Performance"
            data={facilityRevenueData}
            xAxisKey="name"
            bars={[
              {
                dataKey: "revenue",
                name: "Revenue",
                color: "#10b981",
              },
              {
                dataKey: "utilization",
                name: "Utilization %",
                color: "#f59e0b",
              },
            ]}
            height={320}
          />
        )}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Performers */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Top Performing Facilities
              </h4>
              <div className="space-y-2">
                {facilityAnalytics
                  .sort((a, b) => b.utilizationRate - a.utilizationRate)
                  .slice(0, 3)
                  .map((facility, index) => (
                    <div
                      key={facility.facilityId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-600"
                          }`}
                        />
                        <span className="text-sm text-foreground">
                          {facility.facilityName}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {facility.utilizationRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Key Insights */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Key Insights
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Peak booking time: 6:00 PM - 8:00 PM</div>
                <div>• Most popular day: Wednesday</div>
                <div>• Average booking duration: 1.5 hours</div>
                <div>
                  • Conversion rate:{" "}
                  {bookingAnalytics?.conversionRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Financial Overview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue:</span>
                  <span className="font-medium text-foreground">
                    ${revenueAnalytics?.totalRevenue.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Avg. Booking Value:
                  </span>
                  <span className="font-medium text-foreground">
                    ${bookingAnalytics?.averageBookingValue.toFixed(2) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Growth:</span>
                  <span
                    className={`font-medium ${
                      revenueAnalytics && revenueAnalytics.revenueGrowth > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {revenueAnalytics?.revenueGrowth > 0 ? "+" : ""}
                    {revenueAnalytics?.revenueGrowth.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

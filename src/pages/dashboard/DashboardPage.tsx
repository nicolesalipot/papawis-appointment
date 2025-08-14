import {
  BarChart3,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/charts/MetricCard";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import {
  dashboardStats,
  getRecentBookings,
  getCurrentlyOccupiedFacilities,
  sampleFacilities,
} from "@/lib/sampleData";
import { BOOKING_STATUS_CONFIG } from "@/lib/types/booking";

const recentBookings = getRecentBookings(6);
const facilitiesWithStatus = getCurrentlyOccupiedFacilities();

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Bookings Today"
          value={dashboardStats.totalBookingsToday}
          change={dashboardStats.totalBookingsTodayChange}
          trend="up"
          icon={Calendar}
          color="blue"
          description="from last week"
        />
        <MetricCard
          title="Active Facilities"
          value={dashboardStats.activeFacilities}
          change={dashboardStats.activeFacilitiesChange}
          trend="up"
          icon={Building2}
          color="green"
          description="new this week"
        />
        <MetricCard
          title="Total Users"
          value={dashboardStats.totalUsers}
          change={dashboardStats.totalUsersChange}
          trend="up"
          icon={Users}
          color="purple"
          description="from last week"
        />
        <MetricCard
          title="Utilization Rate"
          value={dashboardStats.utilizationRate}
          change={dashboardStats.utilizationRateChange}
          trend="down"
          icon={BarChart3}
          color="orange"
          format="percentage"
          description="from last week"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>
              Latest booking activity across all facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => {
                const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
                const startTime = new Date(booking.startTime);
                const endTime = new Date(booking.endTime);
                const timeString = `${startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {booking.facilityName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customerName} • {timeString}
                      </p>
                      {booking.participants > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {booking.participants} participants • $
                          {booking.totalAmount}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={statusConfig.variant}
                      className={statusConfig.className}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Facility Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facility Status
            </CardTitle>
            <CardDescription>
              Real-time status of all facility resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilitiesWithStatus.slice(0, 6).map((facility) => {
                const getStatusInfo = () => {
                  if (facility.status === "maintenance") {
                    return {
                      label: "Maintenance",
                      variant: "destructive" as const,
                      className:
                        "bg-orange-100 text-orange-800 hover:bg-orange-100",
                    };
                  }
                  if (facility.status === "inactive") {
                    return {
                      label: "Closed",
                      variant: "secondary" as const,
                      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
                    };
                  }
                  if (facility.isCurrentlyOccupied) {
                    return {
                      label: "Occupied",
                      variant: "outline" as const,
                      className:
                        "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                    };
                  }
                  return {
                    label: "Available",
                    variant: "default" as const,
                    className: "bg-green-100 text-green-800 hover:bg-green-100",
                  };
                };

                const statusInfo = getStatusInfo();

                return (
                  <div
                    key={facility.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {facility.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {facility.type
                          .replace("_", " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}{" "}
                        • Capacity: {facility.capacity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {facility.location} • ${facility.pricePerHour}/hour
                      </p>
                    </div>
                    <Badge
                      variant={statusInfo.variant}
                      className={statusInfo.className}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Weekly Revenue
            </CardTitle>
            <CardDescription>
              Revenue breakdown by day of the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={dashboardStats.weeklyRevenue}
              xAxisKey="day"
              bars={[
                {
                  dataKey: "amount",
                  name: "Revenue",
                  color: "#3b82f6",
                },
              ]}
              height={300}
              showLegend={false}
            />
          </CardContent>
        </Card>

        {/* Top Performing Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Facilities
            </CardTitle>
            <CardDescription>
              Most popular facilities this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.facilityUsage
                .slice(0, 5)
                .map((facility, index) => (
                  <div
                    key={facility.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{facility.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {facility.bookings} bookings
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-sm">${facility.revenue}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

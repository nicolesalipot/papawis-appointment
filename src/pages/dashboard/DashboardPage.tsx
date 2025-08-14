import { BarChart3, Building2, Calendar, Users } from "lucide-react";

const stats = [
  {
    name: "Total Bookings Today",
    value: "24",
    icon: Calendar,
    change: "+12%",
    changeType: "positive" as const,
  },
  {
    name: "Active Facilities",
    value: "8",
    icon: Building2,
    change: "+2",
    changeType: "positive" as const,
  },
  {
    name: "Total Users",
    value: "156",
    icon: Users,
    change: "+5%",
    changeType: "positive" as const,
  },
  {
    name: "Utilization Rate",
    value: "78%",
    icon: BarChart3,
    change: "-3%",
    changeType: "negative" as const,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome back! Here's what's happening at your sports facilities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-slate-500 ml-2">
                from last week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Bookings
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">Tennis Court A</p>
                  <p className="text-sm text-slate-600">
                    John Doe • 2:00 PM - 3:00 PM
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Facility Status
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Basketball Court",
                status: "Available",
                statusColor: "green",
              },
              {
                name: "Swimming Pool",
                status: "Occupied",
                statusColor: "blue",
              },
              {
                name: "Tennis Court B",
                status: "Maintenance",
                statusColor: "yellow",
              },
            ].map((facility) => (
              <div
                key={facility.name}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{facility.name}</p>
                  <p className="text-sm text-slate-600">Sports Facility</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    facility.statusColor === "green"
                      ? "bg-green-100 text-green-800"
                      : facility.statusColor === "blue"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {facility.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

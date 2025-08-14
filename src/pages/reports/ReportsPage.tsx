import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react";

export function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-slate-600">
            Track performance and analyze facility usage patterns.
          </p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: "Total Bookings",
            value: "1,234",
            change: "+12%",
            icon: Calendar,
            color: "blue",
          },
          {
            name: "Revenue",
            value: "$12,450",
            change: "+8%",
            icon: TrendingUp,
            color: "green",
          },
          {
            name: "Avg. Utilization",
            value: "78%",
            change: "+5%",
            icon: BarChart3,
            color: "purple",
          },
          {
            name: "Peak Hours",
            value: "6-8 PM",
            change: "Most popular",
            icon: Calendar,
            color: "orange",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
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
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  stat.color === "blue"
                    ? "bg-blue-50"
                    : stat.color === "green"
                    ? "bg-green-50"
                    : stat.color === "purple"
                    ? "bg-purple-50"
                    : "bg-orange-50"
                }`}
              >
                <stat.icon
                  className={`h-6 w-6 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
              <span className="text-sm text-slate-500 ml-2">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Booking Trends
          </h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                Chart visualization will be implemented
              </p>
              <p className="text-slate-400 text-sm">in the next phase</p>
            </div>
          </div>
        </div>

        {/* Facility Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Facility Usage
          </h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Usage analytics chart</p>
              <p className="text-slate-400 text-sm">coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Generate Custom Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Facility
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All facilities</option>
              <option>Tennis Court A</option>
              <option>Basketball Court</option>
              <option>Swimming Pool</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Report Type
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Booking summary</option>
              <option>Revenue report</option>
              <option>Usage analytics</option>
              <option>User activity</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

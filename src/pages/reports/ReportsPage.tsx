import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Filter,
  RefreshCw,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { useAnalyticsStore } from "@/store/analyticsStore";

export function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30-days");
  const [selectedFacility, setSelectedFacility] = useState("all");
  const [selectedReportType, setSelectedReportType] =
    useState("booking-summary");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { setDateRange, exportData, isLoading } = useAnalyticsStore();

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);

    const today = new Date();
    let start = new Date();

    switch (value) {
      case "7-days":
        start.setDate(today.getDate() - 7);
        break;
      case "30-days":
        start.setDate(today.getDate() - 30);
        break;
      case "3-months":
        start.setMonth(today.getMonth() - 3);
        break;
      case "6-months":
        start.setMonth(today.getMonth() - 6);
        break;
      case "1-year":
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return; // For custom range, don't auto-set
    }

    if (value !== "custom") {
      const startDateStr = start.toISOString().split("T")[0];
      const endDateStr = today.toISOString().split("T")[0];
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      setDateRange(startDateStr, endDateStr);
    }
  };

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      setDateRange(startDate, endDate);
    }
  };

  const handleExportReport = async () => {
    try {
      await exportData({
        format: "csv",
        dataType: selectedReportType as any,
        includeCharts: false,
        dateRange: {
          startDate:
            startDate ||
            new Date(new Date().setDate(new Date().getDate() - 30))
              .toISOString()
              .split("T")[0],
          endDate: endDate || new Date().toISOString().split("T")[0],
        },
      });
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-end">
        <Badge variant="outline" className="text-xs">
          Live Data
        </Badge>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Custom Report
              </CardTitle>
              <CardDescription>
                Create detailed reports based on specific criteria and date
                ranges.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select
                    value={selectedDateRange}
                    onValueChange={handleDateRangeChange}
                  >
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-days">Last 7 days</SelectItem>
                      <SelectItem value="30-days">Last 30 days</SelectItem>
                      <SelectItem value="3-months">Last 3 months</SelectItem>
                      <SelectItem value="6-months">Last 6 months</SelectItem>
                      <SelectItem value="1-year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select
                    value={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bookings">
                        Booking Analytics
                      </SelectItem>
                      <SelectItem value="revenue">Revenue Report</SelectItem>
                      <SelectItem value="facilities">
                        Facility Performance
                      </SelectItem>
                      <SelectItem value="users">User Activity</SelectItem>
                      <SelectItem value="all">Comprehensive Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Custom Date Range */}
              {selectedDateRange === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button
                      onClick={handleCustomDateRange}
                      disabled={!startDate || !endDate}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Apply Date Range
                    </Button>
                  </div>
                </div>
              )}

              {/* Facility Filter */}
              <div className="space-y-2">
                <Label htmlFor="facility">Facility Filter (Optional)</Label>
                <Select
                  value={selectedFacility}
                  onValueChange={setSelectedFacility}
                >
                  <SelectTrigger id="facility">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Facilities</SelectItem>
                    <SelectItem value="facility-1">Tennis Court A</SelectItem>
                    <SelectItem value="facility-2">Basketball Court</SelectItem>
                    <SelectItem value="facility-3">Swimming Pool</SelectItem>
                    <SelectItem value="facility-4">Football Field</SelectItem>
                    <SelectItem value="facility-5">Gym</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Report */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  onClick={handleExportReport}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isLoading ? "Generating..." : "Download Report (CSV)"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Report will include data for the selected time period and
                  criteria.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Report Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Summary</CardTitle>
                <CardDescription>
                  Get a quick overview of this week's performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedDateRange("7-days");
                    handleDateRangeChange("7-days");
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Weekly Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Analysis</CardTitle>
                <CardDescription>
                  Comprehensive monthly performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedDateRange("30-days");
                    handleDateRangeChange("30-days");
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Monthly Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Focus</CardTitle>
                <CardDescription>
                  Detailed financial performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedReportType("revenue");
                  }}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Revenue Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Analytics Settings
              </CardTitle>
              <CardDescription>
                Configure your analytics preferences and default settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">
                    Default Time Range
                  </h4>
                  <Select defaultValue="30-days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-days">Last 7 days</SelectItem>
                      <SelectItem value="30-days">Last 30 days</SelectItem>
                      <SelectItem value="3-months">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">
                    Auto-Refresh Interval
                  </h4>
                  <Select defaultValue="5-minutes">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-minute">Every minute</SelectItem>
                      <SelectItem value="5-minutes">Every 5 minutes</SelectItem>
                      <SelectItem value="15-minutes">
                        Every 15 minutes
                      </SelectItem>
                      <SelectItem value="never">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

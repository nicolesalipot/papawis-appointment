import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFacilityStore } from "@/store/facilityStore";
import {
  FacilityType,
  FacilityStatus,
  FacilityFormData,
} from "@/lib/types/facility";
import { FacilityForm } from "@/components/facilities/FacilityForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function FacilitiesPage() {
  const {
    facilities,
    pagination,
    filters,
    isLoading,
    error,

    setFilters,
    setPagination,
    deleteFacility,
    createFacility,
    fetchFacilities,
  } = useFacilityStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load facilities on mount and when filters change
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities, filters, pagination.page]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      setFilters({ search: value });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteFacility(id);
      } catch (error) {
        console.error("Failed to delete facility:", error);
      }
    }
  };

  const handleCreateFacility = async (data: FacilityFormData) => {
    try {
      await createFacility(data);
    } catch (error) {
      console.error("Failed to create facility:", error);
      throw error;
    }
  };

  const facilityTypeLabels: Record<FacilityType, string> = {
    tennis_court: "Tennis Court",
    basketball_court: "Basketball Court",
    volleyball_court: "Volleyball Court",
    swimming_pool: "Swimming Pool",
    football_field: "Football Field",
    gym: "Gym",
    squash_court: "Squash Court",
    badminton_court: "Badminton Court",
    track_field: "Track & Field",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex justify-end">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Facility
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <div className="min-w-[140px]">
                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(facilityTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="min-w-[140px]">
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ search: "", type: "all", status: "all" });
                }}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full mb-4" />
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Facilities Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card
              key={facility.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                {/* Facility Image */}
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {facility.images.length > 0 ? (
                    <img
                      src={facility.images[0].url}
                      alt={facility.images[0].alt}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-32 flex items-center justify-center text-gray-400"
                    style={{
                      display: facility.images.length > 0 ? "none" : "flex",
                    }}
                  >
                    <Building2 className="h-8 w-8" />
                  </div>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {facility.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {facilityTypeLabels[facility.type]}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      facility.status === "active"
                        ? "default"
                        : facility.status === "inactive"
                        ? "secondary"
                        : facility.status === "maintenance"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {facility.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {facility.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Capacity: {facility.capacity} people
                  </div>
                  {facility.pricePerHour && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />${facility.pricePerHour}/hour
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(facility.id, facility.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && facilities.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            No facilities found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {filters.search ||
            filters.type !== "all" ||
            filters.status !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by creating a new facility."}
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add your first facility
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && facilities.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}{" "}
              of {pagination.total} facilities
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Facility Modal */}
      <FacilityForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFacility}
      />
    </div>
  );
}

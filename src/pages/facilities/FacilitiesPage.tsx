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

export function FacilitiesPage() {
  const {
    facilities,
    pagination,
    filters,
    isLoading,
    error,
    fetchFacilities,
    setFilters,
    setPagination,
    deleteFacility,
    createFacility,
  } = useFacilityStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities, filters, pagination.page, pagination.pageSize]);

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
      // Refresh the list
      await fetchFacilities();
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

  const statusColors: Record<FacilityStatus, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    closed: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Facilities</h1>
          <p className="mt-2 text-slate-600">
            Manage your sports facilities and their availability.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Facility
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type || "all"}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {Object.entries(facilityTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status || "all"}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({ search: "", type: "all", status: "all" });
            }}
            className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Facilities Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Facility Image */}
              {facility.images.length > 0 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={facility.images[0].url}
                    alt={facility.images[0].alt}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {facilityTypeLabels[facility.type]}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[facility.status]
                  }`}
                >
                  {facility.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {facility.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4" />
                  Capacity: {facility.capacity} people
                </div>
                {facility.pricePerHour && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />${facility.pricePerHour}/hour
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-1">
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(facility.id, facility.name)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && facilities.length === 0 && !error && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            No facilities found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {filters.search ||
            filters.type !== "all" ||
            filters.status !== "all"
              ? "Try adjusting your search or filters."
              : "Get started by creating a new facility."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add your first facility
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && facilities.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-6 py-4">
          <div className="text-sm text-slate-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} facilities
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
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

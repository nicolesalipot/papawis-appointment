import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Wifi,
  Car,
  Accessibility,
  Coffee,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useFacilityStore } from "@/store/facilityStore";
import type { Facility } from "@/lib/types/facility";

export function CustomerFacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );

  const { logout } = useAuthStore();
  const { facilities, fetchFacilities } = useFacilityStore();
  const navigate = useNavigate();

  // Load facilities when component mounts
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // Filter and sort facilities
  const filteredFacilities = facilities
    .filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || facility.type === typeFilter;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return (a.pricePerHour || 0) - (b.pricePerHour || 0);
        case "capacity":
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "accessibility":
        return <Accessibility className="h-4 w-4" />;
      case "cafe":
      case "restaurant":
        return <Coffee className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getFacilityIcon = (facilityType: string) => {
    switch (facilityType) {
      case "tennis_court":
      case "squash_court":
      case "badminton_court":
        return <Building2 className="h-12 w-12" />;
      case "basketball_court":
      case "volleyball_court":
        return <Building2 className="h-12 w-12" />;
      case "swimming_pool":
        return <Building2 className="h-12 w-12" />;
      case "gym":
        return <Building2 className="h-12 w-12" />;
      default:
        return <Building2 className="h-12 w-12" />;
    }
  };

  const handleBookNow = (facility: Facility) => {
    navigate("/customer/book", {
      state: { selectedFacilityId: facility.id },
    });
  };

  const FacilityCard = ({ facility }: { facility: Facility }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {/* Facility Image */}
      <div className="relative h-48 bg-gray-100">
        {facility.images.length > 0 ? (
          <img
            src={facility.images[0].url}
            alt={facility.images[0].alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center text-gray-400"
          style={{ display: facility.images.length > 0 ? "none" : "flex" }}
        >
          {getFacilityIcon(facility.type)}
        </div>
        <Badge
          variant={facility.status === "active" ? "default" : "secondary"}
          className="absolute top-2 right-2 capitalize"
        >
          {facility.status}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{facility.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {facility.location}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {facility.type.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {facility.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span>Capacity: {facility.capacity}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
              <span>${facility.pricePerHour || 50}/hour</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {facility.operatingHours?.monday?.openTime &&
              facility.operatingHours?.monday?.closeTime
                ? `${facility.operatingHours.monday.openTime} - ${facility.operatingHours.monday.closeTime}`
                : "Hours vary"}
            </span>
          </div>

          {/* Amenities */}
          {facility.amenities && facility.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {facility.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1"
                >
                  {getAmenityIcon(amenity)}
                  <span className="ml-1 capitalize">{amenity}</span>
                </div>
              ))}
              {facility.amenities.length > 4 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{facility.amenities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setSelectedFacility(facility)}
          >
            View Details
          </Button>
          <Button
            className="flex-1 bg-black hover:bg-gray-800 text-white"
            onClick={() => handleBookNow(facility)}
          >
            Book Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const FacilityDetailModal = ({ facility }: { facility: Facility }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{facility.name}</h2>
              <p className="text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {facility.location}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFacility(null)}
            >
              ×
            </Button>
          </div>

          {/* Image Gallery */}
          {facility.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facility.images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    {image.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{facility.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Facility Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline" className="capitalize">
                      {facility.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span>{facility.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span>${facility.pricePerHour || 50}/hour</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Operating Hours</h3>
                <div className="space-y-1 text-sm">
                  {Object.entries(facility.operatingHours || {}).map(
                    ([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>
                          {!hours.isOpen
                            ? "Closed"
                            : `${hours.openTime} - ${hours.closeTime}`}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {facility.amenities && facility.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {facility.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="ml-2 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedFacility(null)}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                onClick={() => {
                  setSelectedFacility(null);
                  handleBookNow(facility);
                }}
              >
                Book This Facility
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/customer/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Browse Facilities
                </h1>
                <p className="text-sm text-gray-500">
                  Discover and book our sports facilities
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search facilities, locations, or amenities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tennis_court">Tennis Courts</SelectItem>
                  <SelectItem value="basketball_court">
                    Basketball Courts
                  </SelectItem>
                  <SelectItem value="swimming_pool">Swimming Pools</SelectItem>
                  <SelectItem value="gym">Gyms</SelectItem>
                  <SelectItem value="football_field">
                    Football Fields
                  </SelectItem>
                  <SelectItem value="squash_court">Squash Courts</SelectItem>
                  <SelectItem value="volleyball_court">
                    Volleyball Courts
                  </SelectItem>
                  <SelectItem value="track_field">Track & Field</SelectItem>
                  <SelectItem value="badminton_court">
                    Badminton Courts
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="capacity">Capacity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Facility Map */}
        <FacilityMap
          facilities={filteredFacilities}
          onFacilitySelect={setSelectedFacility}
          selectedFacility={selectedFacility}
          className="mb-8"
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFacilities.length} of {facilities.length}{" "}
            facilities
          </p>
        </div>

        {/* Facilities Grid */}
        {filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No facilities found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Facility Detail Modal */}
      {selectedFacility && <FacilityDetailModal facility={selectedFacility} />}
    </div>
  );
}

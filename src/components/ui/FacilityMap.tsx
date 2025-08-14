import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import type { Facility } from "@/lib/types/facility";

interface FacilityMapProps {
  facilities: Facility[];
  onFacilitySelect?: (facility: Facility) => void;
  selectedFacility?: Facility | null;
  className?: string;
}

export function FacilityMap({
  facilities,
  onFacilitySelect,
  selectedFacility,
  className = "",
}: FacilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markersGroup, setMarkersGroup] = useState<any>(null);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    cssLink.crossOrigin = "";
    document.head.appendChild(cssLink);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(cssLink);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || map) return;

    const L = (window as any).L;

    // Create map centered on Central Park, NYC (since our sample data is NYC-based)
    const newMap = L.map(mapRef.current).setView([40.7831, -73.9712], 12);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(newMap);

    // Create a layer group for markers
    const group = L.layerGroup().addTo(newMap);

    setMap(newMap);
    setMarkersGroup(group);

    // Cleanup function
    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, [mapLoaded, map]);

  // Add facility markers
  useEffect(() => {
    if (!map || !markersGroup || !facilities.length) return;

    const L = (window as any).L;

    // Clear existing markers
    markersGroup.clearLayers();

    // Create markers for each facility with coordinates
    facilities.forEach((facility) => {
      if (!facility.coordinates) return;

      // Create custom icon based on facility type
      const getMarkerColor = (type: string) => {
        switch (type) {
          case "tennis_court":
            return "#22c55e"; // green
          case "basketball_court":
            return "#f97316"; // orange
          case "swimming_pool":
            return "#3b82f6"; // blue
          case "gym":
            return "#8b5cf6"; // purple
          case "football_field":
            return "#ef4444"; // red
          case "squash_court":
            return "#06b6d4"; // cyan
          case "volleyball_court":
            return "#f59e0b"; // amber
          case "track_field":
            return "#84cc16"; // lime
          case "badminton_court":
            return "#ec4899"; // pink
          default:
            return "#6b7280"; // gray
        }
      };

      const icon = L.divIcon({
        html: `<div style="background-color: ${getMarkerColor(
          facility.type
        )}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(
        [facility.coordinates.lat, facility.coordinates.lng],
        {
          icon,
          title: facility.name,
        }
      );

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${
            facility.name
          }</h3>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">${
            facility.location
          }</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: capitalize;">${facility.type.replace(
              "_",
              " "
            )}</span>
            <span style="font-weight: 600; color: #059669;">$${
              facility.pricePerHour
            }/hr</span>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #374151;">${facility.description.slice(
            0,
            100
          )}${facility.description.length > 100 ? "..." : ""}</p>
          ${
            facility.status === "maintenance"
              ? '<div style="color: #dc2626; font-size: 11px; font-weight: 500;">⚠️ Under Maintenance</div>'
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent);

      // Handle marker click
      marker.on("click", () => {
        if (onFacilitySelect) {
          onFacilitySelect(facility);
        }
      });

      // Highlight selected facility
      if (selectedFacility && selectedFacility.id === facility.id) {
        marker.openPopup();
      }

      markersGroup.addLayer(marker);
    });

    // Fit map to show all markers
    if (facilities.length > 0) {
      const group = new L.featureGroup(markersGroup.getLayers());
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }
  }, [map, markersGroup, facilities, selectedFacility, onFacilitySelect]);

  if (!mapLoaded) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Facility Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
            <div className="text-center">
              <Navigation className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
              <p className="text-sm text-gray-500">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Facility Locations
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Badge variant="outline" className="text-xs">
              {facilities.filter((f) => f.coordinates).length} locations
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-64 rounded-md border overflow-hidden"
          style={{ minHeight: "16rem" }}
        />
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
          <span>Click markers for facility details</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-xs"
            onClick={() => {
              if (map && facilities.length > 0) {
                const L = (window as any).L;
                const group = new L.featureGroup(markersGroup.getLayers());
                if (group.getBounds().isValid()) {
                  map.fitBounds(group.getBounds(), { padding: [20, 20] });
                }
              }
            }}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Reset View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

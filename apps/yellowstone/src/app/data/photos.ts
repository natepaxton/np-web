/**
 * Photo data types and utilities for the Yellowstone trip photo map.
 */

export type GeothermalType = 'geyser' | 'spring' | 'paint-pot' | 'mudpot' | 'fumarole';
export type WildlifeType = 'bison' | 'bear' | 'moose' | 'elk' | 'fox' | 'wolf' | 'deer' | 'pronghorn' | 'prairie-dog' | 'bighorn-sheep' | 'other';
export type VehicleType = 'camper' | 'subaru';
export type NpsSiteType =
  | 'mammoth-cave'
  | 'ste-genevieve'
  | 'ulysses-grant'
  | 'harry-truman'
  | 'brown-v-board'
  | 'homestead'
  | 'minuteman-missile'
  | 'badlands'
  | 'wind-cave'
  | 'jewel-cave'
  | 'mount-rushmore'
  | 'devils-tower'
  | 'yellowstone'
  | 'grand-teton'
  | 'little-bighorn'
  | 'theodore-roosevelt'
  | 'knife-river'
  | 'indiana-dunes';
export type AttractionType = 'wall-drug' | 'needles-highway';

export interface Photo {
  id: string;
  filename: string;
  cameraOwner: string;
  lat: number | null;
  lng: number | null;
  dateTaken: string | null;
  dateCategory: 'trip-out' | 'yellowstone' | 'trip-back' | 'unknown';
  people: string[];
  geothermals: GeothermalType[];
  wildlife: WildlifeType[];
  vehicles: VehicleType[];
  npsSites: NpsSiteType[];
  attractions: AttractionType[];
  thumbnail: string;
  medium: string;
  full: string;
}

export interface PhotoMetadata {
  generatedAt: string;
  cloudinaryCloudName: string;
  people: string[];
  yellowstoneStart: string;
  yellowstoneEnd: string;
}

export interface PhotoData {
  metadata: PhotoMetadata;
  photos: Photo[];
}

export type DateFilter = 'all-days' | 'trip-out' | 'trip-back' | string; // string for specific dates like '2026-08-30'

export interface PhotoFilters {
  dates: Set<DateFilter>;
  people: Set<string>;
  cameraOwners: Set<string>;
  geothermals: Set<GeothermalType>;
  wildlife: Set<WildlifeType>;
  vehicles: Set<VehicleType>;
  npsSites: Set<NpsSiteType>;
  attractions: Set<AttractionType>;
  includeTripOut: boolean;
  includeTripBack: boolean;
}

/**
 * Get unique dates from photos in YYYY-MM-DD format
 */
export function getUniqueDates(photos: Photo[]): string[] {
  const dates = new Set<string>();
  photos.forEach((photo) => {
    if (photo.dateTaken) {
      dates.add(photo.dateTaken.split('T')[0]);
    }
  });
  return Array.from(dates).sort();
}

/**
 * Get Yellowstone-only dates (between start and end dates)
 */
export function getYellowstoneDates(photos: Photo[], startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return getUniqueDates(photos).filter((dateStr) => {
    const date = new Date(dateStr);
    return date >= start && date <= end;
  });
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Filter photos based on current filter settings
 */
export function filterPhotos(photos: Photo[], filters: PhotoFilters, _yellowstoneStart: string, _yellowstoneEnd: string): Photo[] {
  return photos.filter((photo) => {
    // Must have GPS coordinates to show on map
    if (photo.lat === null || photo.lng === null) {
      return false;
    }

    // Date filtering
    if (filters.dates.has('all-days')) {
      // All Yellowstone days selected
      const isYellowstone = photo.dateCategory === 'yellowstone';
      const isTripOut = photo.dateCategory === 'trip-out';
      const isTripBack = photo.dateCategory === 'trip-back';

      if (isYellowstone) {
        // Always include Yellowstone photos when all-days is selected
      } else if (isTripOut && !filters.includeTripOut) {
        return false;
      } else if (isTripBack && !filters.includeTripBack) {
        return false;
      } else if (!isYellowstone && !isTripOut && !isTripBack) {
        return false;
      }
    } else if (filters.dates.size > 0) {
      // Specific dates selected
      if (!photo.dateTaken) return false;
      const photoDate = photo.dateTaken.split('T')[0];
      if (!filters.dates.has(photoDate)) {
        return false;
      }
    } else {
      // No dates selected - show nothing
      return false;
    }

    // People filtering (if any people are selected, photo must include at least one)
    if (filters.people.size > 0) {
      const hasMatchingPerson = photo.people.some((person) => filters.people.has(person));
      if (!hasMatchingPerson) {
        return false;
      }
    }

    // Camera owner filtering
    if (filters.cameraOwners.size > 0) {
      if (!filters.cameraOwners.has(photo.cameraOwner)) {
        return false;
      }
    }

    // Geothermal filtering
    if (filters.geothermals.size > 0) {
      const hasMatchingGeothermal = photo.geothermals?.some((g) => filters.geothermals.has(g));
      if (!hasMatchingGeothermal) {
        return false;
      }
    }

    // Wildlife filtering
    if (filters.wildlife.size > 0) {
      const hasMatchingWildlife = photo.wildlife?.some((w) => filters.wildlife.has(w));
      if (!hasMatchingWildlife) {
        return false;
      }
    }

    // Vehicle filtering
    if (filters.vehicles.size > 0) {
      const hasMatchingVehicle = photo.vehicles?.some((v) => filters.vehicles.has(v));
      if (!hasMatchingVehicle) {
        return false;
      }
    }

    // NPS site filtering
    if (filters.npsSites.size > 0) {
      const hasMatchingNpsSite = photo.npsSites?.some((s) => filters.npsSites.has(s));
      if (!hasMatchingNpsSite) {
        return false;
      }
    }

    // Attraction filtering
    if (filters.attractions.size > 0) {
      const hasMatchingAttraction = photo.attractions?.some((a) => filters.attractions.has(a));
      if (!hasMatchingAttraction) {
        return false;
      }
    }

    return true;
  });
}

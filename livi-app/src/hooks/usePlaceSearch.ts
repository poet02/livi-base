// hooks/usePlaceSearch.ts
import { useState, useMemo } from 'react';
import { PlaceToStay, SearchFilters, SearchLocation } from '../types/search';
import { api, handleApiError, ApiError } from '../helpers/apiHelper';

export function usePlaceSearch() {
  const [searchLocation, setSearchLocation] = useState<SearchLocation>({
    address: '',
    useCurrentLocation: false
  });
  const [filters, setFilters] = useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 100000, // Increased default to accommodate higher prices (e.g., 10000 ZAR)
    radius: 10, // Default to 0.2 km (200 meters)
    minBedrooms: 0,
    minBathrooms: 0,
    minSqft: 0,
    maxSqft: 5000,
    types: [],
    minRating: 0
  });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceToStay[]>([]);

  const executeSearch = async () => {
    if (!searchLocation.latitude || !searchLocation.longitude) {
      alert('Please select a location or use your current location');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    try {
      // Convert radius from km to meters (filters.radius is in km, API expects meters)
      const radiusInMeters = filters.radius * 1000;

      const response = await api.get<{ data: any[]; error: boolean }>(
        `/v1/properties/search?latitude=${searchLocation.latitude}&longitude=${searchLocation.longitude}&radius=${radiusInMeters}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to search properties');
      }

      // Extract properties from response
      // API helper wraps response: { data: { data: [...], error }, success, status, message }
      // So response.data is the backend response object
      const backendResponse = response.data as any;
      
      // Handle different response structures
      let propertiesData: any[] = [];
      if (Array.isArray(backendResponse)) {
        propertiesData = backendResponse;
      } else if (backendResponse && Array.isArray(backendResponse.data)) {
        propertiesData = backendResponse.data;
      } else if (backendResponse && backendResponse.data && Array.isArray(backendResponse.data)) {
        propertiesData = backendResponse.data;
      }

      // Transform Property response to PlaceToStay format
      const transformedResults: PlaceToStay[] = propertiesData.map((property: any) => {
        // Convert sqmt to sqft (1 sqm = 10.764 sqft)
        const sqft = property.sqmt ? Math.round(property.sqmt * 10.764) : 0;

        // Convert distance from meters to kilometers
        const distanceInKm = property.distance ? property.distance / 1000 : undefined;

        return {
          id: String(property.id),
          title: property.title || 'Untitled Property',
          price: property.monthlyPrice,
          address: property.address,
          city: property.city || '',
          latitude: property.latitude || 0,
          longitude: property.longitude || 0,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: sqft,
          type: property.type === 'room' ? 'apartment' : property.type, // Map 'room' to 'apartment' for now
          rating: 0, // Default to 0, will be populated when reviews are implemented
          reviewCount: 0, // Default to 0, will be populated when reviews are implemented
          image: property.firstImageUrl || '',
          featured: property.sharing,
          distance: distanceInKm,
        };
      });

      // Filters disabled for now - use all transformed results
      let filteredResults = transformedResults;

      // Sort by distance (closest first)
      filteredResults.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        if (a.distance !== undefined) return -1;
        if (b.distance !== undefined) return 1;
        return 0;
      });

      setSearchResults(filteredResults);
      setHasSearched(true);
    } catch (err) {
      const apiError = err as ApiError;
      handleApiError(apiError);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            address: 'Current Location',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useCurrentLocation: true
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const clearSearch = () => {
    setSearchLocation({
      address: '',
      latitude: undefined,
      longitude: undefined,
      useCurrentLocation: false
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  return {
    searchLocation,
    setSearchLocation,
    filters,
    setFilters,
    searchResults,
    isSearching,
    hasSearched,
    executeSearch,
    useCurrentLocation,
    clearSearch
  };
}
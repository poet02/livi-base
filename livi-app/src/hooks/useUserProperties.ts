// hooks/useUserProperties.ts
import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError, ApiError } from '../helpers/apiHelper';
import { Property } from './usePropertySearch';

interface UseUserPropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export const useUserProperties = (): UseUserPropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Property[]; error: boolean }>('/v1/properties');

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch properties');
      }

      // Extract properties from response
      // Backend returns: { data: properties, error: boolean }
      // API helper wraps it: { data: { data: properties, error }, success, status, message }
      // So response.data is the backend response, response.data.data is the properties array
      const backendResponse = response.data as { data?: Property[]; error?: boolean } | Property[];
      const propertiesData = Array.isArray(backendResponse.data) 
        ? backendResponse.data 
        : Array.isArray(backendResponse)
          ? backendResponse
          : [];

      // Transform properties to use firstImageUrl from backend as image
      type PropertyWithImage = Property & { firstImageUrl?: string };
      const propertiesWithImages = propertiesData.map((property) => {
        const typedProperty = property as PropertyWithImage;
        return {
          ...typedProperty,
          image: typedProperty.firstImageUrl || '',
        };
      });

      setProperties(propertiesWithImages);
    } catch (err) {
      const apiError = err as ApiError;
      handleApiError(apiError);
      setError(apiError);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
  };
};


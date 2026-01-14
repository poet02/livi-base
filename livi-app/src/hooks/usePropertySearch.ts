// hooks/usePropertySearch.ts
import { useState, useMemo } from 'react';

export interface Property {
  id: number;
  title?: string | null;
  dailyPrice?: number | null;
  weeklyPrice?: number | null;
  monthlyPrice: number;
  currency: 'ZAR' | 'USD';
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqmt: number | null;
  image?: string; // Temporary field for display, will be replaced with property images
  type: 'room' | 'apartment' | 'house' | 'condo';
  sharing: boolean;
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Downtown Apartmentttt',
    monthlyPrice: 250000,
    currency: 'USD',
    address: '123 Main St, Downtown, NY',
    bedrooms: 2,
    bathrooms: 2,
    sqmt: 120,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    type: 'apartment',
    sharing: true
  },
  {
    id: 2,
    title: 'Luxury Villa with Pool',
    monthlyPrice: 750000,
    currency: 'USD',
    address: '456 Oak Ave, Beverly Hills, CA',
    bedrooms: 4,
    bathrooms: 3,
    sqmt: 320,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400',
    type: 'house',
    sharing: true
  },
  {
    id: 3,
    title: 'Cozy Studio Condo',
    monthlyPrice: 150000,
    currency: 'USD',
    address: '789 Pine St, Seattle, WA',
    bedrooms: 1,
    bathrooms: 1,
    sqmt: 60,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    type: 'condo',
    sharing: false
  },
  {
    id: 4,
    title: 'Family Suburban Home',
    monthlyPrice: 450000,
    currency: 'USD',
    address: '321 Elm St, Austin, TX',
    bedrooms: 3,
    bathrooms: 2,
    sqmt: 180,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
    type: 'house',
    sharing: false
  },
  {
    id: 5,
    title: 'Penthouse with City View',
    monthlyPrice: 1200000,
    currency: 'USD',
    address: '555 Skyline Dr, Miami, FL',
    bedrooms: 3,
    bathrooms: 3,
    sqmt: 280,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=400',
    type: 'apartment',
    sharing: true
  },
  {
    id: 6,
    title: 'Beachfront Condo',
    monthlyPrice: 350000,
    currency: 'USD',
    address: '777 Beach Blvd, San Diego, CA',
    bedrooms: 2,
    bathrooms: 2,
    sqmt: 110,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
    type: 'condo',
    sharing: false
  }
];

export interface FilterOptions {
  minPrice: number;
  maxPrice: number;
}

export interface SearchFilters extends FilterOptions {
  query: string;
}

export const usePropertySearch = (searchFilters: SearchFilters) => {
  const [loading, setLoading] = useState(false);

  const filteredProperties = useMemo(() => {
    setLoading(true);
    
    const filtered = mockProperties.filter(property => {
      // Search query filter
      const matchesQuery = searchFilters.query === '' || 
        (property.title && property.title.toLowerCase().includes(searchFilters.query.toLowerCase())) ||
        property.address.toLowerCase().includes(searchFilters.query.toLowerCase());

      // Price range filter
      const matchesMinPrice = searchFilters.minPrice === 0 || property.monthlyPrice >= searchFilters.minPrice;
      const matchesMaxPrice = searchFilters.maxPrice === 0 || property.monthlyPrice <= searchFilters.maxPrice;

      return matchesQuery && matchesMinPrice && matchesMaxPrice;
    });

    // Simulate API delay
    setTimeout(() => setLoading(false), 300);
    
    return filtered;
  }, [searchFilters]);

  return {
    properties: filteredProperties,
    loading,
    allProperties: mockProperties
  };
};
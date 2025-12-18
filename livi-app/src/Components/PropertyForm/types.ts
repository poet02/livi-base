export interface PropertyFormData {
  title: string;
  dailyPrice?: number;
  weeklyPrice?: number;
  monthlyPrice: number;
  currency: 'ZAR' | 'USD';
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  sqmt: number;
  type: 'apartment' | 'house' | 'condo';
  parking?: number;
  description: string;
  petFriendly: boolean;
  featured: boolean;
  amenities: string[];
  images: File[];
  existingImages?: string[];
}

// Mapbox Geocoding API response types
export interface MapboxFeature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    accuracy?: string;
    [key: string]: any;
  };
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
    [key: string]: any;
  }>;
}

export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}


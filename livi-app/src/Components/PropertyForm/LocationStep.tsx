import { useState } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
import { MapPin } from 'lucide-react';
import { Label as BaseLabel } from '../../styles/common';
import { PropertyFormData, MapboxFeature } from './types';
import { MapboxGeocoder } from './MapboxGeocoder';
import { MapboxLocationMap } from './MapboxLocationMap';

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.base};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled(BaseLabel)`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const RequiredStar = styled.span`
  color: ${props => props.theme.colors.error.main};
  margin-left: ${props => props.theme.spacing.xs};
`;

const Input = styled.input<{ hasError?: boolean; readOnly?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  background: ${props => props.readOnly ? props.theme.colors.background.paper : props.theme.colors.background.default};
  transition: border-color ${props => props.theme.transitions.base};
  font-family: inherit;
  width: 100%;
  cursor: ${props => props.readOnly ? 'not-allowed' : 'text'};
  color: ${props => props.readOnly ? props.theme.colors.text.secondary : props.theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.primary.main};
    box-shadow: ${props => props.readOnly ? 'none' : `0 0 0 2px ${props.hasError ? `${props.theme.colors.error.main}33` : `${props.theme.colors.primary.main}33`}`};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.xs};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: flex-start;
`;

const CurrentLocationButton = styled.button`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  background: ${props => props.theme.colors.background.default};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: all ${props => props.theme.transitions.base};
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: ${props => props.theme.spacing.sm};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.grey[100]};
    border-color: ${props => props.theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Helper function to extract location data from Mapbox feature
function extractLocationData(feature: MapboxFeature) {
  const context = feature.context || [];
  
  // Extract street number and street name
  let streetNumber = '';
  let streetName = '';
  
  if (feature.place_type?.includes('address')) {
    // For address types, feature.text is the house/building number
    streetNumber = feature.text || '';
    // Street name is in the context with id starting with 'address'
    const addressContext = context.find(ctx => 
      ctx.id?.startsWith('address')
    );
    streetName = addressContext?.text || '';
  } else {
    // For non-address types (like POI or place), try to extract from address context
    const addressContext = context.find(ctx => 
      ctx.id?.startsWith('address')
    );
    if (addressContext) {
      // If address context exists, it might contain the street name
      streetName = addressContext.text || '';
    }
  }
  
  // Extract full street address (street name without number)
  // Use street name if available, otherwise fall back to place_name or text
  const address = streetName || (feature.place_name ? feature.place_name.split(',')[0] : feature.text || '');
  
  // Extract city
  // First check if the feature itself is a city/place type
  let city = '';
  if (feature.place_type?.includes('place') || feature.place_type?.includes('locality')) {
    // If the feature is a city/place, use feature.text as the city
    city = feature.text || '';
  } else {
    // Otherwise, look in the context array
    const cityContext = context.find(ctx => 
      ctx.id?.startsWith('place') || 
      ctx.id?.startsWith('locality') ||
      ctx.id?.startsWith('district')
    );
    city = cityContext?.text || '';
    
    // If still no city found, try to extract from place_name
    // (e.g., "Durban, KwaZulu-Natal, South Africa" -> "Durban")
    if (!city && feature.place_name) {
      const parts = feature.place_name.split(',');
      // The first part is often the city/place name
      city = parts[0]?.trim() || '';
    }
  }
  
  // Extract province/state
  const regionContext = context.find(ctx => 
    ctx.id?.startsWith('region')
  );
  const state = regionContext?.text || '';
  
  // Extract country
  const countryContext = context.find(ctx => 
    ctx.id?.startsWith('country')
  );
  const country = countryContext?.text || '';
  
  // Extract zipcode/postcode
  const postcodeContext = context.find(ctx => 
    ctx.id?.startsWith('postcode')
  );
  const zipCode = postcodeContext?.text || '';
  
  // Extract coordinates
  const [longitude, latitude] = feature.center;
  
  return {
    address,
    streetNumber,
    city,
    state,
    country,
    zipCode,
    latitude,
    longitude,
  };
}

// Reverse geocoding function to get address from coordinates
async function reverseGeocode(
  lng: number,
  lat: number,
  accessToken: string
): Promise<MapboxFeature | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
      `access_token=${accessToken}&` +
      `limit=1`
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();
    return data.features && data.features.length > 0 ? data.features[0] : null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

interface LocationStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
  watch: UseFormWatch<PropertyFormData>;
}

// Get Mapbox access token from environment variable
// In production, you should store this securely
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

export function LocationStep({ register, errors, setValue, watch }: LocationStepProps) {
  const address = watch('address');
  const zipCode = watch('zipCode');
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationSelect = (feature: MapboxFeature | null) => {
    if (feature) {
      const locationData = extractLocationData(feature);
      
      // Update all form fields
      setValue('address', locationData.address, { shouldValidate: true });
      setValue('city', locationData.city, { shouldValidate: true });
      setValue('state', locationData.state, { shouldValidate: true });
      setValue('country', locationData.country, { shouldValidate: true });
      setValue('zipCode', locationData.zipCode, { shouldValidate: true });
      setValue('latitude', locationData.latitude, { shouldValidate: true });
      setValue('longitude', locationData.longitude, { shouldValidate: true });
    } else {
      // Clear all location fields
      setValue('address', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
      setValue('state', '', { shouldValidate: true });
      setValue('country', '', { shouldValidate: true });
      setValue('zipCode', '', { shouldValidate: true });
      setValue('latitude', undefined, { shouldValidate: true });
      setValue('longitude', undefined, { shouldValidate: true });
    }
  };

  const handleMarkerDrag = async (lng: number, lat: number) => {
    // Update coordinates immediately
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });

    // Reverse geocode to get address details
    const feature = await reverseGeocode(lng, lat, MAPBOX_ACCESS_TOKEN);
    if (feature) {
      const locationData = extractLocationData(feature);
      setValue('address', locationData.address, { shouldValidate: true });
      setValue('city', locationData.city, { shouldValidate: true });
      setValue('state', locationData.state, { shouldValidate: true });
      setValue('country', locationData.country, { shouldValidate: true });
      setValue('zipCode', locationData.zipCode, { shouldValidate: true });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update coordinates immediately
        setValue('latitude', lat, { shouldValidate: true });
        setValue('longitude', lng, { shouldValidate: true });

        // Reverse geocode to get address details
        const feature = await reverseGeocode(lng, lat, MAPBOX_ACCESS_TOKEN);
        if (feature) {
          const locationData = extractLocationData(feature);
          setValue('address', locationData.address, { shouldValidate: true });
          setValue('city', locationData.city, { shouldValidate: true });
          setValue('state', locationData.state, { shouldValidate: true });
          setValue('country', locationData.country, { shouldValidate: true });
          setValue('zipCode', locationData.zipCode, { shouldValidate: true });
        } else {
          setLocationError('Could not find address for your location');
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <Section>
        <ErrorMessage>
          Mapbox access token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your environment variables.
        </ErrorMessage>
      </Section>
    );
  }

  return (
    <Section>
      <FormGroup>
        <Label>
          Search Location <RequiredStar>*</RequiredStar>
        </Label>
        <SearchContainer>
          <div style={{ flex: 1 }}>
            <MapboxGeocoder
              value={address}
              onChange={handleLocationSelect}
              placeholder="Search for an address..."
              hasError={!!errors.address}
              errorMessage={errors.address?.message}
              accessToken={MAPBOX_ACCESS_TOKEN}
            />
          </div>
          <CurrentLocationButton
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            title="Use your current location"
          >
            <MapPin />
            {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
          </CurrentLocationButton>
        </SearchContainer>
        {locationError && <ErrorMessage>{locationError}</ErrorMessage>}
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label>
            City <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            {...register('city', {
              required: 'City is required',
            })}
            placeholder="City (auto-filled from location search)"
            hasError={!!errors.city}
            readOnly
            title="City is automatically filled from the location search"
          />
          {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            Province <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            {...register('state', {
              required: 'Province is required',
            })}
            placeholder="Province (auto-filled from location search)"
            hasError={!!errors.state}
            readOnly
            title="Province is automatically filled from the location search"
          />
          {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label>
          Country <RequiredStar>*</RequiredStar>
        </Label>
        <Input
          {...register('country', {
            required: 'Country is required',
          })}
          placeholder="Country"
          hasError={!!errors.country}
          readOnly
          title="Country is automatically filled from the location search"
        />
        {errors.country && <ErrorMessage>{errors.country.message}</ErrorMessage>}
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label>Street Address</Label>
          <Input
            {...register('address')}
            placeholder="Street address (auto-filled)"
            hasError={!!errors.address}
            readOnly
            title="Street address is automatically filled from the location search"
          />
          {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Postal Code</Label>
          <Input
            {...register('zipCode')}
            placeholder="Postal code (auto-filled)"
            hasError={!!errors.zipCode}
            readOnly
            title="Postal code is automatically filled from the location search"
            value={zipCode || ''}
          />
          {errors.zipCode && <ErrorMessage>{errors.zipCode.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Block Number</Label>
          <Input
            {...register('blockNumber')}
            placeholder="Block number (optional)"
            hasError={!!errors.blockNumber}
          />
          {errors.blockNumber && <ErrorMessage>{errors.blockNumber.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Unit Number</Label>
          <Input
            {...register('unitNumber')}
            placeholder="Unit number (optional)"
            hasError={!!errors.unitNumber}
          />
          {errors.unitNumber && <ErrorMessage>{errors.unitNumber.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Latitude</Label>
          <Input
            {...register('latitude')}
            placeholder="Latitude (auto-filled)"
            hasError={!!errors.latitude}
            readOnly
            title="Latitude is automatically filled from the location search"
            value={latitude !== undefined && latitude !== null && typeof latitude === 'number' ? latitude.toFixed(6) : ''}
          />
          {errors.latitude && <ErrorMessage>{errors.latitude.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Longitude</Label>
          <Input
            {...register('longitude')}
            placeholder="Longitude (auto-filled)"
            hasError={!!errors.longitude}
            readOnly
            title="Longitude is automatically filled from the location search"
            value={longitude !== undefined && longitude !== null && typeof longitude === 'number' ? longitude.toFixed(6) : ''}
          />
          {errors.longitude && <ErrorMessage>{errors.longitude.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <MapboxLocationMap
        latitude={latitude}
        longitude={longitude}
        accessToken={MAPBOX_ACCESS_TOKEN}
        address={address}
        onMarkerDrag={handleMarkerDrag}
      />
    </Section>
  );
}

import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
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

// Helper function to extract location data from Mapbox feature
function extractLocationData(feature: MapboxFeature) {
  const context = feature.context || [];
  
  // Extract address (street address)
  const address = feature.text || feature.place_name;
  
  // Extract city
  const cityContext = context.find(ctx => 
    ctx.id?.startsWith('place') || ctx.id?.startsWith('locality')
  );
  const city = cityContext?.text || '';
  
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
  
  // Extract coordinates
  const [longitude, latitude] = feature.center;
  
  return {
    address,
    city,
    state,
    country,
    latitude,
    longitude,
  };
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
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const handleLocationSelect = (feature: MapboxFeature | null) => {
    if (feature) {
      const locationData = extractLocationData(feature);
      
      // Update all form fields
      setValue('address', locationData.address, { shouldValidate: true });
      setValue('city', locationData.city, { shouldValidate: true });
      setValue('state', locationData.state, { shouldValidate: true });
      setValue('country', locationData.country, { shouldValidate: true });
      setValue('latitude', locationData.latitude, { shouldValidate: true });
      setValue('longitude', locationData.longitude, { shouldValidate: true });
    } else {
      // Clear all location fields
      setValue('address', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
      setValue('state', '', { shouldValidate: true });
      setValue('country', '', { shouldValidate: true });
      setValue('latitude', undefined, { shouldValidate: true });
      setValue('longitude', undefined, { shouldValidate: true });
    }
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
        <MapboxGeocoder
          value={address}
          onChange={handleLocationSelect}
          placeholder="Search for an address..."
          hasError={!!errors.address}
          errorMessage={errors.address?.message}
          accessToken={MAPBOX_ACCESS_TOKEN}
        />
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

      <MapboxLocationMap
        latitude={latitude}
        longitude={longitude}
        accessToken={MAPBOX_ACCESS_TOKEN}
        address={address}
      />
    </Section>
  );
}

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
import { Label as BaseLabel } from '../../styles/common';
import { PropertyFormData } from './types';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled(BaseLabel)`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const AmenitiesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.base};
  margin-top: ${props => props.theme.spacing.base};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-weight: ${props => props.theme.typography.fontWeight.normal};

  input {
    margin: 0;
  }
`;

const commonAmenities = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Parking',
  'Security',
  'Balcony',
  'Garden',
  'Air Conditioning',
  'Heating',
  'Laundry',
  'Dishwasher',
  'Fireplace',
  'Hardwood Floors',
  'Furnished',
  'Pet Friendly',
  'Wheelchair Access',
];

interface AmenitiesSelectorProps {
  watch: UseFormWatch<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
  showAmenities?: boolean;
}

export function AmenitiesSelector({ watch, setValue, showAmenities = false }: AmenitiesSelectorProps) {
  if (!showAmenities) {
    return null;
  }
  const watchedAmenities = watch('amenities', []);

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = watchedAmenities;
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];

    setValue('amenities', newAmenities, { shouldValidate: true });
  };

  return (
    <FormGroup>
      <Label>Amenities</Label>
      <AmenitiesSection>
        {commonAmenities.map(amenity => (
          <CheckboxLabel key={amenity}>
            <input
              type="checkbox"
              checked={watchedAmenities.includes(amenity)}
              onChange={() => handleAmenityChange(amenity)}
            />
            {amenity}
          </CheckboxLabel>
        ))}
      </AmenitiesSection>
    </FormGroup>
  );
}


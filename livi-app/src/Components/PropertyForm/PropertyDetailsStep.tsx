import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
import { Input as BaseInput, Label as BaseLabel } from '../../styles/common';
import { PropertyFormData } from './types';
import { AmenitiesSelector } from './AmenitiesSelector';

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

const Input = styled(BaseInput)`
  padding: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.xs};
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

interface PropertyDetailsStepProps {
  register: UseFormRegister<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  watch: UseFormWatch<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}

export function PropertyDetailsStep({ register, errors, watch, setValue }: PropertyDetailsStepProps) {
  // Control parameter to show/hide amenities - hardcoded to false for now
  const SHOW_AMENITIES = false;

  return (
    <Section>
      <FormRow>
        <FormGroup>
          <Label>
            Bedrooms <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            type="number"
            {...register('bedrooms', {
              required: 'Bedrooms is required',
              min: { value: 0, message: 'Bedrooms cannot be negative' }
            })}
            placeholder="2"
            hasError={!!errors.bedrooms}
          />
          {errors.bedrooms && <ErrorMessage>{errors.bedrooms.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            Bathrooms <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            type="number"
            {...register('bathrooms', {
              required: 'Bathrooms is required',
              min: { value: 0, message: 'Bathrooms cannot be negative' }
            })}
            placeholder="2"
            step="0.5"
            hasError={!!errors.bathrooms}
          />
          {errors.bathrooms && <ErrorMessage>{errors.bathrooms.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            Square Meters <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            type="number"
            {...register('sqmt', {
              required: 'Square footage is required',
              min: { value: 1, message: 'Square footage must be greater than 0' }
            })}
            placeholder="1200"
            hasError={!!errors.sqmt}
          />
          {errors.sqmt && <ErrorMessage>{errors.sqmt.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Parking Spaces</Label>
          <Input
            type="number"
            {...register('parking', {
              min: { value: 0, message: 'Parking spaces cannot be negative' }
            })}
            placeholder="1"
            hasError={!!errors.parking}
          />
          {errors.parking && <ErrorMessage>{errors.parking.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <CheckboxLabel>
            <input type="checkbox" {...register('petFriendly')} />
            Pet Friendly
          </CheckboxLabel>
        </FormGroup>
        <FormGroup>
          <CheckboxLabel>
            <input type="checkbox" {...register('featured')} />
            Sharing
          </CheckboxLabel>
        </FormGroup>
      </FormRow>

      <AmenitiesSelector watch={watch} setValue={setValue} showAmenities={SHOW_AMENITIES} />
    </Section>
  );
}


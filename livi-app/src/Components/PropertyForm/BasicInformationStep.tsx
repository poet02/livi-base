import { Control, Controller, FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import styled from 'styled-components';
import { Input as BaseInput, Label as BaseLabel } from '../../styles/common';
import { PropertyFormData } from './types';

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

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  background: ${props => props.theme.colors.background.default};
  transition: border-color ${props => props.theme.transitions.base};
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? `${props.theme.colors.error.main}33` 
        : `${props.theme.colors.primary.main}33`
    };
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  min-height: 120px;
  resize: vertical;
  transition: border-color ${props => props.theme.transitions.base};
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error.main : props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? `${props.theme.colors.error.main}33` 
        : `${props.theme.colors.primary.main}33`
    };
  }
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
  margin-bottom: ${props => props.theme.spacing.sm};

  input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }
`;

const ConditionalInputGroup = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
];

interface BasicInformationStepProps {
  register: UseFormRegister<PropertyFormData>;
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  watch: UseFormWatch<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}

export function BasicInformationStep({ register, control, errors, watch, setValue }: BasicInformationStepProps) {
  return (
    <Section>
      <FormRow>
        <FormGroup>
          <Label>
            Property Title <RequiredStar>*</RequiredStar>
          </Label>
          <Input
            {...register('title', {
              required: 'Property title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            placeholder="e.g., Modern Downtown Apartment"
            hasError={!!errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>
            Property Type <RequiredStar>*</RequiredStar>
          </Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Property type is required' }}
            render={({ field }) => (
              <Select {...field} hasError={!!errors.type}>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label>
          Currency <RequiredStar>*</RequiredStar>
        </Label>
        <Controller
          name="currency"
          control={control}
          rules={{ required: 'Currency is required' }}
          render={({ field }) => (
            <Select {...field} hasError={!!errors.currency}>
              <option value="ZAR">Rands (ZAR)</option>
              <option value="USD">US Dollars (USD)</option>
            </Select>
          )}
        />
        {errors.currency && <ErrorMessage>{errors.currency.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>
          Monthly Rate <RequiredStar>*</RequiredStar>
        </Label>
        <Input
          type="number"
          {...register('monthlyPrice', {
            required: 'Monthly rate is required',
            min: { value: 1, message: 'Monthly rate must be greater than 0' }
          })}
          placeholder="0"
          hasError={!!errors.monthlyPrice}
        />
        {errors.monthlyPrice && <ErrorMessage>{errors.monthlyPrice.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={watch('dailyPrice') !== undefined && watch('dailyPrice') !== null}
            onChange={(e) => {
              if (e.target.checked) {
                setValue('dailyPrice', 0, { shouldValidate: true });
              } else {
                setValue('dailyPrice', undefined, { shouldValidate: true });
              }
            }}
          />
          <span>Set Daily Rate</span>
        </CheckboxLabel>
        {watch('dailyPrice') !== undefined && watch('dailyPrice') !== null && (
          <ConditionalInputGroup>
            <Input
              type="number"
              {...register('dailyPrice', {
                min: { value: 0, message: 'Daily rate cannot be negative' }
              })}
              placeholder="0"
              hasError={!!errors.dailyPrice}
            />
            {errors.dailyPrice && <ErrorMessage>{errors.dailyPrice.message}</ErrorMessage>}
          </ConditionalInputGroup>
        )}
      </FormGroup>

      <FormGroup>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={watch('weeklyPrice') !== undefined && watch('weeklyPrice') !== null}
            onChange={(e) => {
              if (e.target.checked) {
                setValue('weeklyPrice', 0, { shouldValidate: true });
              } else {
                setValue('weeklyPrice', undefined, { shouldValidate: true });
              }
            }}
          />
          <span>Set Weekly Rate</span>
        </CheckboxLabel>
        {watch('weeklyPrice') !== undefined && watch('weeklyPrice') !== null && (
          <ConditionalInputGroup>
            <Input
              type="number"
              {...register('weeklyPrice', {
                min: { value: 0, message: 'Weekly rate cannot be negative' }
              })}
              placeholder="0"
              hasError={!!errors.weeklyPrice}
            />
            {errors.weeklyPrice && <ErrorMessage>{errors.weeklyPrice.message}</ErrorMessage>}
          </ConditionalInputGroup>
        )}
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          {...register('description')}
          placeholder="Describe the property features, location advantages, and unique selling points..."
        />
      </FormGroup>
    </Section>
  );
}


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Button as BaseButton, Card } from '../styles/common';
import { ProgressBar } from '../Components/PropertyForm/ProgressBar';
import { BasicInformationStep } from '../Components/PropertyForm/BasicInformationStep';
import { LocationStep } from '../Components/PropertyForm/LocationStep';
import { PropertyDetailsStep } from '../Components/PropertyForm/PropertyDetailsStep';
import { PropertyImagesStep } from '../Components/PropertyForm/PropertyImagesStep';
import { ReviewStep } from '../Components/PropertyForm/ReviewStep';
import { PropertyFormData } from '../Components/PropertyForm/types';

// Mock data for editing - in real app, this would come from API
const mockProperties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    bedrooms: 2,
    bathrooms: 2,
    sqmt: 1200,
    type: 'apartment',
    yearBuilt: 2018,
    parking: 1,
    description: 'Beautiful modern apartment in the heart of downtown.',
    petFriendly: true,
    featured: true,
    amenities: ['Swimming Pool', 'Gym/Fitness Center', 'Air Conditioning'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200'
    ]
  }
];

const STEPS = [
  { number: 1, label: 'Location' },
  { number: 2, label: 'Property Images' },
  { number: 3, label: 'Basic Information' },
  { number: 4, label: 'Property Details' },
  { number: 5, label: 'Review' },
];

const Container = styled.div`
  height: 95vh;
  background: ${props => props.theme.colors.background.paper};
  padding-bottom: ${props => props.theme.spacing.xl};
  overflow-y: auto;
  color: ${props => props.theme.colors.text.primary};
`;

const Header = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.base};
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.theme.colors.grey[100]};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const Form = styled(Card)`
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const Button = styled(BaseButton)`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success.main};
  color: ${props => props.theme.colors.success.contrast};
  padding: ${props => props.theme.spacing.base};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
`;

const defaultValues: PropertyFormData = {
  title: '',
  dailyPrice: undefined,
  weeklyPrice: undefined,
  monthlyPrice: 0,
  currency: 'ZAR',
  address: '',
  streetNumber: undefined,
  blockNumber: undefined,
  unitNumber: undefined,
  city: '',
  state: '',
  country: '',
  zipCode: undefined,
  latitude: undefined,
  longitude: undefined,
  bedrooms: 0,
  bathrooms: 0,
  sqmt: 0,
  type: 'apartment',
  parking: undefined,
  description: '',
  petFriendly: false,
  featured: false,
  amenities: [],
  images: [],
  existingImages: [],
};

// Field groups for step validation
const STEP_FIELDS: Record<number, (keyof PropertyFormData)[]> = {
  1: ['address', 'city', 'state', 'country'], // Location
  2: [], // Property Images (optional)
  3: ['type', 'monthlyPrice', 'currency'], // Basic Information
  4: ['bedrooms', 'bathrooms', 'sqmt'], // Property Details
  5: [], // Review (no validation needed)
};

export function AddProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageLocations, setImageLocations] = useState<Map<string, { latitude: number; longitude: number }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid }
  } = useForm<PropertyFormData>({
    defaultValues,
    mode: 'onChange'
  });

  // Load property data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const propertyToEdit = mockProperties.find(prop => prop.id === id);

      if (propertyToEdit) {
        // Set form values
        reset({
          title: propertyToEdit.title,
          dailyPrice: undefined,
          weeklyPrice: undefined,
          monthlyPrice: propertyToEdit.price || 0,
          currency: 'ZAR',
          address: propertyToEdit.address,
          streetNumber: undefined,
          city: propertyToEdit.city,
          state: propertyToEdit.state,
          country: 'South Africa', // Default for existing data
          zipCode: undefined,
          latitude: undefined,
          longitude: undefined,
          bedrooms: propertyToEdit.bedrooms,
          bathrooms: propertyToEdit.bathrooms,
          sqmt: propertyToEdit.sqmt,
          type: propertyToEdit.type as 'apartment' | 'house' | 'condo',
          parking: propertyToEdit.parking,
          description: propertyToEdit.description,
          petFriendly: propertyToEdit.petFriendly,
          featured: propertyToEdit.featured,
          amenities: propertyToEdit.amenities,
          images: [],
          existingImages: propertyToEdit.images
        });

        setExistingImages(propertyToEdit.images);
        setImagePreviews([]);
        setImageLocations(new Map());
      }
    }
  }, [id, isEditMode, reset]);

  // Check if step is valid
  const validateStep = async (step: number): Promise<boolean> => {
    const fields = STEP_FIELDS[step];
    if (fields.length === 0) return true; // Steps without required fields are always valid
    
    const result = await trigger(fields as any);
    return result;
  };

  // Mark step as completed
  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  // Handle step navigation
  const handleStepClick = async (step: number) => {
    // Can only click on completed steps or previous steps
    if (step < currentStep || completedSteps.includes(step)) {
      setCurrentStep(step);
    }
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    
    if (isValid) {
      markStepCompleted(currentStep);
      
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };

  // Handle form submission
  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Property data to submit:', {
        ...data,
        isEditMode,
        propertyId: id
      });

      // Show success message
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        reset(defaultValues);
        setImagePreviews([]);
        setExistingImages([]);
        setImageLocations(new Map());
        setShowSuccess(false);
        setCurrentStep(1);
        setCompletedSteps([]);
        navigate('/properties');
      }, 2000);

    } catch (error) {
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationStep
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case 2:
        return (
          <PropertyImagesStep
            watch={watch}
            setValue={setValue}
            isEditMode={isEditMode}
            existingImages={existingImages}
            setExistingImages={setExistingImages}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            imageLocations={imageLocations}
            setImageLocations={setImageLocations}
          />
        );
      case 3:
        return (
          <BasicInformationStep
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 4:
        return (
          <PropertyDetailsStep
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 5:
        return (
          <ReviewStep
            watch={watch}
            imagePreviews={imagePreviews}
            existingImages={existingImages}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <ArrowLeft />
        </BackButton>
        <Title>
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </Title>
      </Header>

      <ProgressBar
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <FormContainer>
        {showSuccess && (
          <SuccessMessage>
            Property {isEditMode ? 'updated' : 'added'} successfully! Redirecting...
          </SuccessMessage>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <FormActions>
            <div style={{ display: 'flex', gap: '8px' }}>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            </div>

            {currentStep < STEPS.length ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting
                ? (isEditMode ? 'Updating Property...' : 'Adding Property...')
                : (isEditMode ? 'Update Property' : 'Add Property')
              }
            </Button>
            )}
          </FormActions>
        </Form>
      </FormContainer>
    </Container>
  );
}

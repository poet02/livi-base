import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Button as BaseButton } from '../styles/common';
import { ProgressBar } from '../Components/PropertyForm/ProgressBar';
import { BasicInformationStep } from '../Components/PropertyForm/BasicInformationStep';
import { LocationStep } from '../Components/PropertyForm/LocationStep';
import { PropertyDetailsStep } from '../Components/PropertyForm/PropertyDetailsStep';
import { PropertyImagesStep } from '../Components/PropertyForm/PropertyImagesStep';
import { ReviewStep } from '../Components/PropertyForm/ReviewStep';
import { PropertyFormData } from '../Components/PropertyForm/types';
import { api, handleApiError, ApiError } from '../helpers/apiHelper';
import { uploadImagesToS3, ImageUploadData } from '../helpers/imageUploadHelper';

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

const Form = styled.form`
  background: ${props => props.theme.colors.background.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.base};
  margin-top: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl};
  transition: ${props => props.theme.transitions.base};
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

const UploadProgress = styled.div`
  background: ${props => props.theme.colors.primary.main}15;
  border: 1px solid ${props => props.theme.colors.primary.main}40;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
`;

const UploadError = styled.div`
  background: ${props => props.theme.colors.error.main}15;
  border: 1px solid ${props => props.theme.colors.error.main}40;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: ${props => props.theme.spacing.base};
  text-align: center;
  color: ${props => props.theme.colors.error.main};
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
  const shouldSubmitRef = useRef(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    // Only submit if the submit button was explicitly clicked
    if (!shouldSubmitRef.current) {
      return;
    }
    
    console.log('Property data to submit:', data);
    setIsSubmitting(true);
    shouldSubmitRef.current = false; // Reset flag

    try {
      // Prepare payload for backend (exclude images, amenities, and map featured to sharing)
      const payload = {
        title: data.title || undefined,
        dailyPrice: data.dailyPrice,
        weeklyPrice: data.weeklyPrice,
        monthlyPrice: data.monthlyPrice,
        currency: data.currency,
        address: data.address,
        streetNumber: data.streetNumber,
        blockNumber: data.blockNumber,
        unitNumber: data.unitNumber,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqmt: data.sqmt || undefined,
        type: data.type,
        parking: data.parking,
        description: data.description || undefined,
        petFriendly: data.petFriendly,
        sharing: data.featured, // Map featured to sharing for backend
      };

      console.log('Sending property payload:', payload);

      let propertyId: number;
      
      if (isEditMode && id) {
        // Update existing property
        const response = await api.patch(`/v1/properties/${id}`, payload);
        console.log('Property updated:', response.data);
        propertyId = parseInt(id, 10);
      } else {
        // Create new property
        const response = await api.post('/v1/properties', payload);
        // console.log('Property created:', response.data);
        
        // Extract property ID from response
        // Backend returns: { data: property, msg: string, error: boolean }
        // API helper wraps it: { data: { data: property, msg, error }, ... }
        // So response.data is the backend response, response.data.data is the property
        const backendResponse = response.data;
        const property = backendResponse.data || backendResponse;
        propertyId = property?.id;
        
        if (!propertyId) {
          throw new Error('Property ID not returned from server');
        }
      }

      // Upload images if any
      // Note: For edit mode, we only upload new images (blob URLs)
      // Existing images are already in S3 and DB
      const images = watch('images') || [];
      const imagesToUpload: ImageUploadData[] = [];
      
      // console.log('Collecting images for upload:', {
      //   imagePreviewsCount: imagePreviews.length,
      //   imagesCount: images.length,
      //   existingImagesCount: existingImages.length,
      //   imagePreviews: imagePreviews.map((p, i) => ({ index: i, preview: p?.substring(0, 50) || 'null' })),
      //   images: images.map((img, i) => ({ index: i, fileName: img?.name || 'null', fileSize: img?.size || 0 })),
      //   imageLocations: Array.from(imageLocations.entries()).map(([key, val]) => ({ 
      //     key: key.substring(0, 50), 
      //     location: val 
      //   })),
      // });
      
      // Collect new images (blob URLs) with their locations
      // The key is to match blob URLs in imagePreviews with File objects
      // imagePreviews may contain both existing (URLs) and new (blob URLs) images
      // images array only contains File objects for new images
      let newImageCount = 0;
      let fileIndex = 0; // Track position in images array (only new files)
      
      imagePreviews.forEach((preview, previewIndex) => {
        // Only process blob URLs (new images), skip existing image URLs
        if (preview && preview.startsWith('blob:')) {
          // Find the corresponding file - it should be at fileIndex in the images array
          // because images array only contains new files, not existing ones
          if (fileIndex < images.length) {
            const file = images[fileIndex];
            if (file instanceof File) {
              const location = imageLocations.get(preview);
              newImageCount++;
              // Order should be based on total images (existing + new)
              // For new properties: just sequential 1, 2, 3...
              // For edit mode: existing images already have orders, new ones continue
              const baseOrder = isEditMode ? existingImages.length : 0;
              imagesToUpload.push({
                file,
                location,
                order: baseOrder + newImageCount,
              });
              // console.log(`✅ Added image ${newImageCount} to upload queue:`, {
              //   previewIndex,
              //   fileIndex,
              //   preview: preview.substring(0, 50),
              //   fileName: file.name,
              //   fileSize: file.size,
              //   location,
              //   order: baseOrder + newImageCount,
              // });
              fileIndex++; // Move to next file in images array
            } else {
              console.warn(`⚠️ File at index ${fileIndex} is not a File object:`, file);
            }
          } else {
            console.warn(`⚠️ No file found for blob preview at index ${previewIndex}. File index: ${fileIndex}, Images length: ${images.length}`);
          }
        } else if (preview && !preview.startsWith('blob:')) {
          // This is an existing image (not a blob URL), skip it
          // Don't increment fileIndex because existing images aren't in the images array
        }
      });

      // console.log(`📊 Total images to upload: ${imagesToUpload.length}`, imagesToUpload.map(img => ({
      //   fileName: img.file.name,
      //   fileSize: img.file.size,
      //   order: img.order,
      //   hasLocation: !!img.location,
      // })));

      // Upload images to S3 and confirm with backend
      let uploadFailed = false;
      if (imagesToUpload.length > 0) {
        setUploadProgress({ current: 0, total: imagesToUpload.length });
        setUploadError(null);
        
        try {
          await uploadImagesToS3(
            propertyId,
            imagesToUpload,
            (current, total) => {
              setUploadProgress({ current, total });
            }
          );
          
          // Clean up blob URLs after successful upload
          imagePreviews.forEach((preview) => {
            if (preview.startsWith('blob:')) {
              URL.revokeObjectURL(preview);
            }
          });
        } catch (error) {
          console.error('Error uploading images:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to upload images';
          setUploadError(errorMessage);
          uploadFailed = true;
          // Don't throw - property was created successfully, images can be added later
        } finally {
          setUploadProgress(null);
        }
      }

      // Show success message
      setShowSuccess(true);

      // Reset form after success (only if no upload error)
      if (!uploadFailed) {
        setTimeout(() => {
          reset(defaultValues);
          setImagePreviews([]);
          setExistingImages([]);
          setImageLocations(new Map());
          setShowSuccess(false);
          setUploadProgress(null);
          setUploadError(null);
          setCurrentStep(1);
          setCompletedSteps([]);
          navigate('/properties');
        }, 2000);
      }

    } catch (error) {
      console.error('Error submitting property:', error);
      const apiError = error as ApiError;
      handleApiError(apiError, (err) => {
        // Custom error handling - you can show a toast or error message here
        alert(err.message || 'Failed to save property. Please try again.');
      });
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
            Property {isEditMode ? 'updated' : 'added'} successfully!
            {uploadProgress && (
              <div style={{ marginTop: '8px' }}>
                Uploading images... {uploadProgress.current} of {uploadProgress.total}
              </div>
            )}
            {!uploadProgress && !uploadError && ' Redirecting...'}
          </SuccessMessage>
        )}
        {uploadProgress && !showSuccess && (
          <UploadProgress>
            Uploading images... {uploadProgress.current} of {uploadProgress.total}
          </UploadProgress>
        )}
        {uploadError && (
          <UploadError>
            ⚠️ {uploadError}
            <div style={{ marginTop: '8px', fontSize: '0.9em' }}>
              Property was created successfully. You can add images later by editing the property.
            </div>
          </UploadError>
        )}

        <Form 
          onSubmit={(e) => {
            e.preventDefault();
            // Only proceed if submit button was explicitly clicked
            if (shouldSubmitRef.current) {
              handleSubmit(onSubmit)(e);
            }
          }}
        >
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
              type="button"
              variant="primary"
              disabled={isSubmitting || !isValid}
              onClick={(e) => {
                e.preventDefault();
                shouldSubmitRef.current = true;
                handleSubmit(onSubmit)(e);
              }}
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

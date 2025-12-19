import { UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
import { PropertyFormData } from './types';

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const ReviewGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
`;

const ReviewSection = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const ReviewSectionTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary.main};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ReviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xs};
  }
`;

const ReviewLabel = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ReviewValue = styled.span`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
`;

const AmenityTag = styled.span`
  background: ${props => props.theme.colors.primary.main};
  color: ${props => props.theme.colors.primary.contrast};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.base};
`;

const NoData = styled.span`
  color: ${props => props.theme.colors.text.disabled};
  font-style: italic;
`;

interface ReviewStepProps {
  watch: UseFormWatch<PropertyFormData>;
  imagePreviews: string[];
  existingImages: string[];
  isEditMode: boolean;
}

export function ReviewStep({ watch, imagePreviews, existingImages, isEditMode }: ReviewStepProps) {
  const formData = watch();

  const propertyTypes: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    condo: 'Condo',
  };

  const formatCurrency = (amount: number, currency: 'ZAR' | 'USD' = 'ZAR') => {
    const currencyCode = currency === 'USD' ? 'en-US' : 'en-ZA';
    return new Intl.NumberFormat(currencyCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrencySymbol = (currency: 'ZAR' | 'USD') => {
    return currency === 'USD' ? 'USD' : 'ZAR';
  };

  const allImages = isEditMode ? existingImages : imagePreviews;

  return (
    <Section>
      <ReviewGrid>
        {/* Basic Information */}
        <ReviewSection>
          <ReviewSectionTitle>Basic Information</ReviewSectionTitle>
          <ReviewRow>
            <ReviewLabel>Title:</ReviewLabel>
            <ReviewValue>{formData.title || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Type:</ReviewLabel>
            <ReviewValue>{propertyTypes[formData.type] || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Currency:</ReviewLabel>
            <ReviewValue>{getCurrencySymbol(formData.currency)}</ReviewValue>
          </ReviewRow>
          {formData.dailyPrice && (
            <ReviewRow>
              <ReviewLabel>Daily Rate:</ReviewLabel>
              <ReviewValue>{formatCurrency(formData.dailyPrice, formData.currency)}</ReviewValue>
            </ReviewRow>
          )}
          {formData.weeklyPrice && (
            <ReviewRow>
              <ReviewLabel>Weekly Rate:</ReviewLabel>
              <ReviewValue>{formatCurrency(formData.weeklyPrice, formData.currency)}</ReviewValue>
            </ReviewRow>
          )}
          <ReviewRow>
            <ReviewLabel>Monthly Rate:</ReviewLabel>
            <ReviewValue>{formData.monthlyPrice ? formatCurrency(formData.monthlyPrice, formData.currency) : <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          {formData.description && (
            <ReviewRow>
              <ReviewLabel>Description:</ReviewLabel>
              <ReviewValue>{formData.description}</ReviewValue>
            </ReviewRow>
          )}
        </ReviewSection>

        {/* Location */}
        <ReviewSection>
          <ReviewSectionTitle>Location</ReviewSectionTitle>
          <ReviewRow>
            <ReviewLabel>Address:</ReviewLabel>
            <ReviewValue>{formData.address || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>City:</ReviewLabel>
            <ReviewValue>{formData.city || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Province:</ReviewLabel>
            <ReviewValue>{formData.state || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Country:</ReviewLabel>
            <ReviewValue>{formData.country || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          {formData.zipCode && (
            <ReviewRow>
              <ReviewLabel>Postal Code:</ReviewLabel>
              <ReviewValue>{formData.zipCode}</ReviewValue>
            </ReviewRow>
          )}
          {formData.blockNumber && (
            <ReviewRow>
              <ReviewLabel>Block Number:</ReviewLabel>
              <ReviewValue>{formData.blockNumber}</ReviewValue>
            </ReviewRow>
          )}
          {formData.unitNumber && (
            <ReviewRow>
              <ReviewLabel>Unit Number:</ReviewLabel>
              <ReviewValue>{formData.unitNumber}</ReviewValue>
            </ReviewRow>
          )}
          {formData.latitude && formData.longitude && (
            <ReviewRow>
              <ReviewLabel>Coordinates:</ReviewLabel>
              <ReviewValue>{formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</ReviewValue>
            </ReviewRow>
          )}
        </ReviewSection>

        {/* Property Details */}
        <ReviewSection>
          <ReviewSectionTitle>Property Details</ReviewSectionTitle>
          <ReviewRow>
            <ReviewLabel>Bedrooms:</ReviewLabel>
            <ReviewValue>{formData.bedrooms || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Bathrooms:</ReviewLabel>
            <ReviewValue>{formData.bathrooms || <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Square Meters:</ReviewLabel>
            <ReviewValue>{formData.sqmt ? `${formData.sqmt} m²` : <NoData>Not provided</NoData>}</ReviewValue>
          </ReviewRow>
          {formData.parking !== undefined && (
            <ReviewRow>
              <ReviewLabel>Parking Spaces:</ReviewLabel>
              <ReviewValue>{formData.parking}</ReviewValue>
            </ReviewRow>
          )}
          <ReviewRow>
            <ReviewLabel>Pet Friendly:</ReviewLabel>
            <ReviewValue>{formData.petFriendly ? 'Yes' : 'No'}</ReviewValue>
          </ReviewRow>
          <ReviewRow>
            <ReviewLabel>Sharing:</ReviewLabel>
            <ReviewValue>{formData.featured ? 'Yes' : 'No'}</ReviewValue>
          </ReviewRow>
          {formData.amenities && formData.amenities.length > 0 && (
            <ReviewRow>
              <ReviewLabel>Amenities:</ReviewLabel>
              <ReviewValue>
                <AmenitiesList>
                  {formData.amenities.map((amenity, index) => (
                    <AmenityTag key={index}>{amenity}</AmenityTag>
                  ))}
                </AmenitiesList>
              </ReviewValue>
            </ReviewRow>
          )}
        </ReviewSection>

        {/* Images */}
        <ReviewSection>
          <ReviewSectionTitle>Property Images</ReviewSectionTitle>
          <ReviewRow>
            <ReviewLabel>Total Images:</ReviewLabel>
            <ReviewValue>{allImages.length} image(s)</ReviewValue>
          </ReviewRow>
          {allImages.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <ImageGrid>
                {allImages.map((image, index) => (
                  <ImagePreview
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                  />
                ))}
              </ImageGrid>
            </div>
          )}
        </ReviewSection>
      </ReviewGrid>
    </Section>
  );
}


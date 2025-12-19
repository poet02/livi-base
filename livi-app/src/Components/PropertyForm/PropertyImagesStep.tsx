import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, X } from 'lucide-react';
import { PropertyFormData } from './types';
import { DraggableList, createDraggableItem } from '../DraggableList';
import { GridCamera } from './GridCamera';

interface DraggableItem {
  id: string;
  content: React.ReactElement;
}

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const InfoMessage = styled.div`
  background: ${props => props.theme.colors.primary.main}15;
  border: 1px solid ${props => props.theme.colors.primary.main}40;
  border-radius: ${props => props.theme.borderRadius.base};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  line-height: 1.5;
`;

const ImageSlot = styled.div<{ isEmpty: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  background: ${props => props.isEmpty 
    ? props.theme.colors.background.paper 
    : 'transparent'
  };
  border: ${props => props.isEmpty 
    ? `2px dashed ${props.theme.colors.border.light}` 
    : 'none'
  };
  cursor: ${props => props.isEmpty ? 'default' : 'grab'};
  transition: all ${props => props.theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${props => props.isEmpty && `
      border-color: ${props.theme.colors.primary.main};
      background: ${props.theme.colors.primary.main}10;
    `}
  }
`;

const PlaceholderButton = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.primary.main};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 48px;
    height: 48px;
  }
`;

const PlaceholderText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ImageContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const OrderBadge = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.xs};
  left: ${props => props.theme.spacing.xs};
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: ${props => props.theme.borderRadius.base};
  padding: 4px 8px;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  min-width: 24px;
  text-align: center;
  z-index: 10;
`;

const LocationInfo = styled.div`
  margin-top: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.grey[200]};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-family: monospace;
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  word-break: break-all;
  width: 100%;
  flex-shrink: 0;
`;

const DistanceInfo = styled.div<{ isWithinRange: boolean }>`
  margin-top: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.isWithinRange 
    ? (props.theme.colors.success?.main || '#4caf50') + '15'
    : (props.theme.colors.error?.main || '#f44336') + '15'
  };
  border: 1px solid ${props => props.isWithinRange 
    ? props.theme.colors.success?.main || '#4caf50'
    : props.theme.colors.error?.main || '#f44336'
  };
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.isWithinRange 
    ? props.theme.colors.success?.main || '#4caf50'
    : props.theme.colors.error?.main || '#f44336'
  };
  text-align: center;
  width: 100%;
  flex-shrink: 0;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const SlotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background.default};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  max-width: 400px;
  width: 100%;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary.main};
          color: ${props.theme.colors.primary.contrast};
          &:hover {
            background: ${props.theme.colors.primary.dark};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error.main};
          color: white;
          &:hover {
            background: ${props.theme.colors.error.dark};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.grey[100]};
          color: ${props.theme.colors.text.primary};
          &:hover {
            background: ${props.theme.colors.grey[200]};
          }
        `;
    }
  }}
`;

// Hardcoded number of image slots
const MAX_IMAGES = 10;

// Maximum allowed distance from property location (in meters)
const MAX_DISTANCE_FROM_PROPERTY_METERS = 50;

// Haversine formula to calculate distance in meters between two coordinates
function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in meters
}

interface ImageSlotData {
  file: File | null;
  preview: string | null;
  location?: { latitude: number; longitude: number };
}

interface PropertyImagesStepProps {
  watch: UseFormWatch<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
  isEditMode: boolean;
  existingImages: string[];
  setExistingImages: (images: string[]) => void;
  imagePreviews: string[];
  setImagePreviews: (previews: string[]) => void;
  imageLocations: Map<string, { latitude: number; longitude: number }>;
  setImageLocations: (locations: Map<string, { latitude: number; longitude: number }>) => void;
}

export function PropertyImagesStep({
  watch,
  setValue,
  isEditMode,
  existingImages,
  setExistingImages,
  imagePreviews,
  setImagePreviews,
  imageLocations,
  setImageLocations
}: PropertyImagesStepProps) {
  const [imageSlots, setImageSlots] = useState<ImageSlotData[]>(
    Array(MAX_IMAGES).fill(null).map(() => ({ file: null, preview: null, location: undefined }))
  );
  const [showModal, setShowModal] = useState(false);
  const [modalSlotIndex, setModalSlotIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraSlotIndex, setCameraSlotIndex] = useState<number | null>(null);

  // Initialize slots from existing images and previews - rebuild sequentially with no gaps
  useEffect(() => {
    setImageSlots(prevSlots => {
      // Start with empty slots
      const slots: ImageSlotData[] = Array(MAX_IMAGES).fill(null).map(() => ({ 
        file: null, 
        preview: null, 
        location: undefined 
      }));
      
      let slotIndex = 0;
      
      // Add existing images (edit mode) - place sequentially
      if (isEditMode && existingImages.length > 0) {
        existingImages.forEach((imageUrl) => {
          if (slotIndex < MAX_IMAGES) {
            // Find existing slot with this preview to preserve location
            const existingSlot = prevSlots.find(s => s.preview === imageUrl);
            const restoredLocation = imageLocations.get(imageUrl);
            slots[slotIndex] = { 
              file: null, 
              preview: imageUrl, 
              location: existingSlot?.location || restoredLocation
            };
            slotIndex++;
          }
        });
      }
      
      // Add new image previews - place sequentially after existing images
      const images = watch('images');
      imagePreviews.forEach((preview, previewIndex) => {
        if (slotIndex < MAX_IMAGES) {
          const file = images[previewIndex] || null;
          // Find existing slot with this preview to preserve location
          const existingSlot = prevSlots.find(s => s.preview === preview);
          const restoredLocation = imageLocations.get(preview);
          slots[slotIndex] = { 
            file, 
            preview, 
            location: existingSlot?.location || restoredLocation
          };
          slotIndex++;
        }
      });

      return slots;
    });
  }, [existingImages, imagePreviews, isEditMode, watch, imageLocations]);


  const handleSlotClick = (index: number) => {
    const slot = imageSlots[index];
    if (slot.file || slot.preview) {
      // Slot has image - show modal
      setModalSlotIndex(index);
      setShowModal(true);
    } else {
      // Empty slot - open camera
      setCameraSlotIndex(index);
      setShowCamera(true);
    }
  };

  const handleImageCapture = (file: File, location?: { latitude: number; longitude: number }) => {
    if (cameraSlotIndex !== null) {
      const index = cameraSlotIndex;
      const preview = URL.createObjectURL(file);
      
      // Get property location from form
      const propertyLat = watch('latitude');
      const propertyLon = watch('longitude');
      
      // Validate distance if both locations are available
      if (location && propertyLat && propertyLon) {
        const distance = calculateDistanceInMeters(
          propertyLat,
          propertyLon,
          location.latitude,
          location.longitude
        );
        
        console.log(`Distance from property: ${distance.toFixed(2)} meters`);
        
        if (distance > MAX_DISTANCE_FROM_PROPERTY_METERS) {
          console.warn(`Image is ${distance.toFixed(2)}m away from property location (max: ${MAX_DISTANCE_FROM_PROPERTY_METERS}m)`);
          // You can show a warning/error message here or prevent saving
          // For now, we'll just log it
        }
      }
      
      // Clean up old blob URL if replacing
      const oldSlot = imageSlots[index];
      if (oldSlot.preview && oldSlot.preview.startsWith('blob:')) {
        // Remove old location data from parent state
        const newLocations = new Map(imageLocations);
        newLocations.delete(oldSlot.preview);
        setImageLocations(newLocations);
        URL.revokeObjectURL(oldSlot.preview);
      }
      
      // Store location in parent state using preview URL as key
      if (location) {
        const newLocations = new Map(imageLocations);
        newLocations.set(preview, location);
        setImageLocations(newLocations);
      }
      
      const newSlots = [...imageSlots];
      newSlots[index] = { file, preview, location };
      setImageSlots(newSlots);

      // Update form values
      if (isEditMode && index < existingImages.length) {
        // Replacing existing image - remove from existing, add as new
        const newExisting = existingImages.filter((_, i) => i !== index);
        setExistingImages(newExisting);
        setValue('existingImages', newExisting, { shouldValidate: true });
        
        const currentImages = watch('images');
        const newImages = [...currentImages, file];
        setValue('images', newImages, { shouldValidate: true });
        
        const newPreviews = [...imagePreviews, preview];
        setImagePreviews(newPreviews);
      } else {
        // Adding/updating new image
        const imageIndex = isEditMode ? index - existingImages.length : index;
        const currentImages = watch('images');
        const newImages = [...currentImages];
        if (imageIndex < newImages.length) {
          newImages[imageIndex] = file;
        } else {
          newImages.push(file);
        }
        setValue('images', newImages, { shouldValidate: true });

        const newPreviews = [...imagePreviews];
        if (imageIndex < newPreviews.length) {
          newPreviews[imageIndex] = preview;
        } else {
          newPreviews.push(preview);
        }
        setImagePreviews(newPreviews);
      }

      setCameraSlotIndex(null);
      setShowCamera(false);
    }
  };

  const handleCameraClose = () => {
    setShowCamera(false);
    setCameraSlotIndex(null);
  };

  const handleRemove = () => {
    if (modalSlotIndex === null) return;

    const slot = imageSlots[modalSlotIndex];
    
    // Revoke object URL if it's a new image
    if (slot.preview && slot.preview.startsWith('blob:')) {
      // Remove location data from parent state
      const newLocations = new Map(imageLocations);
      newLocations.delete(slot.preview);
      setImageLocations(newLocations);
      URL.revokeObjectURL(slot.preview);
    } else if (slot.preview) {
      // Also remove for non-blob URLs (existing images)
      const newLocations = new Map(imageLocations);
      newLocations.delete(slot.preview);
      setImageLocations(newLocations);
    }

    // Update form values first
    if (isEditMode && modalSlotIndex < existingImages.length) {
      // Remove existing image and shift remaining
      const newExisting = existingImages.filter((_, i) => i !== modalSlotIndex);
      setExistingImages(newExisting);
      setValue('existingImages', newExisting, { shouldValidate: true });
    } else {
      // Remove new image and shift remaining
      const imageIndex = isEditMode ? modalSlotIndex - existingImages.length : modalSlotIndex;
      const currentImages = watch('images');
      const newImages = currentImages.filter((_, i) => i !== imageIndex);
      setValue('images', newImages, { shouldValidate: true });

      const newPreviews = imagePreviews.filter((_, i) => i !== imageIndex);
      setImagePreviews(newPreviews);
    }

    // Rebuild slots array - shift images forward to fill gaps
    const newSlots: ImageSlotData[] = Array(MAX_IMAGES).fill(null).map(() => ({ 
      file: null, 
      preview: null, 
      location: undefined 
    }));

    // Rebuild slots by collecting all filled slots (except the deleted one) and placing them sequentially
    let targetIndex = 0;
    imageSlots.forEach((slot, index) => {
      if (index !== modalSlotIndex && (slot.file || slot.preview)) {
        // Keep this slot, move it to targetIndex
        newSlots[targetIndex] = { ...slot };
        targetIndex++;
      }
    });

    setImageSlots(newSlots);

    setShowModal(false);
    setModalSlotIndex(null);
  };

  const handleReplace = () => {
    if (modalSlotIndex === null) return;
    
    setCameraSlotIndex(modalSlotIndex);
    setShowModal(false);
    setModalSlotIndex(null);
    setShowCamera(true);
  };

  const handleReorder = (items: DraggableItem[]) => {
    // Rebuild slots array based on new order
    const newSlots: ImageSlotData[] = items.map(item => {
      const originalIndex = parseInt(item.id.replace('slot-', ''));
      return imageSlots[originalIndex];
    });

    // Ensure we have MAX_IMAGES slots
    while (newSlots.length < MAX_IMAGES) {
      newSlots.push({ file: null, preview: null, location: undefined });
    }

    setImageSlots(newSlots);

    // Update form arrays to match new order
    const newExisting: string[] = [];
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    newSlots.forEach((slot, index) => {
      if (slot.preview) {
        if (isEditMode && index < existingImages.length && !slot.file) {
          // Existing image
          newExisting.push(slot.preview);
        } else if (slot.file) {
          // New image with file
          newFiles.push(slot.file);
          if (slot.preview.startsWith('blob:')) {
            newPreviews.push(slot.preview);
          }
        }
      }
    });

    if (isEditMode) {
      setExistingImages(newExisting);
      setValue('existingImages', newExisting, { shouldValidate: true });
    }
    
    setValue('images', newFiles, { shouldValidate: true });
    setImagePreviews(newPreviews);
  };

  const createSlotItem = (slot: ImageSlotData, index: number): DraggableItem => {
    const isEmpty = !slot.file && !slot.preview;
    
    // Calculate order number (count filled slots before this one)
    const orderNumber = isEmpty ? 0 : imageSlots.slice(0, index + 1).filter(s => s.file || s.preview).length;
    
    const content = (
      <SlotWrapper>
        <ImageSlot isEmpty={isEmpty}>
          {isEmpty ? (
            <PlaceholderButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSlotClick(index);
              }}
              onMouseDown={(e) => {
                // Prevent drag from starting when clicking the button
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                // Prevent drag on touch devices
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ 
                position: 'relative',
                zIndex: 100
              }}
            >
              <Plus />
              <PlaceholderText>Add Photo</PlaceholderText>
            </PlaceholderButton>
          ) : (
            <ImageContent>
              <ImagePreview src={slot.preview || undefined} alt={`Property ${index + 1}`} />
              <RemoveButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalSlotIndex(index);
                  setShowModal(true);
                }}
              >
                <X />
              </RemoveButton>
              <OrderBadge>
                {orderNumber}
              </OrderBadge>
            </ImageContent>
          )}
        </ImageSlot>
        {!isEmpty && slot.location && (() => {
          const propertyLat = watch('latitude');
          const propertyLon = watch('longitude');
          let distance: number | null = null;
          let isWithinRange = true;
          
          if (propertyLat && propertyLon) {
            distance = calculateDistanceInMeters(
              propertyLat,
              propertyLon,
              slot.location.latitude,
              slot.location.longitude
            );
            isWithinRange = distance <= MAX_DISTANCE_FROM_PROPERTY_METERS;
          }
          
          return (
            <>
              <LocationInfo>
                📍 {slot.location.latitude.toFixed(6)}, {slot.location.longitude.toFixed(6)}
              </LocationInfo>
              {distance !== null && (
                <DistanceInfo isWithinRange={isWithinRange}>
                  {isWithinRange ? '✓' : '⚠'} {distance.toFixed(1)}m from property
                </DistanceInfo>
              )}
            </>
          );
        })()}
        {!isEmpty && !slot.location && (
          <LocationInfo>
            No location data
          </LocationInfo>
        )}
      </SlotWrapper>
    );

    return createDraggableItem(`slot-${index}`, content);
  };

  const draggableItems = imageSlots.map((slot, index) => createSlotItem(slot, index));

  const filledSlots = imageSlots.filter(slot => slot.file || slot.preview).length;

  return (
    <Section>
      <InfoMessage>
        <strong>📸 Image Requirements:</strong> You can take images later, but you'll need at least <strong>3 images</strong> for your property to be listed. Currently you have <strong>{filledSlots}</strong> image{filledSlots !== 1 ? 's' : ''}.
      </InfoMessage>

      <DraggableList
        items={draggableItems}
        onReorder={handleReorder}
        gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
        gap="1rem"
        showIndex={false}
        dragHandleIcon="grip"
        handlePosition="corner"
      />

      {showModal && modalSlotIndex !== null && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Image Options</ModalTitle>
            <p style={{ margin: 0, color: '#666' }}>
              What would you like to do with this image?
            </p>
            <ModalActions>
              <ModalButton variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" onClick={handleReplace}>
                Replace
              </ModalButton>
              <ModalButton variant="danger" onClick={handleRemove}>
                Remove
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {showCamera && (
        <GridCamera
          onCapture={handleImageCapture}
          onClose={handleCameraClose}
        />
      )}
    </Section>
  );
}

import PropertyImage from '../models/PropertyImage';
import Property from '../models/Property';

export interface ImageMetadata {
  s3Key: string;
  s3Url: string;
  order: number;
  latitude?: number;
  longitude?: number;
}

export const createPropertyImages = async (
  propertyId: number,
  images: ImageMetadata[]
): Promise<PropertyImage[]> => {
  // Verify property exists
  const property = await Property.findByPk(propertyId);
  if (!property) {
    throw new Error('Property not found');
  }

  // Create all image records
  const imageRecords = await Promise.all(
    images.map((image) =>
      PropertyImage.create({
        propertyId,
        s3Key: image.s3Key,
        s3Url: image.s3Url,
        order: image.order,
        latitude: image.latitude,
        longitude: image.longitude,
      })
    )
  );

  return imageRecords;
};

export const getPropertyImages = async (
  propertyId: number
): Promise<PropertyImage[]> => {
  const images = await PropertyImage.findAll({
    where: { propertyId },
    order: [['order', 'ASC']],
  });
  return images;
};

export const deletePropertyImage = async (
  id: number,
  propertyId: number
): Promise<boolean> => {
  const image = await PropertyImage.findOne({
    where: { id, propertyId },
  });

  if (!image) {
    throw new Error('Image not found or does not belong to this property');
  }

  await image.destroy();
  return true;
};

export const reorderPropertyImages = async (
  propertyId: number,
  imageOrders: Array<{ id: number; order: number }>
): Promise<void> => {
  // Verify property exists
  const property = await Property.findByPk(propertyId);
  if (!property) {
    throw new Error('Property not found');
  }

  // Update each image's order
  await Promise.all(
    imageOrders.map(({ id, order }) =>
      PropertyImage.update(
        { order },
        {
          where: { id, propertyId },
        }
      )
    )
  );
};


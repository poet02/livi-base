// Import all models
import User from './User';
import Property from './Property';
import PropertyImage from './PropertyImage';

// Set up associations
Property.hasMany(PropertyImage, {
  foreignKey: 'propertyId',
  as: 'images',
  onDelete: 'CASCADE',
});

PropertyImage.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property',
});

// Export all models
export { User, Property, PropertyImage };


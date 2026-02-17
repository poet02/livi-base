import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail } from 'lucide-react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import {
  Container,
  Header,
  BackButton,
  PropertyImage,
  ImageOverlay,
  Price,
  Title,
  Address,
  Content,
  Section,
  SectionTitle,
  DetailsGrid,
  DetailItem,
  DetailIcon,
  DetailValue,
  DetailLabel,
  Description,
  AmenitiesGrid,
  AmenityItem,
  ActionBar,
  ActionButton,
  IconButton,
  GalleryModal,
  CloseGalleryButton,
  GalleryContainer,
} from './Property.styled';

// Mock data
const mockProperty = {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 250000,
    address: '123 Main Street, Downtown, New York, NY 10001',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200'
    ],
    type: 'apartment',
    featured: true,
    description: 'Beautiful modern apartment in the heart of downtown. This spacious 2-bedroom, 2-bathroom unit features floor-to-ceiling windows with stunning city views, hardwood floors throughout, and a gourmet kitchen with stainless steel appliances. The building offers 24-hour concierge, fitness center, and rooftop terrace.',
    amenities: [
        'Floor-to-ceiling windows',
        'Hardwood floors',
        'Gourmet kitchen',
        'Stainless steel appliances',
        'In-unit laundry',
        'Central air conditioning',
        '24-hour concierge',
        'Fitness center',
        'Rooftop terrace',
        'Pet friendly',
        'Swimming pool',
        'Parking available'
    ],
    yearBuilt: 2018,
    parking: 1,
    petFriendly: true
};

export function Property() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [property] = useState(mockProperty);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        // In a real app, you would fetch the property data based on the ID
        console.log('Loading property:', id);
    }, [id]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleContactAgent = () => {
        console.log('Contact agent');
    };

    const handleScheduleTour = () => {
        console.log('Schedule tour');
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleShare = () => {
        console.log('Share property');
    };

    const handleImageClick = () => {
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setIsGalleryOpen(false);
    };

    // Convert property images to react-image-gallery format
    const galleryImages = property.images.map((image, index) => ({
        original: image,
        thumbnail: image,
        originalAlt: `${property.title} - Image ${index + 1}`,
        thumbnailAlt: `${property.title} - Thumbnail ${index + 1}`,
    }));

    if (!property) {
        return <div>Property not found</div>;
    }

    return (
        <Container>
            <Header onClick={handleImageClick}>
                <BackButton onClick={(e) => {
                    e.stopPropagation();
                    handleBack();
                }}>
                    <ArrowLeft color="#333" strokeWidth={2} />
                </BackButton>
                <PropertyImage src={property.images[0]} alt={property.title} />
                <ImageOverlay>
                    <Price>{formatPrice(property.price)}</Price>
                    <Title>{property.title}</Title>
                    <Address>
                        <MapPin />
                        {property.address}
                    </Address>
                </ImageOverlay>
            </Header>

            <Content>
                <Section>
                    <DetailsGrid>
                        <DetailItem>
                            <DetailIcon>
                                <Bed />
                            </DetailIcon>
                            <DetailValue>{property.bedrooms}</DetailValue>
                            <DetailLabel>Bedrooms</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <Bath />
                            </DetailIcon>
                            <DetailValue>{property.bathrooms}</DetailValue>
                            <DetailLabel>Bathrooms</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <Square />
                            </DetailIcon>
                            <DetailValue>{property.sqft.toLocaleString()}</DetailValue>
                            <DetailLabel>Sq Ft</DetailLabel>
                        </DetailItem>
                        <DetailItem>
                            <DetailIcon>
                                <MapPin />
                            </DetailIcon>
                            <DetailValue>{property.type}</DetailValue>
                            <DetailLabel>Type</DetailLabel>
                        </DetailItem>
                    </DetailsGrid>
                </Section>

                <Section>
                    <SectionTitle>Description</SectionTitle>
                    <Description>{property.description}</Description>
                </Section>

                <Section>
                    <SectionTitle>Amenities</SectionTitle>
                    <AmenitiesGrid>
                        {property.amenities.map((amenity, index) => (
                            <AmenityItem key={index}>
                                <span>•</span>
                                <span>{amenity}</span>
                            </AmenityItem>
                        ))}
                    </AmenitiesGrid>
                </Section>

                <Section>
                    <SectionTitle>Property Details</SectionTitle>
                    <AmenitiesGrid>
                        <AmenityItem>
                            <strong>Year Built:</strong> {property.yearBuilt}
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Parking:</strong> {property.parking} space(s)
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Pets:</strong> {property.petFriendly ? 'Allowed' : 'Not allowed'}
                        </AmenityItem>
                        <AmenityItem>
                            <strong>Status:</strong> {property.featured ? 'Featured' : 'Available'}
                        </AmenityItem>
                    </AmenitiesGrid>
                </Section>
            </Content>

            <ActionBar>
                <IconButton onClick={toggleFavorite}>
                    <Heart fill={isFavorite ? '#d32f2f' : 'none'} color={isFavorite ? '#d32f2f' : undefined} />
                </IconButton>
                <IconButton onClick={handleShare}>
                    <Share2 />
                </IconButton>
                <ActionButton variant="secondary" onClick={handleContactAgent}>
                    <Mail />
                    Contact
                </ActionButton>
                <ActionButton variant="primary" onClick={handleScheduleTour}>
                    <Phone />
                    Schedule Tour
                </ActionButton>
            </ActionBar>

            {/* Image Gallery Modal */}
            <GalleryModal isOpen={isGalleryOpen}>
                <CloseGalleryButton onClick={handleCloseGallery}>
                    ×
                </CloseGalleryButton>
                <GalleryContainer>
                    <ImageGallery
                        items={galleryImages}
                        showPlayButton={false}
                        showFullscreenButton={true}
                        showThumbnails={true}
                        showNav={true}
                        showBullets={false}
                        autoPlay={false}
                        additionalClass="property-gallery"
                        onScreenChange={() => {
                            // Handle fullscreen change if needed
                        }}
                    />
                </GalleryContainer>
            </GalleryModal>
        </Container>
    );
}
import styled from 'styled-components';
import { PlaceToStay } from '../types/search';
import { Star, MapPin } from 'lucide-react';
import { Card as BaseCard } from '../styles/common';

const Card = styled(BaseCard)`
  overflow: hidden;
  cursor: pointer;
  padding: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Badge = styled.div<{ featured?: boolean }>`
  position: absolute;
  top: ${props => props.theme.spacing.base};
  left: ${props => props.theme.spacing.base};
  background: ${props => props.featured ? props.theme.colors.error.main : props.theme.colors.primary.main};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Price = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary.main};
`;

const Title = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
`;

const Address = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.base};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ReviewCount = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors.border.light};
  padding-top: ${props => props.theme.spacing.base};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const DetailValue = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const DetailLabel = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Distance = styled.div`
  background: ${props => props.theme.colors.grey[100]};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
`;

const ImageContainer = styled.div`
  position: relative;
`;

interface PlaceCardProps {
  place: PlaceToStay;
  onClick?: (place: PlaceToStay) => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? 'gold' : 'none'}
        color="gold"
      />
    ));
  };

  return (
    <Card onClick={() => onClick?.(place)}>
      <ImageContainer>
        <Image src={place.image} alt={place.title} />
        {place.featured && <Badge featured>Featured</Badge>}
        <Badge>{place.type}</Badge>
      </ImageContainer>
      <Content>
        <Header>
          <Title>{place.title}</Title>
          <Price>${place.price}</Price>
        </Header>
        
        <Address>
          <MapPin size={14} />
          {place.address}
        </Address>

        <Rating>
          <Stars>
            {renderStars(place.rating)}
          </Stars>
          <span>{place.rating}</span>
          <ReviewCount>({place.reviewCount} reviews)</ReviewCount>
        </Rating>

        <Details>
          <DetailItem>
            <DetailValue>{place.bedrooms}</DetailValue>
            <DetailLabel>Bedrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{place.bathrooms}</DetailValue>
            <DetailLabel>Bathrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{place.sqft.toLocaleString()}</DetailValue>
            <DetailLabel>Sq Ft</DetailLabel>
          </DetailItem>
          {place.distance && (
            <Distance>{place.distance.toFixed(1)} km away</Distance>
          )}
        </Details>
      </Content>
    </Card>
  );
}
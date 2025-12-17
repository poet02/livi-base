/**
 * EXAMPLE: Refactored PropertyCard using the new design system
 * 
 * This shows how to refactor existing components to use:
 * 1. Theme values instead of hardcoded colors/spacing
 * 2. Common styled components when possible
 * 3. Consistent patterns
 * 
 * Compare this with the original PropertyCard.tsx
 */

import React from 'react';
import styled from 'styled-components';
import { Property } from '../hooks/usePropertySearch';
import { Card } from '../styles/common';
import { theme } from '../theme';

// Use shared Card component with customization
const PropertyCardContainer = styled(Card)`
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.slow};
  
  ${PropertyCardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.div<{ type: 'apartment' | 'house' | 'condo' }>`
  position: absolute;
  top: ${props => props.theme.spacing.base};
  left: ${props => props.theme.spacing.base};
  background: ${props => {
    switch (props.type) {
      case 'apartment': return props.theme.colors.primary.main;
      case 'house': return props.theme.colors.success.main;
      case 'condo': return props.theme.colors.warning.main;
      default: return props.theme.colors.grey[600];
    }
  }};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  text-transform: capitalize;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.base};
  right: ${props => props.theme.spacing.base};
  background: ${props => props.theme.colors.error.main};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.base};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Price = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary.main};
`;

const Title = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const Address = styled.p`
  margin: 0 0 ${props => props.theme.spacing.base} 0;
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

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

export const PropertyCardRefactored: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <PropertyCardContainer onClick={() => onClick?.(property)}>
      <ImageContainer>
        <Image src={property.image} alt={property.title} />
        <Badge type={property.type}>{property.type}</Badge>
        {property.featured && <FeaturedBadge>Featured</FeaturedBadge>}
      </ImageContainer>
      <Content>
        <Price>{formatPrice(property.price)}</Price>
        <Title>{property.title}</Title>
        <Address>{property.address}</Address>
        <Details>
          <DetailItem>
            <DetailValue>{property.bedrooms}</DetailValue>
            <DetailLabel>Bedrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{property.bathrooms}</DetailValue>
            <DetailLabel>Bathrooms</DetailLabel>
          </DetailItem>
          <DetailItem>
            <DetailValue>{property.sqft.toLocaleString()}</DetailValue>
            <DetailLabel>Sq Ft</DetailLabel>
          </DetailItem>
        </Details>
      </Content>
    </PropertyCardContainer>
  );
};


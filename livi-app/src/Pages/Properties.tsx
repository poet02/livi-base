// pages/PropertiesPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useUserProperties } from '../hooks/useUserProperties';
import type { Property } from '../hooks/usePropertySearch';
import { PropertyCard } from '../Components/PropertyCard';
import { HousePlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
`;

const Header = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.base};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.base};
`;

const ResultsCount = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.base};
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const BackButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`;

const Icon = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`;

export const Properties: React.FC = () => {
  const navigate = useNavigate();
  const { properties, loading } = useUserProperties();

  const handlePropertyClick = (property: Property) => {
    navigate(`/properties/${property.id}`);
  };

  const handleAddProperty = () => {
    navigate('/properties/add');
  };

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={handleBack}>
            <ArrowLeft color="#333" strokeWidth={2} size={20} />
          </BackButton>
          <Icon onClick={handleAddProperty}>
            <HousePlus color='blue' size={24} />
          </Icon>
        </HeaderContent>
      </Header>

      <ResultsSection>
        <ResultsHeader>
          <ResultsCount>
            {loading ? 'Loading...' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
          </ResultsCount>
        </ResultsHeader>

        {loading ? (
          <LoadingMessage>Loading properties...</LoadingMessage>
        ) : properties.length === 0 ? (
          <EmptyMessage>No properties found. Add your first property to get started!</EmptyMessage>
        ) : (
          <PropertiesGrid>
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={handlePropertyClick}
              />
            ))}
          </PropertiesGrid>
        )}
      </ResultsSection>
    </PageContainer>
  );
};

// export default PropertiesPage;
// a properties page
//add property button
//search bar at the top, with filter button on the right
// when filter is pressed, a side panel comes in from the right with filter options
//for now filter should just have min price and max price
//show list of filtered propereties under search bar
//for searching using a a custom hook usePropertySearch that takes in search query and filter options and returns list of properties
//use mock data for properties in the hook

// pages/PropertiesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePropertySearch, SearchFilters } from '../hooks/usePropertySearch';
import { PropertyCard } from '../Components/PropertyCard';
import { Search, HousePlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input as BaseInput } from '../styles/common';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.paper};
  padding: ${props => props.theme.spacing.xl};
  overflow-y: auto;
`;

const SearchSection = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.base};
  z-index: ${props => props.theme.zIndex.sticky};
  transform: translateY(${props => props.visible ? '0' : '-100%'});
  transition: transform ${props => props.theme.transitions.slow};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  align-items: center;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled(BaseInput)`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.base} ${props => props.theme.spacing.md} 3rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${props => props.theme.spacing.base};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
  width: 20px;
  height: 20px;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.background.default};
  color: ${props => props.active ? props.theme.colors.primary.contrast : props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.active ? '#1565c0' : '#f5f5f5'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ResultsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  padding-top: ${props => props.theme.spacing.base};
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

const IconSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    minPrice: 0,
    maxPrice: 0,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(searchFilters);
  const [showSearch, setShowSearch] = useState(true);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const currentScrollY = containerRef.current.scrollTop;

      if (currentScrollY <= 0) {
        setShowSearch(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setShowSearch(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setShowSearch(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const { properties, loading } = usePropertySearch(searchFilters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilters(prev => ({ ...prev, query: e.target.value }));
  };

  const handleFilterOpen = () => {
    setCurrentFilters(searchFilters);
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters);
  };

  const handleApplyFilters = () => {
    setSearchFilters(currentFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { query: searchFilters.query, minPrice: 0, maxPrice: 0 };
    setCurrentFilters(clearedFilters);
    setSearchFilters(clearedFilters);
  };

  const handlePropertyClick = (property: any) => {
    console.log('Property clicked:', property);
    navigate(`/properties/${property.id}`);

    // Navigate to property details page or show modal
  };

  const handleAddProperty = () => {
    console.log('Add property clicked');
    navigate('/properties/add');
    // Open add property modal or navigate to form
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <PageContainer ref={containerRef}>


      <SearchSection visible={showSearch}>
        <IconSection>
          <BackButton onClick={handleBack}>
            <ArrowLeft color="#333" strokeWidth={2} size={20} />
          </BackButton>
          <Icon>
            <HousePlus onClick={handleAddProperty} color='blue' size={24} />
          </Icon>
        </IconSection>

        <SearchContainer>
          <SearchInput>
            <SearchIcon />
            <Input
              type="text"
              placeholder="Search properties by title or address..."
              value={searchFilters.query}
              onChange={handleSearchChange}
            />
          </SearchInput>

        </SearchContainer>
      </SearchSection>

      <ResultsSection>
        <ResultsHeader>
          <ResultsCount>
            {loading ? 'Searching...' : `${properties.length} properties found`}
          </ResultsCount>
        </ResultsHeader>

        {loading ? (
          <LoadingMessage>Loading properties...</LoadingMessage>
        ) : properties.length === 0 ? (
          <EmptyMessage>No properties found matching your criteria.</EmptyMessage>
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
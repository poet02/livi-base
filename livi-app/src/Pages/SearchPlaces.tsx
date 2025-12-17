// pages/SearchPlaces.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Filter, Navigation } from 'lucide-react';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { PlacesFilterPanel } from '../Components/PlacesFilterPanel';
import { PlaceCard } from '../Components/PlaceCard';
import { popularDestinations } from '../data/mockPlaces';
import { Input as BaseInput, Button as BaseButton } from '../styles/common';
import { media } from '../styles/common';

const Container = styled.div`
  height: 100vh;
  overflow-y: auto;
  background: ${props => props.theme.colors.background.paper};
  color: ${props => props.theme.colors.text.primary};
`;

const Header = styled.div`
  background: ${props => props.theme.colors.background.default};
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const Title = styled.h1`
  margin: 0 0 ${props => props.theme.spacing.base} 0;
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 ${props => props.theme.spacing.xl} 0;
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const SearchSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  align-items: stretch;

  ${media.md`
    flex-direction: column;
  `}
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled(BaseInput)`
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.base} ${props => props.theme.spacing.base} 3rem;
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

const LocationButton = styled(BaseButton).attrs({ variant: 'secondary' })`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  white-space: nowrap;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchButton = styled(BaseButton).attrs({ variant: 'primary' })`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background: ${props => props.active ? props.theme.colors.primary.main : props.theme.colors.background.default};
  color: ${props => props.active ? props.theme.colors.primary.contrast : props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${props => props.theme.transitions.base};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary.dark : props.theme.colors.grey[100]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.base};
  align-items: center;
  margin-top: ${props => props.theme.spacing.base};
  justify-content: center;
`;

const ClearButton = styled(BaseButton).attrs({ variant: 'outline' })`
  padding: ${props => props.theme.spacing.base} ${props => props.theme.spacing.lg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing.lg};
`;

const ResultsSection = styled.div`
  margin-bottom: ${props => props.theme.spacing['3xl']};
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ResultsTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const ResultsCount = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
`;

const PlacesGrid = styled.div`
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

const SuggestionsSection = styled.div`
  margin-top: ${props => props.theme.spacing['3xl']};
`;

const SuggestionsTitle = styled.h2`
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
`;

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const DestinationCard = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  cursor: pointer;
  transition: transform ${props => props.theme.transitions.slow};

  &:hover {
    transform: translateY(-4px);
  }
`;

const DestinationImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DestinationOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: ${props => props.theme.spacing.lg};
  color: white;
`;

const DestinationName = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
`;

const DestinationCount = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export function SearchPlaces() {
    const navigate = useNavigate();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
        searchLocation,
        setSearchLocation,
        filters,
        setFilters,
        searchResults,
        isSearching,
        hasSearched,
        executeSearch,
        useCurrentLocation,
        clearSearch
    } = usePlaceSearch();

    const handleSearch = async () => {
        if (!searchLocation.address && !searchLocation.useCurrentLocation) {
            alert('Please enter a location or use your current location');
            return;
        }
        await executeSearch();
    };

    const handleUseCurrentLocation = () => {
        useCurrentLocation();
    };

    const handlePlaceClick = (place: any) => {
        // Navigate to property details or show more info
        navigate(`/properties/${place.id}`);
    };

    const handleDestinationClick = (destination: any) => {
        setSearchLocation({
            address: destination.name,
            useCurrentLocation: false
        });
    };

    const hasActiveFilters =
        filters.minPrice > 0 ||
        filters.maxPrice < 1000 ||
        filters.radius < 50 ||
        filters.minBedrooms > 0 ||
        filters.minBathrooms > 0 ||
        filters.minSqft > 0 ||
        filters.maxSqft < 5000 ||
        filters.types.length > 0 ||
        filters.minRating > 0;

    return (
        <Container>
            <Header>
                <Title>Find Your Perfect Stay</Title>
                <Subtitle>Discover places to stay around the world</Subtitle>

                <SearchSection>
                    <SearchContainer>
                        <SearchInput>
                            <SearchIcon />
                            <Input
                                type="text"
                                placeholder="Search by city, address, or landmark..."
                                value={searchLocation.address}
                                onChange={(e) => setSearchLocation(prev => ({
                                    ...prev,
                                    address: e.target.value,
                                    useCurrentLocation: false
                                }))}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </SearchInput>

                        <LocationButton onClick={handleUseCurrentLocation}>
                            <Navigation size={16} />
                            My Location
                        </LocationButton>

                        <SearchButton
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            <Search />
                            {isSearching ? 'Searching...' : 'Search'}
                        </SearchButton>
                    </SearchContainer>

                    <ActionsRow>
                        <FilterButton
                            active={hasActiveFilters}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter />
                            Filters
                        </FilterButton>

                        {hasSearched && (
                            <ClearButton onClick={clearSearch}>
                                Clear Search
                            </ClearButton>
                        )}
                    </ActionsRow>
                </SearchSection>
            </Header>

            <Content>
                {hasSearched ? (
                    <ResultsSection>
                        <ResultsHeader>
                            <ResultsTitle>Search Results</ResultsTitle>
                            <ResultsCount>
                                {searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'} found
                                {searchLocation.useCurrentLocation && ' near you'}
                            </ResultsCount>
                        </ResultsHeader>

                        {isSearching ? (
                            <LoadingMessage>Searching for places...</LoadingMessage>
                        ) : searchResults.length === 0 ? (
                            <EmptyMessage>
                                No properties found matching your criteria. Try adjusting your filters or search location.
                            </EmptyMessage>
                        ) : (
                            <PlacesGrid>
                                {searchResults.map(place => (
                                    <PlaceCard
                                        key={place.id}
                                        place={place}
                                        onClick={handlePlaceClick}
                                    />
                                ))}
                            </PlacesGrid>
                        )}
                    </ResultsSection>
                ) : (
                    <SuggestionsSection>
                        <SuggestionsTitle>Popular Destinations</SuggestionsTitle>
                        <DestinationsGrid>
                            {popularDestinations.map((destination, index) => (
                                <DestinationCard
                                    key={index}
                                    onClick={() => handleDestinationClick(destination)}
                                >
                                    <DestinationImage src={destination.image} alt={destination.name} />
                                    <DestinationOverlay>
                                        <DestinationName>{destination.name}</DestinationName>
                                        <DestinationCount>{destination.count}</DestinationCount>
                                    </DestinationOverlay>
                                </DestinationCard>
                            ))}
                        </DestinationsGrid>
                    </SuggestionsSection>
                )}
            </Content>

            <PlacesFilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleSearch}
                onClearFilters={() => {
                    setFilters({
                        minPrice: 0,
                        maxPrice: 1000,
                        radius: 50,
                        minBedrooms: 0,
                        minBathrooms: 0,
                        minSqft: 0,
                        maxSqft: 5000,
                        types: [],
                        minRating: 0
                    });
                }}
            />
        </Container>
    );
}
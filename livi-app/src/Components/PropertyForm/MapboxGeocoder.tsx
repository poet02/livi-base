import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Search, X } from 'lucide-react';
import { MapboxFeature } from './types';

const GeocoderContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputContainer = styled.div<{ hasError?: boolean; isFocused?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid ${props => 
    props.hasError 
      ? props.theme.colors.error.main 
      : props.isFocused 
        ? props.theme.colors.primary.main 
        : props.theme.colors.border.light
  };
  border-radius: ${props => props.theme.borderRadius.base};
  background: ${props => props.theme.colors.background.default};
  transition: all ${props => props.theme.transitions.base};
  box-shadow: ${props => 
    props.isFocused 
      ? `0 0 0 2px ${props.hasError ? props.theme.colors.error.main + '33' : props.theme.colors.primary.main + '33'}`
      : 'none'
  };
`;

const SearchIcon = styled.div`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  outline: none;
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: inherit;
  background: transparent;
  color: ${props => props.theme.colors.text.primary};

  &::placeholder {
    color: ${props => props.theme.colors.text.disabled};
  }
`;

const ClearButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.secondary};
  transition: color ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: ${props => props.theme.spacing.xs};
  background: ${props => props.theme.colors.background.default};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  box-shadow: ${props => props.theme.shadows.lg};
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin-bottom: 0;
`;

const SuggestionItem = styled.li<{ isHighlighted?: boolean }>`
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  background: ${props => 
    props.isHighlighted 
      ? props.theme.colors.primary.main + '10' 
      : 'transparent'
  };
  transition: background-color ${props => props.theme.transitions.base};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.primary.main + '10'};
  }
`;

const SuggestionText = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SuggestionAddress = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const LoadingIndicator = styled.div`
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.xs};
  display: block;
`;

interface MapboxGeocoderProps {
  value: string;
  onChange: (feature: MapboxFeature | null) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  accessToken: string;
}

export function MapboxGeocoder({
  value,
  onChange,
  onInputChange,
  placeholder = 'Search for an address...',
  hasError = false,
  errorMessage,
  accessToken,
}: MapboxGeocoderProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${accessToken}&` +
          `limit=5&` +
          `types=address,poi,place`
        );

        if (!response.ok) {
          throw new Error('Geocoding request failed');
        }

        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error('Error fetching geocoding suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, accessToken]);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onInputChange?.(newValue);
    setHighlightedIndex(-1);
  };

  const handleSelect = (feature: MapboxFeature) => {
    setQuery(feature.place_name);
    onChange(feature);
    setSuggestions([]);
    setIsFocused(false);
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    onInputChange?.('');
    setSuggestions([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSuggestions([]);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <GeocoderContainer ref={containerRef}>
      <SearchInputContainer hasError={hasError} isFocused={isFocused}>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        {query && (
          <ClearButton onClick={handleClear} type="button" aria-label="Clear">
            <X size={18} />
          </ClearButton>
        )}
      </SearchInputContainer>
      
      {isFocused && (suggestions.length > 0 || isLoading) && (
        <SuggestionsList>
          {isLoading ? (
            <LoadingIndicator>Searching...</LoadingIndicator>
          ) : (
            suggestions.map((feature, index) => (
              <SuggestionItem
                key={feature.id}
                isHighlighted={index === highlightedIndex}
                onClick={() => handleSelect(feature)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <SuggestionText>{feature.text}</SuggestionText>
                <SuggestionAddress>{feature.place_name}</SuggestionAddress>
              </SuggestionItem>
            ))
          )}
        </SuggestionsList>
      )}
      
      {hasError && errorMessage && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </GeocoderContainer>
  );
}


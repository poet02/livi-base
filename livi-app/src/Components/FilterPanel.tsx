// components/FilterPanel.tsx
import React from 'react';
import styled from 'styled-components';
import { FilterOptions } from '../hooks/usePropertySearch';
import { Input as BaseInput, Button as BaseButton, Label as BaseLabel, Section as BaseSection, SectionTitle as BaseSectionTitle } from '../styles/common';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background.overlay};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: ${props => props.theme.transitions.slow};
  z-index: ${props => props.theme.zIndex.modalBackdrop};
`;

const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: ${props => props.theme.colors.background.default};
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform ${props => props.theme.transitions.slow};
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  padding: ${props => props.theme.spacing.sm};
  transition: color ${props => props.theme.transitions.base};

  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
`;

const Section = styled(BaseSection)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled(BaseSectionTitle)`
  margin: 0 0 ${props => props.theme.spacing.base} 0;
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const InputGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.base};
`;

const Label = styled(BaseLabel)`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Input = styled(BaseInput)`
  width: 100%;
`;

const Actions = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  gap: ${props => props.theme.spacing.base};
`;

const Button = styled(BaseButton)`
  flex: 1;
`;

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onFiltersChange({ ...filters, minPrice: value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onFiltersChange({ ...filters, maxPrice: value });
  };

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Panel isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Filter Properties</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        
        <Content>
          <Section>
            <SectionTitle>Price Range</SectionTitle>
            
            <InputGroup>
              <Label htmlFor="minPrice">Minimum Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={handleMinPriceChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="maxPrice">Maximum Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="No limit"
                value={filters.maxPrice || ''}
                onChange={handleMaxPriceChange}
              />
            </InputGroup>
          </Section>
        </Content>
        
        <Actions>
          <Button variant="secondary" onClick={onClearFilters}>
            Clear All
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply Filters
          </Button>
        </Actions>
      </Panel>
    </Overlay>
  );
};

export default FilterPanel;
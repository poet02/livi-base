/**
 * Common styled-components utilities and helpers
 * Reusable styled components that can be shared across the app
 */

import styled, { css } from 'styled-components';
import { theme } from '../theme';

// Container with max-width and centered
export const Container = styled.div<{ maxWidth?: string; padding?: string }>`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${props => props.padding || theme.spacing.base};
`;

// Flexbox utilities
export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: string;
  justify?: string;
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

// Grid utility
export const Grid = styled.div<{
  columns?: number | string;
  gap?: string;
  minColumnWidth?: string;
}>`
  display: grid;
  grid-template-columns: ${props => {
    if (typeof props.columns === 'number') {
      return `repeat(${props.columns}, 1fr)`;
    }
    if (props.minColumnWidth) {
      return `repeat(auto-fill, minmax(${props.minColumnWidth}, 1fr))`;
    }
    return props.columns || '1fr';
  }};
  gap: ${props => props.gap || theme.spacing.base};
`;

// Card component
export const Card = styled.div<{ hover?: boolean; padding?: string }>`
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.base};
  padding: ${props => props.padding || theme.spacing.lg};
  transition: ${theme.transitions.base};

  ${props => props.hover && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`;

// Button variants
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
  transition: ${theme.transitions.base};
  cursor: pointer;
  border: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  ${buttonBase}
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.grey[100]};
          color: ${theme.colors.text.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.grey[200]};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.main};
            color: ${theme.colors.primary.contrast};
          }
        `;
      default:
        return css`
          background: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrast};
        `;
    }
  }}
`;

// Input component
export const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.hasError ? theme.colors.error.main : theme.colors.border.light};
  border-radius: ${theme.borderRadius.base};
  font-size: ${theme.typography.fontSize.base};
  font-family: inherit;
  transition: ${theme.transitions.base};
  background: ${theme.colors.background.default};
  color: ${theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? theme.colors.error.main : theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? `${theme.colors.error.main}33` 
        : `${theme.colors.primary.main}33`
    };
  }

  &::placeholder {
    color: ${theme.colors.text.disabled};
  }

  &:disabled {
    background: ${theme.colors.grey[100]};
    cursor: not-allowed;
  }
`;

// Label component
export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
`;

// Section/Heading components
export const Section = styled.section`
  margin-bottom: ${theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

// Responsive helper
export const media = {
  xs: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${theme.breakpoints.xs}) {
      ${styles}
    }
  `,
  sm: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  md: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  lg: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  xl: (styles: TemplateStringsArray | string) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${styles}
    }
  `,
};


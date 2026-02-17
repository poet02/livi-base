/**
 * Standardized Responsive Component Patterns
 * Reusable responsive components following mobile-first methodology
 */

import styled, { css } from 'styled-components';
import type { Theme } from '../theme/theme';

/**
 * Standardized responsive container
 * Prevents horizontal scrolling and provides consistent padding
 */
export const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: ${(props: { theme: Theme }) => props.theme.responsive.spacing.containerPadding.mobile};
  overflow-x: hidden; // Prevent horizontal scroll
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    padding: ${(props: { theme: Theme }) => props.theme.responsive.spacing.containerPadding.tablet};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    padding: ${(props: { theme: Theme }) => props.theme.responsive.spacing.containerPadding.desktop};
  }
`;

/**
 * Standardized responsive grid
 * Automatically adapts columns based on screen size
 */
export const ResponsiveGrid = styled.div<{ 
  mobileColumns: number;
  tabletColumns?: number;
  desktopColumns?: number;
  gap?: string;
}>`
  display: grid;
  grid-template-columns: repeat(${(props: { mobileColumns: number; theme: Theme }) => props.mobileColumns}, 1fr);
  gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(${(props: { mobileColumns: number; tabletColumns?: number; theme: Theme }) => props.tabletColumns || props.mobileColumns}, 1fr);
    gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${(props: { mobileColumns: number; tabletColumns?: number; desktopColumns?: number; theme: Theme }) => props.desktopColumns || props.tabletColumns || props.mobileColumns}, 1fr);
    gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.lg};
  }
`;

/**
 * Standardized responsive button
 * Appropriate sizing for touch targets on mobile
 */
export const ResponsiveButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}>`
  padding: ${(props: { theme: Theme }) => props.theme.responsive.button.padding.mobile};
  font-size: ${(props: { theme: Theme }) => props.theme.typography.fontSize.sm};
  min-height: ${(props: { theme: Theme }) => props.theme.responsive.button.minHeight.mobile};
  border-radius: ${(props: { theme: Theme }) => props.theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: ${(props: { theme: Theme }) => props.theme.transitions.base};
  width: ${(props: { fullWidth?: boolean }) => props.fullWidth ? '100%' : 'auto'};
  
  ${(props: { variant?: 'primary' | 'secondary' | 'outline'; theme: Theme }) => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.primary.main};
          color: ${props.theme.colors.primary.contrast};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary.dark};
          }
        `;
      case 'secondary':
        return css`
          background: ${props.theme.colors.secondary.main};
          color: ${props.theme.colors.secondary.contrast};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.secondary.dark};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.primary.main};
          border: 1px solid ${props.theme.colors.primary.main};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary.main}10;
          }
        `;
      default:
        return css`
          background: ${props.theme.colors.background.default};
          color: ${props.theme.colors.text.primary};
          border: 1px solid ${props.theme.colors.border.light};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.grey[100]};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    padding: ${(props: { theme: Theme }) => props.theme.responsive.button.padding.tablet};
    font-size: ${(props: { theme: Theme }) => props.theme.typography.fontSize.base};
    min-height: ${(props: { theme: Theme }) => props.theme.responsive.button.minHeight.tablet};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    padding: ${(props: { theme: Theme }) => props.theme.responsive.button.padding.desktop};
    min-height: ${(props: { theme: Theme }) => props.theme.responsive.button.minHeight.desktop};
  }
`;

/**
 * Responsive image grid for property images
 * 4 columns on mobile, adaptive on larger screens
 */
export const ResponsiveImageGrid = styled.div<{
  gap?: string;
}>`
  display: grid;
  grid-template-columns: ${(props: { theme: Theme }) => props.theme.responsive.grid.imageGrid.mobile};
  gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    grid-template-columns: ${(props: { theme: Theme }) => props.theme.responsive.grid.imageGrid.tablet};
    gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.md}) {
    grid-template-columns: ${(props: { theme: Theme }) => props.theme.responsive.grid.imageGrid.desktop};
    gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.lg};
  }
`;

/**
 * Responsive flex container
 * Adapts direction and gap based on screen size
 */
export const ResponsiveFlex = styled.div<{
  direction?: 'row' | 'column';
  mobileDirection?: 'row' | 'column';
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${(props: { mobileDirection?: 'row' | 'column'; direction?: 'row' | 'column' }) => props.mobileDirection || props.direction || 'column'};
  gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.sm};
  align-items: ${(props: { align?: string }) => props.align || 'stretch'};
  justify-content: ${(props: { justify?: string }) => props.justify || 'flex-start'};
  flex-wrap: ${(props: { wrap?: boolean }) => props.wrap ? 'wrap' : 'nowrap'};
  width: 100%;
  
  @media (min-width: ${(props: { theme: Theme }) => props.theme.breakpoints.sm}) {
    flex-direction: ${(props: { direction?: 'row' | 'column' }) => props.direction || 'row'};
    gap: ${(props: { gap?: string; theme: Theme }) => props.gap || props.theme.spacing.base};
  }
`;


/**
 * Standardized Responsive Component Patterns
 * Reusable responsive components following mobile-first methodology
 */

import styled, { css } from 'styled-components';

/**
 * Standardized responsive container
 * Prevents horizontal scrolling and provides consistent padding
 */
export const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: ${(props: any) => props.theme.responsive.spacing.containerPadding.mobile};
  overflow-x: hidden; // Prevent horizontal scroll
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    padding: ${(props: any) => props.theme.responsive.spacing.containerPadding.tablet};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    padding: ${(props: any) => props.theme.responsive.spacing.containerPadding.desktop};
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
  grid-template-columns: repeat(${(props: any) => props.mobileColumns}, 1fr);
  gap: ${(props: any) => props.gap || props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(${(props: any) => props.tabletColumns || props.mobileColumns}, 1fr);
    gap: ${(props: any) => props.gap || props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${(props: any) => props.desktopColumns || props.tabletColumns || props.mobileColumns}, 1fr);
    gap: ${(props: any) => props.gap || props.theme.spacing.lg};
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
  padding: ${(props: any) => props.theme.responsive.button.padding.mobile};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  min-height: ${(props: any) => props.theme.responsive.button.minHeight.mobile};
  border-radius: ${(props: any) => props.theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: ${(props: any) => props.theme.transitions.base};
  width: ${(props: any) => props.fullWidth ? '100%' : 'auto'};
  
  ${(props: any) => {
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
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    padding: ${(props: any) => props.theme.responsive.button.padding.tablet};
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    min-height: ${(props: any) => props.theme.responsive.button.minHeight.tablet};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    padding: ${(props: any) => props.theme.responsive.button.padding.desktop};
    min-height: ${(props: any) => props.theme.responsive.button.minHeight.desktop};
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
  grid-template-columns: ${(props: any) => props.theme.responsive.grid.imageGrid.mobile};
  gap: ${(props: any) => props.gap || props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    grid-template-columns: ${(props: any) => props.theme.responsive.grid.imageGrid.tablet};
    gap: ${(props: any) => props.gap || props.theme.spacing.base};
  }
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.md}) {
    grid-template-columns: ${(props: any) => props.theme.responsive.grid.imageGrid.desktop};
    gap: ${(props: any) => props.gap || props.theme.spacing.lg};
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
  flex-direction: ${(props: any) => props.mobileDirection || props.direction || 'column'};
  gap: ${(props: any) => props.gap || props.theme.spacing.sm};
  align-items: ${(props: any) => props.align || 'stretch'};
  justify-content: ${(props: any) => props.justify || 'flex-start'};
  flex-wrap: ${(props: any) => props.wrap ? 'wrap' : 'nowrap'};
  width: 100%;
  
  @media (min-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-direction: ${(props: any) => props.direction || 'row'};
    gap: ${(props: any) => props.gap || props.theme.spacing.base};
  }
`;


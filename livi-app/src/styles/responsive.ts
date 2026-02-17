/**
 * Mobile-First Responsive Utilities
 * Industry-standard responsive helper functions following mobile-first methodology
 */

import { css } from 'styled-components';
import { theme } from '../theme';

/**
 * Mobile-first media query helpers
 * Base styles are for mobile, then enhance for larger screens
 */
export const mobileFirst = {
  // Tablet and up (640px+)
  tablet: (styles: TemplateStringsArray | string | ReturnType<typeof css>) => css`
    @media (min-width: ${theme.breakpoints.sm}) {
      ${styles}
    }
  `,
  // Desktop and up (768px+)
  desktop: (styles: TemplateStringsArray | string | ReturnType<typeof css>) => css`
    @media (min-width: ${theme.breakpoints.md}) {
      ${styles}
    }
  `,
  // Large desktop and up (1024px+)
  large: (styles: TemplateStringsArray | string | ReturnType<typeof css>) => css`
    @media (min-width: ${theme.breakpoints.lg}) {
      ${styles}
    }
  `,
  // XL desktop and up (1280px+)
  xl: (styles: TemplateStringsArray | string | ReturnType<typeof css>) => css`
    @media (min-width: ${theme.breakpoints.xl}) {
      ${styles}
    }
  `,
};

/**
 * Responsive value helper
 * Provides mobile, tablet, and desktop values in a mobile-first approach
 * 
 * @example
 * const Component = styled.div`
 *   padding: 1rem;
 *   ${mobileFirst.tablet`padding: 1.5rem;`}
 *   ${mobileFirst.desktop`padding: 2rem;`}
 * `;
 * 
 * Note: For simpler cases, use mobileFirst helpers directly
 */

/**
 * Hide element on specific breakpoints
 */
export const hideOn = {
  mobile: css`
    @media (max-width: 639px) {
      display: none !important;
    }
  `,
  tablet: css`
    @media (min-width: ${theme.breakpoints.sm}) and (max-width: 767px) {
      display: none !important;
    }
  `,
  desktop: css`
    @media (min-width: ${theme.breakpoints.md}) {
      display: none !important;
    }
  `,
};

/**
 * Show element only on specific breakpoints
 */
export const showOn = {
  mobile: css`
    @media (min-width: ${theme.breakpoints.sm}) {
      display: none !important;
    }
  `,
  tablet: css`
    display: none;
    @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${parseInt(theme.breakpoints.md) - 1}px) {
      display: block;
    }
  `,
  desktop: css`
    display: none;
    @media (min-width: ${theme.breakpoints.md}) {
      display: block;
    }
  `,
};


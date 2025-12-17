/**
 * Design System Theme
 * Centralized theme configuration for consistent styling across the application
 */

export const theme = {
  // Color Palette
  colors: {
    // Primary brand colors
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrast: '#ffffff',
    },
    // Secondary colors
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrast: '#ffffff',
    },
    // Semantic colors
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrast: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrast: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrast: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrast: '#ffffff',
    },
    // Neutral colors
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e0e0e0',
      300: '#bdbdbd',
      400: '#9e9e9e',
      500: '#757575',
      600: '#616161',
      700: '#424242',
      800: '#333333',
      900: '#212121',
    },
    // Text colors
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#9e9e9e',
      hint: '#bdbdbd',
    },
    // Background colors
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    // Border colors
    border: {
      light: '#e0e0e0',
      main: '#bdbdbd',
      dark: '#757575',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing (8px base unit)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    base: '1rem',   // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
    '4xl': '4rem',   // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.2)',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1010,
    fixed: 1020,
    modalBackdrop: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Breakpoints (mobile-first)
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ColorPalette = keyof typeof theme.colors;
export type Spacing = keyof typeof theme.spacing;
export type Breakpoint = keyof typeof theme.breakpoints;


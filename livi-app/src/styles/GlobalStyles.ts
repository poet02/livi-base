import { createGlobalStyle } from 'styled-components';
import { theme } from '../theme';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* CSS Variables for runtime theme switching */
    --color-primary: ${theme.colors.primary.main};
    --color-primary-light: ${theme.colors.primary.light};
    --color-primary-dark: ${theme.colors.primary.dark};
    --color-text-primary: ${theme.colors.text.primary};
    --color-text-secondary: ${theme.colors.text.secondary};
    --color-background: ${theme.colors.background.default};
    --color-background-paper: ${theme.colors.background.paper};
    --color-border: ${theme.colors.border.light};
    
    /* Spacing */
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-base: ${theme.spacing.base};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    
    /* Typography */
    --font-family: ${theme.typography.fontFamily.primary};
    --font-size-base: ${theme.typography.fontSize.base};
    
    /* Border Radius */
    --radius-base: ${theme.borderRadius.base};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.default};
    margin: 0;
    width: 100%;
    overflow-x: hidden;
  }

  /* Reset button styles */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Reset input styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Focus styles */
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Image defaults */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Link defaults */
  a {
    color: inherit;
    text-decoration: none;
  }
`;


# CSS Standards & Mobile-First Guidelines

This document outlines the CSS architecture, standards, and best practices for the Livi application.

## Table of Contents

1. [Mobile-First Methodology](#mobile-first-methodology)
2. [Theme System](#theme-system)
3. [Responsive Design Tokens](#responsive-design-tokens)
4. [Component Patterns](#component-patterns)
5. [Code Standards](#code-standards)
6. [Common Patterns](#common-patterns)

## Mobile-First Methodology

### Core Principle

**Design for mobile first, then enhance for larger screens.**

- Base styles are for mobile (< 640px)
- Use `min-width` media queries to enhance for larger screens
- Never use `max-width` media queries (desktop-first approach)

### Why Mobile-First?

1. **Performance**: Smaller CSS bundle for mobile users
2. **Progressive Enhancement**: Start with essentials, add features for larger screens
3. **Focus**: Forces prioritization of essential content
4. **Industry Standard**: Followed by Tailwind CSS, Bootstrap 5, Material Design

### Implementation Pattern

```typescript
// ✅ CORRECT: Mobile-first
const Component = styled.div`
  // Mobile styles (default, no media query)
  padding: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  // Tablet and up (640px+)
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.base};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
  
  // Desktop and up (768px+)
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

// ❌ WRONG: Desktop-first
const Component = styled.div`
  padding: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm};
  }
`;
```

## Theme System

### Location

All theme tokens are defined in `src/theme/theme.ts`.

### Structure

```typescript
theme = {
  colors: { ... },
  typography: { ... },
  spacing: { ... },
  borderRadius: { ... },
  shadows: { ... },
  breakpoints: { ... },
  transitions: { ... },
  responsive: { ... } // Mobile-specific tokens
}
```

### Usage

Always use theme tokens instead of hardcoded values:

```typescript
// ✅ CORRECT
const Button = styled.button`
  background: ${props => props.theme.colors.primary.main};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.base};
`;

// ❌ WRONG
const Button = styled.button`
  background: #1976d2;
  padding: 0.75rem;
  border-radius: 6px;
`;
```

## Responsive Design Tokens

### Location

Responsive tokens are in `theme.responsive`:

```typescript
responsive: {
  button: {
    iconSize: { mobile: '24px', tablet: '28px', desktop: '32px' },
    padding: { mobile: '0.5rem 1rem', tablet: '...', desktop: '...' },
    minHeight: { mobile: '44px', ... } // Touch target size
  },
  grid: {
    imageGrid: {
      mobile: 'repeat(4, 1fr)',
      tablet: 'repeat(auto-fill, minmax(100px, 1fr))',
      desktop: 'repeat(auto-fill, minmax(150px, 1fr))'
    }
  },
  spacing: {
    containerPadding: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' }
  }
}
```

### Usage

```typescript
const Button = styled.button`
  padding: ${props => props.theme.responsive.button.padding.mobile};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.responsive.button.padding.tablet};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.responsive.button.padding.desktop};
  }
`;
```

## Component Patterns

### Standardized Responsive Components

Located in `src/styles/patterns.ts`:

- **ResponsiveContainer**: Container with responsive padding and overflow protection
- **ResponsiveGrid**: Grid that adapts columns based on screen size
- **ResponsiveButton**: Button with responsive sizing
- **ResponsiveImageGrid**: Image grid (4 columns mobile, adaptive on larger screens)
- **ResponsiveFlex**: Flex container that adapts direction

### Usage Example

```typescript
import { ResponsiveGrid } from '../styles/patterns';

<ResponsiveGrid mobileColumns={4} tabletColumns={6} desktopColumns={8}>
  {items.map(item => <Item key={item.id} />)}
</ResponsiveGrid>
```

### Responsive Utilities

Located in `src/styles/responsive.ts`:

- **mobileFirst.tablet**: Media query for tablet and up (640px+)
- **mobileFirst.desktop**: Media query for desktop and up (768px+)
- **hideOn.mobile/tablet/desktop**: Hide element on specific breakpoints
- **showOn.mobile/tablet/desktop**: Show element only on specific breakpoints

## Code Standards

### 1. Prevent Horizontal Scrolling

**Always add to page containers:**

```typescript
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  // ... other styles
`;
```

### 2. Use Responsive Spacing

```typescript
// ✅ CORRECT
padding: ${props => props.theme.responsive.spacing.containerPadding.mobile};

// ❌ WRONG
padding: ${props => props.theme.spacing.xl};
```

### 3. Touch Target Sizes

Buttons and interactive elements must be at least **44x44px** on mobile:

```typescript
const Button = styled.button`
  min-height: ${props => props.theme.responsive.button.minHeight.mobile};
  // 44px minimum for touch targets
`;
```

### 4. Grid Layouts

Always start with mobile (fewer columns), then add columns for larger screens:

```typescript
// ✅ CORRECT: Mobile-first grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Mobile: 1 column
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr); // Tablet: 2 columns
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr); // Desktop: 3 columns
  }
`;
```

### 5. Button Sizes

Use responsive button tokens:

```typescript
const Button = styled.button`
  padding: ${props => props.theme.responsive.button.padding.mobile};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.responsive.button.padding.tablet};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;
```

### 6. Image Grids

Property image grids should show **4 columns on mobile**:

```typescript
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4 columns on mobile
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;
```

## Common Patterns

### Responsive Container Pattern

```typescript
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  padding: ${props => props.theme.responsive.spacing.containerPadding.mobile};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.responsive.spacing.containerPadding.tablet};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.responsive.spacing.containerPadding.desktop};
  }
`;
```

### Responsive Grid Pattern

```typescript
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${mobileColumns}, 1fr);
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(${tabletColumns || mobileColumns}, 1fr);
    gap: ${props => props.theme.spacing.base};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${desktopColumns || tabletColumns || mobileColumns}, 1fr);
    gap: ${props => props.theme.spacing.lg};
  }
`;
```

### Responsive Button Pattern

```typescript
const Button = styled.button`
  padding: ${props => props.theme.responsive.button.padding.mobile};
  font-size: ${props => props.theme.typography.fontSize.sm};
  min-height: ${props => props.theme.responsive.button.minHeight.mobile};
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.responsive.button.padding.tablet};
    font-size: ${props => props.theme.typography.fontSize.base};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.responsive.button.padding.desktop};
  }
`;
```

## Breakpoints

Standard breakpoints (mobile-first):

- **Mobile**: < 640px (default, no media query)
- **Tablet**: 640px+ (`theme.breakpoints.sm`)
- **Desktop**: 768px+ (`theme.breakpoints.md`)
- **Large**: 1024px+ (`theme.breakpoints.lg`)
- **XL**: 1280px+ (`theme.breakpoints.xl`)

## Code Review Checklist

When reviewing CSS/styled-components:

- [ ] Uses mobile-first media queries (`min-width`, not `max-width`)
- [ ] Uses theme tokens (no hardcoded colors, spacing, etc.)
- [ ] Prevents horizontal scrolling (`overflow-x: hidden`, `width: 100%`)
- [ ] Buttons meet minimum touch target size (44x44px on mobile)
- [ ] Grid layouts are responsive (fewer columns on mobile)
- [ ] Uses responsive design tokens where applicable
- [ ] Typography scales appropriately
- [ ] No magic numbers (use theme spacing scale)

## File Organization

- **Theme**: `src/theme/theme.ts` - All design tokens
- **Responsive Utilities**: `src/styles/responsive.ts` - Mobile-first helpers
- **Patterns**: `src/styles/patterns.ts` - Reusable responsive components
- **Common Components**: `src/styles/common.ts` - Shared styled components
- **Global Styles**: `src/styles/GlobalStyles.ts` - Global CSS reset and base styles

## Examples

### Example 1: Responsive Card Grid

```typescript
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Mobile: 1 column
  gap: ${props => props.theme.spacing.base};
  width: 100%;
  
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr); // Tablet: 2 columns
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr); // Desktop: 3 columns
    gap: ${props => props.theme.spacing.lg};
  }
`;
```

### Example 2: Responsive Button with Icon

```typescript
const IconButton = styled.button`
  padding: ${props => props.theme.spacing.sm};
  min-height: 44px; // Touch target
  
  svg {
    width: ${props => props.theme.responsive.button.iconSize.mobile};
    height: ${props => props.theme.responsive.button.iconSize.mobile};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing.md};
    svg {
      width: ${props => props.theme.responsive.button.iconSize.desktop};
      height: ${props => props.theme.responsive.button.iconSize.desktop};
    }
  }
`;
```

### Example 3: Responsive Form Layout

```typescript
const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  width: 100%;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: row;
    gap: ${props => props.theme.spacing.lg};
  }
`;
```

## Resources

- [Theme Configuration](../src/theme/theme.ts)
- [Responsive Utilities](../src/styles/responsive.ts)
- [Standardized Patterns](../src/styles/patterns.ts)
- [Common Components](../src/styles/common.ts)


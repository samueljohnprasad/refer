# Phase 1: Data Model & Contracts

## 1. SemanticColors Interface

The permanent, single source of truth for all color in the app. Components may ONLY consume this API.

```typescript
export type SemanticColors = {
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };

  brand: {
    primary: string;
    onPrimary: string;
    pressed: string;
    soft: string;
    onSoft: string;
  };

  surface: {
    canvas: string;
    primary: string;
    secondary: string;
    elevated: string;
  };

  border: {
    default: string;
    strong: string;
  };

  selection: {
    surface: string;
    border: string;
    foreground: string;
    indicator: string;
  };

  disabled: {
    surface: string;
    border: string;
    foreground: string;
  };

  success: {
    surface: string;
    border: string;
    foreground: string;
    indicator: string;
  };

  error: {
    surface: string;
    border: string;
    foreground: string;
    indicator: string;
  };

  warning: {
    surface: string;
    border: string;
    foreground: string;
    indicator: string;
  };

  info: {
    surface: string;
    border: string;
    foreground: string;
    indicator: string;
  };
};
```

## 2. AdaptiveColor Helper

Upgraded to support high-contrast accessibility variants natively.

```typescript
export interface AdaptiveColorInput {
  light: string;
  dark: string;
  highContrastLight?: string;
  highContrastDark?: string;
}

export function adaptiveColor({
  light,
  dark,
  highContrastLight,
  highContrastDark,
}: AdaptiveColorInput) {
  // Returns DynamicColorIOS mapping taking high contrast variants into account
}
```

## 3. Elevation System

```typescript
export type ElevationToken = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // for Android if ever supported, though currently iOS 26+ only
};

export type ElevationSystem = {
  none: ElevationToken;
  low: ElevationToken;
  medium: ElevationToken;
  high: ElevationToken;
};
```

## 4. Tailwind CSS v4 Integration (`global.css`)

The semantic tokens will be mirrored in `global.css` using CSS variables to fully support Tailwind classes. 

```css
/* In global.css */
@layer theme {
  :root, :where(.light, .light *) {
    --brand-primary: /* SAGE[500] hex */;
    --brand-onPrimary: /* NEUTRAL.white hex */;
    --text-primary: /* SAGE[900] hex */;
    /* ... */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --brand-primary: /* SAGE[400] hex */;
      /* ... */
    }
  }
}

@theme {
  --color-brand-primary: var(--brand-primary);
  --color-brand-onPrimary: var(--brand-onPrimary);
  --color-text-primary: var(--text-primary);
  /* ... */
}
```

This enables seamless usage of classes like `bg-brand-primary`, `text-text-primary`, and `border-border-default` in component `className` props.

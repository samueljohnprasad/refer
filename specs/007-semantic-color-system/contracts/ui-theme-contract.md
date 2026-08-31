# UI Theme Contract: Semantic Color System

The system introduces a strict interface for color consumption by UI components. 

## Semantic Token Interface

Any component requiring explicit colors (via `StyleSheet`, inline styles, or props) must consume tokens adhering to this exact schema structure:

```typescript
type SemanticColors = {
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  brand: {
    primary: string;
    pressed: string;
    soft: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  border: {
    default: string;
    selected: string;
  };
  success: {
    primary: string;
    soft: string;
  };
  error: {
    primary: string;
    soft: string;
  };
  warning: {
    primary: string;
    soft: string;
  };
}
```

Components are strictly forbidden from accessing `SAGE[500]` or other primitive palette hex codes directly.

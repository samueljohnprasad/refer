---
trigger: always_on
---

# Tamagui Guidelines and Best Practices

This document outlines the rules, best practices, and guidelines for using Tamagui in our project.

## What is Tamagui?

Tamagui is a complete UI kit for React Native and Web with:

-   A core styling and layout system with atomic CSS extraction
-   A customizable design system
-   A comprehensive component library

## Setup and Configuration

The project already includes a basic Tamagui setup in the `refer-fe-tamagui` directory with:

-   `tamagui.config.ts`: Core configuration file
-   `tamagui-web.css`: Generated CSS for web platforms

### Extending the Configuration

To extend the default configuration:

```typescript
// tamagui.config.ts
import { createTamagui } from "tamagui";
import { tokens, themes, fonts, animations, media } from "./theme";

export const tamaguiConfig = createTamagui({
    tokens,
    themes,
    fonts,
    animations,
    media,
    shorthands: {
        // Custom shorthands
        p: "padding",
        m: "margin",
        bg: "backgroundColor",
        // Add others as needed
    },
    defaultProps: {
        // Set default prop values for components
        Stack: {
            spacing: "$4",
        },
        Text: {
            color: "$text",
        },
    },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}
}
```

## Core Principles

1. **Theme-First**: Use Tamagui's theme tokens rather than hardcoded values
2. **Type Safety**: Leverage TypeScript for component props and theme definitions
3. **Cross-Platform**: Write once, run on any platform (web, iOS, Android)
4. **Performance**: Utilize atomic CSS extraction for optimized web performance
5. **Component Composition**: Build complex UIs from simple, composable components

## Components Best Practices

### 1. Use Tamagui's Core Components

Prefer Tamagui's base components over React Native ones:

```typescript
// ❌ Avoid React Native components when possible
import { View, Text } from "react-native";

// ✅ Use Tamagui components
import { Stack, Text } from "tamagui";
```

### 2. Stack for Layout

Use `Stack` as your primary layout component:

```typescript
import { Stack } from "tamagui";

// ✅ Use Stack for flexible layouts
const MyComponent: React.FC = () => (
    <Stack
        space="$4" // Space between children
        alignItems="center" // Cross-axis alignment
        justifyContent="flex-start" // Main axis alignment
    >
        {/* Children */}
    </Stack>
);
```

### 3. Use Theme Tokens for Consistency

```typescript
// ❌ Avoid hardcoded values
<Stack padding={12} backgroundColor="#f5f5f5" />

// ✅ Use theme tokens
<Stack padding="$4" backgroundColor="$background" />
```

### 4. Responsive Design with Media Queries

```typescript
import { Stack, XStack, YStack } from "tamagui";

const ResponsiveComponent: React.FC = () => (
    <Stack
        $gtMd={{
            // Greater than medium breakpoint
            flexDirection: "row",
        }}
        $ltMd={{
            // Less than medium breakpoint
            flexDirection: "column",
        }}
    >
        {/* Content */}
    </Stack>
);
```

### 5. Variants for Component State Management

```typescript
import { styled } from 'tamagui'

const Button = styled(Stack, {
  name: 'Button',
  padding: '$2',
  backgroundColor: '$background',

  // Define variants
  variants: {
    size: {
      small: {
        padding: '$1',
        borderRadius: '$1',
      },
      large: {
        padding: '$4',
        borderRadius: '$3',
      },
    },
    type: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$primary',
        color: '$primary',
      },
    },
  } as const,

  // Define default variants
  defaultVariants: {
    size: 'small',
    type: 'primary',
  },
})

// Usage
<Button size="large" type="secondary">Press me</Button>
```

### 1. Form Elements

```typescript
import { Form, Input, Button } from "tamagui";

const MyForm = () => (
    <Form onSubmit={handleSubmit}>
        <Form.Trigger asChild>
            <Stack space="$4">
                <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Button>Submit</Button>
            </Stack>
        </Form.Trigger>
    </Form>
);
```

### 2. Lists

```typescript
import { YStack } from "tamagui";

const MyList = ({ items }: { items: Item[] }) => (
    <YStack space="$2">
        {items.map((item) => (
            <ListItem
                key={item.id}
                item={item}
            />
        ))}
    </YStack>
);
```

### 3. Cards and Containers

```typescript
import { Card, H3, Paragraph, XStack, YStack } from "tamagui";

const ProductCard = ({ product }: { product: Product }) => (
    <Card
        elevate
        size="$4"
    >
        <Card.Header>
            <H3>{product.name}</H3>
        </Card.Header>
        <Card.Footer>
            <XStack justify="space-between">
                <Paragraph>${product.price}</Paragraph>
                <Button>Add to Cart</Button>
            </XStack>
        </Card.Footer>
    </Card>
);
```

## Common Pitfalls to Avoid

1. **Mixing styling approaches**: Stick consistently to Tamagui's styling pattern and avoid mixing with StyleSheet or inline styles

2. **Overusing complex animations**: While Tamagui has great animation support, excessive animations can hurt performance

3. **Not leveraging variants**: Use Tamagui's variant system instead of prop-spreading for component variations

4. **Ignoring theme tokens**: Always use theme tokens instead of hardcoded values

5. **Not optimizing for static extraction**: Follow best practices to ensure optimal build-time CSS extraction

## Quick One-Line Rules

-   Always import components directly from Tamagui, not React Native (`import { Stack } from "tamagui"` not `View` from React Native)
-   Use theme tokens for all styling values (`padding="$4"` not `padding={16}`)
-   Avoid conditional styles when possible; use variants or separate components instead
-   Utilize `YStack`, `XStack`, and `Stack` components for all layouts instead of View
-   Leverage media queries (`$gtSm`, `$ltMd`) for responsive design rather than manual dimension checks
-   Create reusable, typed components with Tamagui's styling system instead of inline styles
-   Use `Animation.presence` for all entrance/exit animations to ensure proper cleanup
-   Define custom themes in your config file, never override theme values inline
-   Avoid unnecessary re-renders by using `memo` and stable callbacks with complex components
-   Extract repeated UI patterns as styled components using `styled()` utility
-   Use shorthands consistently (`p="$4"` instead of `padding="$4"`)
-   Prefer Tamagui's utility functions over third-party alternatives when available
-   Group component props by category: layout, styling, interaction, and accessibility
-   Use semantic component names that reflect purpose rather than appearance
-   Apply appropriate accessibility attributes to all interactive components
-   Use animations sparingly and ensure they respect user's reduced motion preferences
-   Optimize performance by avoiding dynamic style properties that prevent static extraction
-   Use proper TypeScript types for all component props and theme values
-   Keep component trees shallow to improve both performance and readability
-   Always wrap your app with `<TamaguiProvider>` at the root level
-   Implement custom hooks for complex state management and theme interactions
-   Set up custom theme tokens that match your design system's colors and spacing
-   Use `createTamagui` only once in your application to configure the design system
-   Implement dark mode using theme composition rather than conditional styling
-   Leverage Tamagui's `useMedia` hook to ensure responsive elements re-render correctly
-   Use Tamagui's `useThemeName` for theme-aware components and logic
-   Apply consistent spacing using theme tokens rather than arbitrary pixel values
-   Group related style properties together when using the `styled()` function
-   Organize components by feature, not by type, to improve code organization
-   Take advantage of Tamagui's atomic CSS output to minimize CSS bundle size
-   Use `createComponent` for defining consistent variant APIs across your custom components
-   Implement keyboard navigation and focus states for all interactive components
-   Create design-token-first themes that map to semantic tokens like `$background` and `$text`
-   Use `<H1>`, `<H2>`, `<Paragraph>` instead of styled Text components for semantic markup
-   Implement proper focus management for modals and popovers using Tamagui's helpers
-   Use `Avatar` component with proper `fallback` for handling user images with graceful fallbacks
-   Apply `enterStyle` and `exitStyle` to create smooth transitions between component states
-   Implement proper error boundaries around complex Tamagui component trees
-   Use `Sheet` component for bottom sheets instead of custom modal implementations
-   Follow mobile-first approach when designing responsive interfaces with Tamagui
-   Take advantage of `pressStyle` for immediate visual feedback on touch/click events

## Upgrading and Maintenance

1. Keep Tamagui and its dependencies updated regularly
2. Check the official Tamagui blog for breaking changes when upgrading
3. Use the Tamagui Studio for visual design and theme management

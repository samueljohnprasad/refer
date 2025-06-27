# Design System Theme

This design system is extracted from the job search interface and provides a comprehensive theme for consistent styling across the ReferNet application.

## Files Structure

```
theme/
├── designSystem.ts     # Core theme configuration
├── styledComponents.ts # Pre-built styled components
└── README.md          # This documentation
```

## Color Palette

### Primary Colors
- **Primary Blue**: `#0066CC` - Main brand color, used for primary actions
- **Dark Blue**: `#003D7A` - Hover states and emphasis
- **Light Blue**: `#E6F3FF` - Background highlights

### Secondary Colors
- **Green**: `#00A86B` - Success states, positive actions
- **Orange**: `#FF6B35` - Warning states, urgent items
- **Purple**: `#6B46C1` - Accent color
- **Yellow**: `#F59E0B` - Highlights and badges

### Neutral Colors
- **White**: `#FFFFFF` - Primary background
- **Light Gray**: `#F8F9FA` - Secondary background
- **Gray Variations**: `#F3F4F6` to `#111827` - Text and borders
- **Black**: `#000000` - High contrast text

## Typography

### Font Families
- **Primary**: System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Secondary**: Inter font family
- **Mono**: Monospace fonts for code

### Font Sizes
- **xs**: 12px - Small labels, captions
- **sm**: 14px - Body text, descriptions
- **base**: 16px - Default text size
- **lg**: 18px - Job titles, important text
- **xl**: 20px - Section headers
- **2xl**: 24px - Page titles
- **3xl**: 30px - Large headers
- **4xl**: 36px - Hero text

### Font Weights
- **light**: 300
- **normal**: 400 - Default body text
- **medium**: 500 - Company names, labels
- **semibold**: 600 - Job titles, emphasis
- **bold**: 700 - Headers
- **extrabold**: 800 - Strong emphasis

## Spacing System

Uses a consistent spacing scale based on 4px increments:

- **xs**: 4px - Tight spacing
- **sm**: 8px - Small gaps
- **md**: 12px - Medium spacing
- **lg**: 16px - Standard spacing
- **xl**: 20px - Large spacing
- **2xl**: 24px - Card padding
- **3xl**: 32px - Section spacing
- **4xl**: 40px - Large gaps
- **5xl**: 48px - Very large spacing
- **6xl**: 64px - Maximum spacing

## Component Styling

### Cards
- **Background**: White (`#FFFFFF`)
- **Border**: Light gray (`#E5E7EB`)
- **Border Radius**: 8px
- **Padding**: 24px
- **Shadow**: Subtle drop shadow
- **Hover**: Elevated shadow with slight upward transform

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: White background, gray text, gray border
- **Ghost**: Transparent background, gray text

### Badges/Tags
- **Primary**: Blue background, white text
- **Success**: Green background, white text
- **Warning**: Yellow background, white text
- **Urgent**: Red background, white text
- **Neutral**: Light gray background, gray text

### Input Fields
- **Background**: White
- **Border**: Light gray
- **Border Radius**: 6px
- **Padding**: 8px 12px
- **Focus**: Blue border with blue outline

## Usage Examples

### Basic Setup

```tsx
import { ThemeProvider } from './theme/styledComponents';
import { theme } from './theme/designSystem';

function App() {
  return (
    <ThemeProvider>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

### Using Pre-built Components

```tsx
import {
  Card,
  JobTitle,
  CompanyName,
  JobDescription,
  PrimaryButton,
  ButtonText,
  Badge,
  BadgeText
} from './theme/styledComponents';

function JobCard() {
  return (
    <Card>
      <JobTitle>Frontend Developer</JobTitle>
      <CompanyName>Word Flow</CompanyName>
      <JobDescription>
        Build responsive UIs with modern frameworks, ensuring great performance and user experience.
      </JobDescription>
      
      <Badge variant="success">
        <BadgeText variant="success">$1000</BadgeText>
      </Badge>
      
      <PrimaryButton>
        <ButtonText>Apply</ButtonText>
      </PrimaryButton>
    </Card>
  );
}
```

### Custom Styled Components

```tsx
import styled from 'styled-components/native';

const CustomComponent = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.blue};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md};
`;

const CustomText = styled.Text`
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral.white};
`;
```

### Using Helper Functions

```tsx
import { getColor, getSpacing, getFontSize } from './theme/designSystem';

const styles = {
  container: {
    backgroundColor: getColor('primary.blue'),
    padding: getSpacing('lg'),
    fontSize: getFontSize('lg'),
  }
};
```

## Responsive Design

The theme includes breakpoints for responsive design:

- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Best Practices

1. **Consistency**: Always use theme values instead of hardcoded colors/spacing
2. **Semantic Naming**: Use semantic color names (primary, success, warning) rather than specific colors
3. **Component Composition**: Build complex UIs from simple, reusable components
4. **Accessibility**: Ensure sufficient color contrast and touch target sizes
5. **Performance**: Use the theme efficiently to avoid unnecessary re-renders

## Component Variants

Many components support variants for different use cases:

- **Buttons**: primary, secondary, ghost
- **Badges**: primary, success, warning, urgent, neutral
- **Cards**: default, highlighted

## Customization

To modify the theme, edit the `designSystem.ts` file. The changes will automatically propagate to all components using the theme.

## TypeScript Support

The theme is fully typed for TypeScript projects. All theme properties have proper type definitions and IntelliSense support.

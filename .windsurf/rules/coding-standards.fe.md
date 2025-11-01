---
trigger: glob
globs: *.ts, *.tsx, *.js, *.jsx
---

# Frontend Coding Standards (React Native + TypeScript, Mobile & Web)

write code that is scalable for 50,000 users
- always write code in tailwind css for styles

every thing you code should be coded in a resuable way, modular, clean, seperation of concern.

##Presentation Layer (Presentational Component) Rules:
-Only handle UI rendering and layout.
 
- Receive all data and actions via props.

- Avoid direct data fetching or global state access.

- No side effects or logic-heavy code.

- Be stateless or have only UI-local state.

## Container Layer (Container Component) Rules:
- Handle data fetching and business logic.

-Manage and transform state using hooks or Redux.

-Pass data and callbacks down to presentational components.

-Encapsulate side effects like API calls or subscriptions.

-Do not contain any markup beyond what’s necessary to compose children.



## Compatibility (Web & Mobile)
-Component Composition: Build complex UIs from simple, composable components
- Use only libraries and components that are fully compatible with both React Native and React Native Web.
- Prefer universal component libraries such as **NativeBase** 
- For styling, NativeWind (utility-first, Tailwind-compatible, works on web and mobile).
- For SVGs and vector graphics, use **react-native-svg** (works on both platforms).
- Avoid using libraries or native modules that do not support web, or provide web fallbacks if needed.
- Test all features and components on both mobile (iOS/Android) and web browsers before merging.
- Use cross-platform gesture and animation libraries: **react-native-gesture-handler** and **react-native-reanimated** (both support web).
- For accessibility, use **@react-native-aria** for primitives that work across platforms.
- Document any incompatibilities or required workarounds in the codebase.
- dont not use inline styling and style sheet


## Project Structure
- Use feature-based folder structure for scalability.
- Place components, hooks, utils, and styles in clearly named directories.
- Separate platform-specific code using `.native.tsx`, `.web.tsx`, or `Platform.select` when necessary.
- Share as much code as possible between mobile and web.

## Components
- Use functional components and React Hooks.
- Use TypeScript for all components and props.
- Name components and files in PascalCase (e.g., `UserProfile.tsx`).
- Keep components small and focused; extract reusable logic to custom hooks.
- Use TypeScript interfaces for all props.
- Prefer composition over inheritance.
- Use React context for global state sparingly; prefer dedicated state management if needed.
- Use cross-platform compatible components (from `react-native` or `react-native-web`).
- Avoid platform-specific code unless absolutely necessary; use `Platform.OS` or `Platform.select` for conditional logic.

## State Management
- Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for local state.
- For global state, prefer Redux Toolkit.

## Styling
- dont use react stylesheet
- Use `tailwind-rn` for scalable, maintainable styles.
- Avoid inline styles except for dynamic values.
- Use percentage, flexbox, and relative units for layout.
- Use cross-platform compatible color and font choices.
- Place all shared styles in a `styles/` or `theme/` directory.

## Responsive Design
- Use `flexbox` for all layouts; avoid absolute positioning unless necessary.
- Use `Dimensions`, `useWindowDimensions`, or `react-native-responsive-screen` for responsive sizing and scaling.
- Use percentage-based widths/heights and `flex` properties for scalable layouts.
- Use `SafeAreaView` (mobile) and appropriate padding (web) to avoid notches, status bars, and browser UI.
- Avoid fixed pixel values; use scalable units and relative sizing.
- Use media queries and breakpoints with `react-native-web` for web-specific responsiveness (e.g., `@media` queries in style objects or with libraries like `react-native-media-query`).
- Always test all screens on multiple device sizes, orientations (portrait/landscape), and web breakpoints.
- For images and icons, use `resizeMode` and SVGs for scalable, crisp rendering on all screens.
- Ensure all touch targets are at least 44x44dp (mobile) and 48x48px (web) for accessibility.
- Use `Platform.select` and platform-specific styles/components where necessary, but share code by default.
- Handle keyboard appearance and dismissal on both platforms; use `KeyboardAvoidingView` for mobile.
- Use scrollable containers (`ScrollView`, `FlatList`) for content that may overflow vertically or horizontally.
- For web, ensure the app is responsive to window resizing and supports keyboard navigation.
- Use orientation hooks (`useDeviceOrientation`) or event listeners to adapt UI for portrait/landscape.
- Avoid horizontal scrolling on mobile unless it is a deliberate design choice.
- Test all interactive elements for tap/click, hover (web), and accessibility on both platforms.
- Use platform-specific accessibility props and test with screen readers on both mobile and web.
- Document any platform-specific differences in component usage or styling.

## Platform-Specific Code
- Use `.native.tsx` and `.web.tsx` file extensions for platform-specific implementations.
- Use `Platform.OS` or `Platform.select` for conditional rendering or logic.
- Minimize platform-specific code; maximize code sharing.

## Code Style
- Use Prettier and ESLint for code formatting and linting.
- Use 2 spaces for indentation.
- Use single quotes for strings.
- Always destructure props and state when possible.
- Avoid magic numbers and strings; use constants.
- Write clear, concise comments for complex logic.



## API Integration
- Use Axios or Fetch API for HTTP requests.
- Keep API logic in a dedicated `api` or `services` directory.
- Handle loading, error, and success states for all requests.

## Accessibility & UX
- Use accessible components (e.g., `TouchableOpacity` with `accessibilityLabel`).
- Ensure all interactive elements are accessible via keyboard and screen readers.
- Add accessibility props (`accessibilityLabel`, `accessible`, etc.) where necessary.
- Write descriptive alt text for images (via `accessibilityLabel`).
- Ensure touch targets are large enough for mobile users.
- Test accessibility on both web and mobile.



## Additional Guidelines
- Write self-documenting code; use comments for non-obvious logic.
- Follow SOLID principles and DRY (Don't Repeat Yourself).
- Remove unused code and dependencies regularly.
- Review code via pull requests before merging.
- Always test UI on both mobile and web before marking a feature as done.
- Use clear, descriptive commit messages (e.g., `feat(auth): implement login form`).
- Use feature branches for development.
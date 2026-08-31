# Quickstart: Global Token System Refactor Validation

## Prerequisites
- Node.js environment
- Expo CLI
- iOS Simulator or physical device with Expo Go

## Setup
1. `npm install`
2. `npm run start`

## Validation Steps
1. Launch the app in the iOS Simulator.
2. **Global Verification**: Browse through Onboarding, Exercises, Journal Entries, and Settings. The app should look visually identical (or slightly better with improved contrast).
3. **Contrast Verification**: Open a Settings screen or Insight card. Verify that muted text elements (`text.secondary` or `text.tertiary`) are readable (WCAG AA). Check warning/error borders and text for clear visibility.
4. **State Separation**: In an exercise, select an option. It should use `selection` tokens. Submit the option to see feedback. The success state should use `success` tokens which are tonally distinct from the selection state.
5. **Dark Mode & Accessibility**: 
   - Toggle Dark Mode (Cmd + Shift + A). Verify the entire app respects the semantic palette inversion.
   - Toggle "Increase Contrast" in iOS Simulator Accessibility settings. Verify `AdaptiveColor` responds by utilizing high-contrast tokens (e.g., darker borders or stronger text).

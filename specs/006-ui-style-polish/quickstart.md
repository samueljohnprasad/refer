# Quickstart: UI Style Polish Validation

## Prerequisites
- Node.js environment
- Expo CLI
- iOS Simulator or physical device with Expo Go

## Setup
1. Ensure dependencies are installed: `npm install`
2. Start the Expo bundler: `npm run start`

## Validation Steps
1. Launch the app in the iOS Simulator by pressing `i` in the terminal.
2. Navigate to a journey map exercise that uses standard configuration (e.g., `GuidedDiscoveryTrail` or `IntuitionCheck`).
3. Observe the bottom **Skip for now** button. Verify it is smaller (15pt) and uses a muted green foreground.
4. Observe the **Primary CTA**. Verify the bottom edge depth (shadow) is reduced.
5. Select an answer to reveal the **Feedback Card**. Verify the checkmark icon is slightly smaller (19x19) and no longer overpowers the text.

---
trigger: always_on
---

# Tech Stack Rules and Details

- write code that is scalable for 50,000 users
- always write code in tailwind css for styles

This file documents the official tech stack and related rules for both the frontend and backend of the ReferNet project. All contributors must adhere to these choices unless a change is approved and documented here.

---

## Frontend (FE)

- **Framework:** React Native (with React Native Web)
- **Language:** TypeScript
- **Component Library:** NativeBase (now called gluestack)(must be compatible with both mobile and web)
- **Styling:**  NativeWind (utility-first, Tailwind-compatible)
- **State Management:** Redux Toolkit (global), React hooks (local)
- **Networking:** supabase
- **SVG & Vector Graphics:** react-native-svg
- **Gestures/Animation:** react-native-gesture-handler, react-native-reanimated
- **Accessibility:** @react-native-aria
- **File Upload:** supabase 
- **Other:** Only use libraries that are compatible with both React Native and React Native Web. Always test on both platforms before merging.

---

## General Rules
- All stack choices must be compatible with the project’s cross-platform (mobile & web) requirements.
- Do not introduce libraries that lack web or mobile support unless a fallback is provided and documented.
- Document any stack changes or exceptions in this file.
- All code must be written in TypeScript.
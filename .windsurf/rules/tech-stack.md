---
trigger: always_on
---

# Tech Stack Rules and Details

This file documents the official tech stack and related rules for both the frontend and backend of the ReferNet project. All contributors must adhere to these choices unless a change is approved and documented here.

---

## Frontend (FE)

- **Framework:** React Native (with React Native Web)
- **Language:** TypeScript
- **Navigation:** @react-navigation/native
- **Component Library:** NativeBase (now called gluestack)(must be compatible with both mobile and web)
- **Styling:** styled-components/native or NativeWind (utility-first, Tailwind-compatible)
- **State Management:** Redux Toolkit (global), React hooks (local)
- **Networking:** Axios
- **SVG & Vector Graphics:** react-native-svg
- **Gestures/Animation:** react-native-gesture-handler, react-native-reanimated
- **Accessibility:** @react-native-aria
- **Testing:** Jest, React Native Testing Library
- **File Upload:** AWS S3
- **Other:** Only use libraries that are compatible with both React Native and React Native Web. Always test on both platforms before merging.

---

## Backend (BE)

- **Framework:** Node.js
- **Language:** TypeScript
- **API:** REST (Express.js recommended)
- **Database:** MongoDB
- **Auth:** Simple custom auth (JWT, session, or similar)
- **File Upload:** AWS S3
- **Real-Time:** Socket.io (for chat and notifications)
- **Validation:** Joi or Zod
- **ORM/ODM:** Mongoose (for MongoDB)
- **Testing:** Jest
- **Logging:** Winston or Pino
- **Notifications:** Integrate with Twilio, WhatsApp, Email APIs as needed
- **Deployment:** Any Node.js-compatible host (Render, AWS, etc.)

---

## General Rules
- All stack choices must be compatible with the project’s cross-platform (mobile & web) requirements.
- Do not introduce libraries that lack web or mobile support unless a fallback is provided and documented.
- Document any stack changes or exceptions in this file.
- All code must be written in TypeScript.

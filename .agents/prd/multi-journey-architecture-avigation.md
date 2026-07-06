# PRD: Multi-Journey Architecture & Navigation

## 1. Core Objectives
Refactor the app's navigation and journey management to support a multi-journey (multi-course) system. The application will center entirely around "Journeys," allowing users to discover, enroll in, and switch between multiple paths effortlessly.

## 2. Functional Requirements

### 2.1 Navigation & Empty State
- **Remove "Learn" Tab**: Consolidate the primary learning experience into a single "Journeys" concept.
- **Empty State (No Enrollments)**: When a new user navigates to the core tab and has 0 active enrollments, the screen will render the **Journey Library (List of all Journeys)**.
  
### 2.2 Journey State Management
- **Multiple Enrollments**: Users can enroll in multiple journeys simultaneously.
- **Active Journey Concept**: A single journey acts as the "Active" journey. The app remembers this preference globally. Switch events update this active state.

### 2.3 Interactive Elements (Journey Map)
- **Top-Left Flag Icon**: Will act as the journey switcher. 
  - Clicking this icon triggers a Gorhom Bottom Sheet.
- **Sticky Header**: 
  - Clicking the center sticky header will open the **Section Overview** list for the current active journey, allowing users to scroll through all sections and units quickly.

### 2.4 Journey Switcher (Bottom Sheet)
- The bottom sheet will visually highlight the currently active journey.
- **Proposed Tabbed UI**:
  - **Tab 1 (My Journeys)**: Displays currently enrolled journeys.
  - **Tab 2 (All Journeys)**: Displays the global library of available journeys.
- Users can tap any journey in either tab to immediately switch their context or enroll.

### 2.5 Redirection & Transitions
- Switching or enrolling in a journey immediately updates the `activeJourneyId` global state, dismisses the bottom sheet, and automatically reloads the map rendering the selected journey.

---

## 3. Product & UX Feedback (Improvisation)

Overall, this is a highly proven mental model popularized by apps like Duolingo. It keeps the user localized to their core learning path while making it easy to branch out. Here is an analysis of potential flaws and proposed improvements.

### 3.1 Flaw: Nested Scrolling in Tabbed Bottom Sheets
- **The Risk**: Rendering Tabs (Top-bar style) *inside* a Gorhom Bottom Sheet where both tabs contain long, scrollable `FlatList`s can cause severe gesture-conflict bugs on iOS/Android. Sometimes the sheet drags down when the user intends to scroll the list, and managing tab swipes inside a sheet is cumbersome.
- **Better Scenario**: 
  Make the Bottom Sheet purely for **"My Journeys" (Enrolled)**. At the bottom of this list, have a prominent, fixed button: `[+ Discover New Journeys]`. 
  Pressing this button closes the sheet and opens a **Full-Screen Modal / Dedicated Screen** for the Journey Library. This gives the library the real estate it deserves (to show rich thumbnails, descriptions, and ratings) without gesture conflicts.

### 3.2 Flaw: Empty State Friction
- **The Risk**: Just dumping a new user into a "List of all Journeys" on the main tab might cause choice paralysis. 
- **Better Scenario**: 
  For completely new users, instead of a raw list, the main tab could show a welcoming "Onboarding / Recommendations" view. Better yet, the initial onboarding flow (before they ever reach the tabs) should auto-enroll them into their first "Starter Journey" based on a 1-2 question quiz. This ensures they immediately see a populated Journey Map on their first visit, rather than a menu.

### 3.3 Improvement: Journey Completion vs. Archiving
- **Consideration**: What happens when a user finishes a Journey, or wants to quit one? 
- **Better Scenario**: 
  In the bottom sheet, permit users to swipe left to "Hide" or "Archive" a journey they no longer want to see. Completed journeys could also move to a separate "Completed" visual state inside the switcher sheet to keep the active list clean.

### 3.4 Improvement: Progress Indicators in Switcher
- **Consideration**: When a user opens the flag bottom sheet, just seeing the names isn't enough context.
- **Better Scenario**: 
  Each row in the "My Journeys" bottom sheet should show a mini progress bar or completion percentage, and perhaps the flag icon + the title of the current unit they are on (e.g., *CBT Basics • 15% Complete*).

## 4. Proposed User Flow (Refined)

1. **User opens app**: 
   - *If no journey:* Taken to Onboarding or Full-Screen Journey Library.
   - *If returning:* Taken directly to Journey Map with `activeJourneyId` pre-loaded.
2. **User taps Flag Icon (Top Left)**:
   - Opens Gorhom Bottom Sheet showing: 
     - 🎓 Currently Active Journey (Highlighted)
     - 📚 Other Enrolled Journeys (With % progress)
     - ➕ "Add New Journey" Button
3. **User taps "Add New Journey"**:
   - Sheet closes, full-screen **Journey Library** opens.
   - User browses, taps a journey, views detail page, and taps "Enroll".
   - Automatically redirected to the Journey Map for the newly enrolled journey.
4. **User taps Sticky Header**:
   - Section Overview modal slides up, allowing fast-travel between unlocked sections of the *current* journey.

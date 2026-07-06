# Guided Reflection UI Upgrade Design

## Overview
The `GuidedResponseExercise.tsx` component is being upgraded to match the new premium design system. The goal is to make the mood picker feel organic and fluid, and to elevate the aesthetic of the prompt cards and text input.

## Components

### 1. MoodSlider Component
A new `MoodSlider` component will be created to replace the discrete 5-emoji button layout for both the "Before" and "After" mood pickers.
- **Visuals:** A horizontal track representing a mood scale. A draggable thumb indicator.
- **Interactions:** The user can drag the slider. As it hits predefined thresholds (0 to 4), the corresponding emoji (😫, 😕, 😐, 🙂, 🤩) will dynamically scale up or highlight to provide immediate feedback.
- **Integration:** It will seamlessly drop into `GuidedResponseExercise.tsx` to handle `moodBefore` and `moodAfter` states.

### 2. "Try to Cover" Prompts Card
- **Styling:** Moving away from the basic blue box, this will become a sleek card (e.g., white background, subtle border, soft shadow).
- **Typography:** Header will use `uppercase tracking-wider` for a sophisticated, premium look.
- **List Items:** Bullets will be styled cleanly, potentially using custom dots or checkmarks.

### 3. Premium Text Area
- **Inactive State:** Soft, neutral border (e.g., `slate-200`).
- **Focused State:** Smooth transition to a brand-colored border (`OTTER_BLUE`) with a faint outer shadow/glow to indicate active focus.
- **Word Count Indicator:** The dynamic word count badge will be styled as a neat pill or badge in the bottom corner.

## Architecture & Boundaries
- `MoodSlider` will be built as a reusable UI component in `src/components/ui/MoodSlider.tsx`.
- `GuidedResponseExercise.tsx` will be refactored to consume `MoodSlider` and apply the new styling to the layout.
- The state management (`moodBefore`, `moodAfter`, `text`) remains unchanged, ensuring backward compatibility with the NodeEngine and existing exercise data.

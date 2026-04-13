 ---
name: duolingo-design
description: Guide for applying Duolingo's gamification and design principles to make apps engaging and retention-focused. Use when the user asks to gamify an interface, design a habit-forming app, improve retention, implement streak mechanics, or create a character-driven UI/UX.
---

# Duolingo Design & Gamification Principles

This skill provides guidelines on how to design user interfaces and experiences using the gamification principles made popular by Duolingo. It focuses on habit formation, retention, making failure safe, and creating an emotional connection with the user.

## Quick start

When asked to "gamify" an app or design a habit-forming feature, applying Duolingo's principles means shifting focus from merely looking good to creating a continuous loop of engagement. Start by identifying the core action you want the user to take, and build a Trigger → Action → Reward → Investment loop around it.

## Instructions

When designing or reviewing a UI with this skill:
1. **Identify the Core Action:** What small, frictionless task should the user complete? Reduce the time to complete this task to 3-5 minutes.
2. **Implement Visible Progress:** Ensure there is a constant visual indication of progress (e.g., progress bars, XP, streaks), even when the user makes a mistake.
3. **Design for Safe Failure:** Replace harsh error messages with gentle corrections. Wrong answers should prompt an encouraging retry, not a total loss of progress.
4. **Use Saturated, Meaningful Colors:** Map specific, bright colors to gamification states (e.g., green for success, red for urgency/hearts, orange for streaks).
5. **Incorporate Tactile UI Elements:** Use chunky, 3D-styled buttons that compress when clicked to simulate physical feedback and enhance the playful feel.

## The Gamification Loop

Build habit-forming experiences using the following structure:
- **Trigger:** Emotional or personalized reminders (e.g., push notifications with a mascot or streak anxiety).
- **Action:** An action with near-zero friction (e.g., "Start lesson" requiring only 3-5 minutes).
- **Reward:** Variable rewards (XP, chests, maintaining a streak).
- **Investment:** Growing a streak or maintaining a league position, which increases loss aversion.

## Core Design Principles

- **Retention Beats Acquisition:** Optimize for getting the user to come back tomorrow. The streak mechanic is the most powerful tool for this.
- **Make Failure Feel Safe:** Use gentle animations and encouraging feedback for wrong answers. The progress bar should still move forward slightly.
- **Character as Emotional Interface:** Use mascots or characters rather than abstract UI to deliver notifications. This creates emotional stakes and gives "permission" to be playful and persistent.
- **Visible, Continuous Progress:** Provide layered progress indicators (Crowns, XP, Leagues, Streaks). Something must always be advancing.
- **Micro-Learning:** Break tasks down so they respect the user's real schedule. Lower the activation energy required to engage.

## UI/UX Best Practices

### Colors
Use a bright and saturated palette where each color has a purpose:
- **Green (`#58cc02`):** Success, correct answers, primary call-to-action.
- **Red (`#ff4b4b`):** Mistakes (used firmly but gently), urgency, remaining lives/hearts.
- **Orange (`#ff9600`):** Streaks, fire, warmth.
- **Yellow (`#ffc800`):** XP, rewards, celebrations.
- **Blue (`#1cb0f6`):** Information, neutral progress.
- **Purple (`#ce82ff`):** Special events, leagues, premium features.

### Button Design (The 3D Press)
Create buttons with a thick bottom border to look raised and tactile. On `:active` (press), remove the border and shift the button down to simulate a physical press.
```css
.btn-primary {
  background: var(--duo-green);
  color: #ffffff;
  font-weight: 700;
  border-bottom: 4px solid var(--duo-green-dark);
  border-radius: 16px;
  transition: filter 100ms ease;
}
.btn-primary:active {
  border-bottom-width: 0;
  margin-top: 4px;
  filter: brightness(0.95);
}
```

### Animating Urgency
Animations should scale with urgency. For example, a streak flame can animate slowly (idling) early in the day, but animate faster and shift color (urgency) as the user risks losing their streak in the evening.

### Progressive Difficulty
Structure user flows or lessons by gradually increasing complexity:
1. **Easiest:** Recognition tasks (multiple choice).
2. **Medium:** Constrained production (word banks).
3. **Hardest:** Free production (typing from scratch).
*Important:* Always end the session on a slightly easier challenge so the user finishes with a positive feeling and the confidence to return the next day.

## Examples

**User Request:** "I want to add a daily login feature to my fitness app, but I want it to be engaging."
**Applying this skill:** 
1. Suggest a **Daily Streak** counter combined with a visual flame or character that reacts.
2. Outline the **Gamification Loop**: The push notification features a supportive character (Trigger), the workout requires only 5 minutes to start (Action), completing it grants 'Fitness XP' (Reward), and extending a 10-day streak builds loss aversion (Investment).
3. Ensure the UI uses bright, distinct colors for XP, streaks, and success states to emphasize the gamified nature of the routine.

---
title: "Direct anonymous routing to Home, hydration verification, & zero UI surprises"
type: "feature"
ticket: "6"
status: built
route: "oneshot"
covers: ["CAP-5", "CAP-6"]
---

## Summary
- Verified `premium-onboarding.tsx` routes anonymous guest directly to `/tabs/(tabs)/home` upon completing onboarding or dismissing paywall.
- Verified `JournalCalendarScreen.tsx` maintains production UI hierarchy intact with zero unexpected modifications or layout shifts.
- Fixed typechecking error in `OnboardingStepRenderer.tsx:157` (`selectedPricingTier`).
- Fixed infinite loading hang in `useOnboardingStatus.ts` by checking local `AsyncStorage` first and adding a 2.5s network timeout race.
- Verified `npx tsc --noEmit` on `src/screens/OnboardingScreen/` passes with 0 errors.

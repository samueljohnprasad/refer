# Sleep Learning Screen Distillation Tasks

## Goal

Make each explanatory Journey screen teach one idea through one action.

## Tasks

- [x] Simplify “One waking is not a broken night” to one message: brief wakings can be part of normal sleep.
- [x] Remove its instruction subtitle, myth card, secondary takeaway, and per-screen skip action.
- [x] Keep one concise explanation and one `Continue` action.
- [x] Split “Sleep pressure builds” into three cards with one relationship per card:
  1. Time awake builds sleep pressure.
  2. Sleep releases sleep pressure.
  3. Long naps can reduce bedtime sleepiness.
- [x] Remove decorative card icons and abstract uppercase category labels from these cards.
- [x] Remove the nested carousel dots so the lesson header is the only visible progress system.
- [x] Size learn cards from their content instead of using a tall fixed card.
- [x] Use `Continue` for every learn-card advance.
- [x] Remove per-screen skip actions; keep the top close control as the escape path.
- [x] Preserve Nunito hierarchy: screen title 800, card idea 700/800, body 400, CTA 700.
- [x] Update both seed content and a deployable Supabase migration.
- [x] Verify focused TypeScript and iOS export.
- [ ] Verify final authored copy and skip removal in the simulator after the scoped migration is deployed.

## Acceptance

- Each screen answers one learning question without “and.”
- Each screen shows one primary action.
- No decorative icon, nested progress indicator, implementation-language CTA, or redundant helper copy remains.
- Body text stays readable and all touched component files remain below 300 lines.

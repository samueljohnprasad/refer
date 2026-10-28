# Panda motion notes

The panda art in this folder follows the `rossark-motion-skill` method at
`.agents/skills/rossark-motion-skill/SKILL.md`.

## Project-specific notes

- Platform: React Native SVG with Reanimated; Remotion renders the same art and poses for review.
- Art: Vector articulated rig representing Happi the Panda (`panda-hi.svg` / `panda.png`).
- Architecture:
  - No clipping hacks or arbitrary rectangle cutouts. Every moving anatomical element is an independent SVG layer rotated around its natural joint pivot.
  - Motion engine: `src/components/ui/motion/engine.ts` (`flow`, `track`, `wave`, `seg`, `loop`, `bell`, `seeded`).
  - Choreography & acting poses: `src/components/ui/happy-scene/choreo.ts`.
  - Joint transforms & affine matrices: `src/components/ui/happy-scene/pose.ts`.
  - Presentation component: `src/components/ui/happy-scene/HappyScene.tsx`.
- Character Rig:
  - Coordinate system: Native 560x741 vector coordinate space from `panda-hi.svg` / `panda.png`.
  - Floor pivot: `(282, 712)` with ground contact shadow ellipse (`#E5EAE4`).
  - Neck pivot: `(282, 450)` with counter-motion follow-through (`-0.42 * lean(t - 110ms)`). Head tilts as an independent closed vector contour with ears and hair tufts.
  - Live face: eye whites (`sub 5, 6`) with deep charcoal pupils (`sub 7, 8`) and 4 kawaii specular gloss highlights that glide together with `(gazeX, gazeY)`. Smooth eyelids scale down vertically (`Math.max(0.04, 1 - lid)`) for blinks every 3.5s (`110ms` close, `40ms` hold, `190ms` ease-out reopen).
  - Torso & Limbs: Body base, white belly (`sub 2`), lavender heart (`#C8BEE6`), and waving left arm with white paw pad circle (`#FFFFFF`) at `(106, 372)`.
  - 2.5D yaw turn: snout slides with subtle parallax shift.
  - Volume preservation: `sx = 1 / sy^0.6` during squash, stretch, and breath idle.
  - Contact ground shadow: wide oval on floor scaling inversely with lift: `(1 - lift / 220) * sx`.
  - Internal player verification: `npx remotion still remotion/index.ts HappyMascot <out.png> --frame=N` renders offline still frames to verify poses, blinks, and eye glides without running an expensive simulator.
  - One clock drives all parts. Story action plays up to 7.2 seconds; breathing, blinks, and plant/cloud idle sway continue continuously.
- Reduced motion: freezes at final resting frame with all idle clocks stopped.
- Visibility: pauses immediately when backgrounded or unmounted.

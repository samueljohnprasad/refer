# Panda motion notes

The panda art in this folder follows the `rossark-motion-skill` method at
`.agents/skills/rossark-motion-skill/SKILL.md`.

## Project-specific notes

- Platform: React Native SVG with Reanimated; Remotion renders the same art and poses for review.
- Art: vector rig in `src/components/ui/happy-scene/art.ts`, traced off `panda-capture.png` on a grid (1 unit = 4 source px). `panda-hi.svg` is a flat 3-path auto-trace and is not used by the rig.
- Architecture:
  - No clipping hacks or arbitrary rectangle cutouts. Every moving anatomical element is an independent SVG layer rotated around its natural joint pivot.
  - Motion engine: `src/components/ui/motion/engine.ts` (`flow`, `track`, `wave`, `seg`, `loop`, `bell`, `seeded`).
  - Choreography & acting poses: `src/components/ui/happy-scene/choreo.ts`.
  - Joint transforms & affine matrices: `src/components/ui/happy-scene/pose.ts`.
  - Presentation component: `src/components/ui/happy-scene/HappyScene.tsx`.
- Character Rig:
  - Coordinates and pivots live in `PIVOT` in `art.ts`: floor `(130, 244)`, neck `(131, 152)`, shoulders `(91|169, 158)`, elbows `(91|169, 180)`. Arms hang just outside the torso, as in the references.
  - Arms: upper arm and forearm share radius 11 and cap on the elbow, so the joint is one circle at any bend. Viewer's left arm waves (shoulder ~80°, elbow ~95°, forearm ±13° on a 680 ms beat); viewer's right arm hangs.
  - Head tilts around the neck; ears follow through.
  - Live face: round black eye patches, white rings, pupils clipped to the whites with 2 glints each, gliding with `(gazeX, gazeY)`. No eyebrows, no blush. Smooth eyelids scale down vertically (`Math.max(0.04, 1 - lid)`) for blinks every 3.5s (`110ms` close, `40ms` hold, `190ms` ease-out reopen).
  - Torso: white front inside a thin ink outline, lavender heart (`#D3CDEB`) pulsing, belly fold line just above short black legs with a small gap; white paw pad only on the waving paw.
  - 2.5D yaw turn: snout slides with subtle parallax shift.
  - Volume preservation: `sx = 1 / sy^0.6` during squash, stretch, and breath idle.
  - Contact ground shadow: wide oval on floor scaling inversely with lift: `(1 - lift / 220) * sx`.
  - Verification: `npx remotion still remotion/index.ts HappyMascot <out.png> --frame=N` renders offline still frames to verify poses, blinks, and eye glides without running an expensive simulator.
  - One clock drives all parts. Story (raise paw, wave, glance at sprout and cloud) plays up to 7.2 seconds and holds the brand waving pose; breathing, blinks, and plant/cloud idle sway continue continuously.
- Reduced motion: freezes at final resting frame with all idle clocks stopped.
- Visibility: pauses immediately when backgrounded or unmounted.

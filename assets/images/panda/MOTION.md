# Panda motion notes

The panda art in this folder follows the `rossark-motion-skill` method at
`.agents/skills/rossark-motion-skill/SKILL.md`.

## Project-specific notes

- Platform: React Native SVG with Reanimated; Remotion renders the same art and poses for review.
- Art: transparent raster panda poses in this folder, displayed through
  `src/components/ui/Mascot.tsx`.
- Current motion: tapping Happy on Home opens `happy-scene/HappySceneModal`.
  The PNG remains on Home. A vector interpretation of `panda-happy.png` performs
  a crouch, hop, squash landing, and asymmetric wave in the full-screen scene.
  This is a redrawn articulated pose, not a lossless PNG conversion.
- One clock drives all parts. The action ends at 7.2 seconds; breathing,
  blinks, ear movement, and environment sway continue afterwards.
- Reduced motion: the one-shot holds its final pose, with all idle motion frozen.
- Visibility: the scene unmounts on close and pauses when the app backgrounds.
- Art, hierarchy, and pose math are shared between native and review renders in
  `src/components/ui/happy-scene/`; `remotion/HappyScene.tsx` provides video export.
- Character proportions preserve the cheek shape, short body, dark paws, blush,
  hair tuft, and lavender heart of the source. Keep action around joint pivots.
- Verify with targeted lint, diff checks, Graphify, and an iOS render when
  available. Report real-device verification separately.

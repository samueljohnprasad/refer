# 03 - Anti-AI Slop Quality Gate & Acceptance Rubric

This document serves as the **hard gatekeeper** for all mascot generation attempts. Any asset that fails this gate must be rejected and re-prompted.

---

## 1. The Anti-AI Slop Quality Gate (8 Disqualification Flags)

Before saving or integrating ANY generated asset, check against these 8 red flags. **A single match triggers immediate disqualification**:

| # | Red Flag | Symptom of Cheap AI Generation | Duolingo Standard Requirement |
| :---: | :--- | :--- | :--- |
| **1** | ❌ **Realistic Hands / Fingers** | 4–5 articulated human-like fingers, visible knuckles, or claws. | Pure rounded 1-piece bean/mitten paws with zero finger divisions. |
| **2** | ❌ **Surface Fur Texture** | Fine hairy strands, feathered brush strokes, or airbrushed fuzz. | Solid, flat vector fills with crisp boundaries. |
| **3** | ❌ **Stock Prop Clutter** | Multiple background objects: desks, coffee mugs, plants, chairs, papers. | Zero props or exactly ONE iconic narrative token (e.g. sweatband, clipboard). Body pantomime drives the story. |
| **4** | ❌ **Wobbly Line Weights** | Outline thickness varies randomly, thins out, breaks, or looks hand-sketched. | Uniform vector stroke thickness throughout the entire character outline. |
| **5** | ❌ **Airbrushed Gradients** | Realistic soft-lit gradients, lens flares, ambient occlusion shadows. | Flat vector color planes with crisp cut shadows. |
| **6** | ❌ **Misplaced / Missing Heart** | Lavender heart omitted, wrong color, off-center, or turned into a 3D medal. | Exactly `#C8BEE6` 2D flat heart centered horizontally on the white belly. |
| **7** | ❌ **Squint Silhouette Failure** | Character looks like an unrecognizable blob when squinting or scaled to 32px. | Exaggerated pantomime with strong negative space between limbs and torso. |
| **8** | ❌ **Vacant Dead Smile** | Generic stock cartoon grin with dead eyes and zero emotional specificity. | Dynamic acting: sneer, tears of pride, winking swagger, exhausted puddle, side-eye. |

---

## 2. The 10-Point Duolingo Acceptance Rubric

Every candidate asset MUST score a perfect **10 / 10** before being merged into `assets/images/panda/`:

```
[ ] 1. Reference Fidelity: Proportions, hair tuft, round ears, and black eye patches match panda.png.
[ ] 2. Emblem Continuity: Signature lavender heart (#C8BEE6) clearly visible on white belly.
[ ] 3. Mitten Paws: Paws are rounded mitten bean shapes with zero realistic finger joints.
[ ] 4. Outline Uniformity: Thick, solid dark charcoal vector strokes with smooth rounded ends.
[ ] 5. Color Purity: Flat solid vector fills with no noisy digital grain or airbrushing.
[ ] 6. Squint Silhouette: Silhouette reads with 100% clarity at 32x32px without needing color.
[ ] 7. Prop Economy: Maximum of 0–1 narrative prop; no background clutter.
[ ] 8. Acting Specificity: Emotion is extreme, comedic, or deeply touching (Duolingo personality).
[ ] 9. App Lifecycle Connection: Asset directly maps to an actual user journey moment in Happy.
[ ] 10. Alpha Transparency: Background cleanly flood-filled to 100% alpha; white belly & face preserved.
```

---

## 3. Disqualification Decision Tree

```
          [ Generated Candidate Asset ]
                       │
             Does it have fingers?
             ├── YES ──> [ REJECT: Remprompt with mitten paws ]
             └── NO
                       │
             Does it have props / clutter?
             ├── YES ──> [ REJECT: Strip background & extra props ]
             └── NO
                       │
             Is belly heart present (#C8BEE6)?
             ├── NO  ──> [ REJECT: Enforce lavender heart ]
             └── YES
                       │
             Does it pass 32px Squint Test?
             ├── NO  ──> [ REJECT: Exaggerate body pose ]
             └── YES
                       │
            [ PASS: Proceed to Transparency Pipeline ]
```

# 01 - Happi Panda: Brand Identity & Anatomical Specifications

This document defines the immutable anatomical rules, geometric proportions, and color specifications for **Happi**, the panda companion in Happy.

---

## 1. Master Character Reference
- **Canonical Asset**: [`assets/images/panda/panda.png`](file:///Users/samuelprasad/Desktop/happy/journals/assets/images/panda/panda.png)
- **Aesthetic**: Flat 2D vector sticker illustration. Zero 3D skeuomorphism, zero photorealism, zero painterly textures.

---

## 2. Anatomical Proportions & Dimensions

```
   ┌───────────────────────┐
   │       [ EARS ]        │
   │    ┌─────────────┐    │
   │    │  HEAD (60%) │    │  <- Chibi Ratio: Head is 55%-60% of total height
   │    │  (Eyes/Tuft)│    │
   │    └─────────────┘    │
   │     BODY (40%)        │  <- Compact rounded torso, stubby limbs
   │   [Lavender Heart]    │
   │      [Paws/Feet]      │
   └───────────────────────┘
```

- **Head-to-Body Ratio**: 60 / 40. The head is large, circular-to-squircle, and houses 90% of the emotional acting.
- **Limbs**: Short, chubby, rounded limbs. Arms and legs are solid black cylinders with rounded caps.
- **Mitten Paws**: Paws are simplified 1-piece rounded bean shapes. **Strictly zero individual fingers, knuckles, nails, or claws.**
- **Head Crown Tuft**: A single distinct tuft of white fur centered at the top of the skull between the ears.
- **Ears**: Symmetrical rounded semi-circles angled slightly outward at the 10 o'clock and 2 o'clock positions.
- **Eye Architecture**:
  - Outermost black eye patches: Large tilted ovals angled downward toward the nose.
  - Sclera / Pupils: Extra-large solid black circular pupils.
  - Catchlights: Glossy circular white specular highlight spots (typically 1 large primary circle + 1 small secondary dot).

---

## 3. Strict Color System & Hex Tokens

| Element | Hex Code | Role | Rules |
| :--- | :--- | :--- | :--- |
| **White Coat** | `#FFFFFF` | Face, skull, and belly patch | Pure solid white fill. Never muddy cream or grey. |
| **Charcoal Black** | `#1E1E24` | Outlines, ears, limbs, eye patches | Uniform dark charcoal. Softer than `#000000` to prevent harsh visual clipping. |
| **Signature Belly Heart** | `#C8BEE6` | Emblem on white belly | Mandatory brand anchor. Centered horizontally on tummy. |
| **Cheek Blush / Tongue** | `#FCA5A5` / `#F87171` | Cheeks (blush) & inner mouth | Soft coral pink. Used for emotional warmth. |
| **Grounding Shadow** | `#E5E7EB` | Soft oval under feet | Flat tint, zero feathered blur. |

---

## 4. Vector Line Rules
- **Stroke Weight**: Thick, uniform vector stroke weight across the entire silhouette.
- **Stroke Caps & Joins**: Rounded caps (`stroke-linecap: round`) and smooth rounded corner joins (`stroke-linejoin: round`).
- **Forbidden**: Tapered calligraphic pressure lines, sketched pencil artifacts, wobbly hand-drawn edges.

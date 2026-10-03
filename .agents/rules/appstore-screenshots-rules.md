# App Store Screenshot Generation Rules & Memory (Happy)

This document is the single source of truth for generating App Store promotional screenshots. All future agents, automated pipelines, and redesign tasks MUST follow these exact rules to guarantee zero AI slop and 100% brand consistency.

---

## 1. Visual System & Canvas Tokens

- **Canvas Background:** Warm Calming Sage Cream (`#F6F8F4` to `#EDF2EB`).
- **Seamless Padding Hex:** `#F0F5EF` or `#EFF5EC` (sample pixel [10, 10] before padding).
- **Header Branding:** Minimal leaf icon + `HAPPY` in spaced uppercase Nunito.
- **Headline Formula (Two-Line High Contrast):**
  - **Line 1 (Benefit Hook):** Fresh vibrant grass green (`#4CAF50` / `#58A700`), Nunito ExtraBold (800).
  - **Line 2 (Closer):** Deep solid charcoal ink (`#182418` / `#142414`), Nunito ExtraBold (800).
- **Target App Store Dimensions:** `1284 x 2778 px` (Apple 6.5"/6.7" Super Retina specification).

---

## 2. Zero AI Slop Anti-Patterns (STRICTLY BANNED)

1. **NO 3D CGI Plush / Airbrushed Fur:** Banned. Never render the mascot with 3D raytraced shading, fluffy hair, or gradient lighting.
2. **NO Glossy Candy/Jelly 3D Nodes:** Banned. Never render app buttons or nodes as translucent glowing jelly drops.
3. **NO Hallucinated / Warped App UI:** Banned. The phone screen MUST represent 1:1 real simulator UI (exact headers, real counters, real buttons, real tab bars).
4. **NO Cliché Foliage Clutter:** Banned. Never place cheesy corner monstera leaves or dark artificial vignetting around the phone.
5. **NO Melted / Distorted Tooltips:** Banned. Use sharp flat vector speech bubbles or buttons.

---

## 3. Mascot System: 2D Flat Vector Panda

The mascot must strictly match the style of `/Users/samuelprasad/Desktop/ChatGPT Image Apr 7, 2026, 11_18_08 AM.png`:
- **Style:** Pure 2D flat vector cartoon character.
- **Outlines:** Thick, solid, clean black vector stroke (`#111111`).
- **Fills:** Flat pure white and black fills (zero gradients).
- **Face:** Cute anime sparkling eyes with double catchlights, smiling cat mouth (`ω`), small black nose.
- **Belly:** Small lavender-grey heart (`#D8DCE8`) centered on white tummy.
- **Actions by Screen Context:**
  - **Screen 1 (Journey Map):** Standing beside the path, waving cheerfully with right hand.
  - **Screen 2 (Voice Journal):** Sitting peacefully, wearing cozy green over-ear headphones, eyes closed smiling.
  - **Screen 3 (Life Insights):** Pointing upward or holding magnifying glass, celebrating positive mood trend.
  - **Screen 4 (Thought Reframing):** Pondering with paw on chin, or triumphant with broken trap.
  - **Screen 5 (Habits / Daily Routines):** Watering a small plant sprout or holding a gold star.
  - **Screen 6 (Coping Cards / SOS):** Offering a warm hug or holding a heart.

---

## 4. Prompt Engineering Formula for `generate_image`

Always pass 3 image references:
1. `Reference 1`: `/Users/samuelprasad/Desktop/ChatGPT Image Apr 7, 2026, 11_18_08 AM.png` (Mascot & typography benchmark)
2. `Reference 2`: Real Simulator Screenshot of the screen
3. `Reference 3`: `/Users/samuelprasad/Desktop/Happy_AppStore_Screen_1_Sage.jpg` (Style anchor for canvas & layout)

**Template Prompt:**
```text
Professional, premium iOS App Store promotional screenshot (portrait 9:16) with zero AI slop, strictly matching the visual system, warm sage cream canvas (#F6F8F4), and typography of Reference 3, using the real app UI from Reference 2 and the panda style from Reference 1. Top section: leaf icon and 'HAPPY' brand logo. Bold rounded headline: line 1 in fresh grass green (#4CAF50) reads '[HEADLINE LINE 1]', line 2 in deep solid charcoal (#182418) reads '[HEADLINE LINE 2]'. Floating modern iPhone displays the EXACT real app screen from Reference 2: [DESCRIBE KEY REAL APP UI ELEMENTS]. Sitting on the canvas beside the phone is the cute 2D flat vector cartoon panda from Reference 1 [DESCRIBE SPECIFIC ACTION/POSE]. Pure 2D flat vector art style with bold black ink outlines, flat black/white fills, small heart on belly. Zero 3D airbrushed CGI fur, zero glossy plastic, zero corner leaf clutter. Impeccable Duolingo/Headspace quality.
```

---

## 5. Post-Processing Pipeline (Exact 1284x2778 without Distortion)

`generate_image` outputs `9:16` (768x1376). To prevent vertical oval distortion when scaling to Apple's `1284x2778` (19.5:9):

```bash
# 1. Extract exact canvas background hex
HEX=$(swift -e '
import AppKit
let image = NSImage(contentsOfFile: "INPUT.jpg")!
var rect = CGRect(x: 10, y: 10, width: 1, height: 1)
let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
let bitmap = NSBitmapImageRep(cgImage: cgImage)
let color = bitmap.colorAt(x: 10, y: 10)!
print(String(format: "%02X%02X%02X", Int(color.redComponent * 255), Int(color.greenComponent * 255), Int(color.blueComponent * 255)))
')

# 2. Resample width proportionally to 1284
sips -s format png --resampleWidth 1284 "INPUT.jpg" --out "/tmp/resampled.png"

# 3. Seamlessly pad height to 2778 with matching background hex
sips --padToHeightWidth 2778 1284 --padColor "$HEX" "/tmp/resampled.png" --out "OUTPUT_1284x2778.png"
```

---

## 6. Official Screen Slots Mapping

| Slot | File Name | Feature | Headline | Mascot Action |
|:---|:---|:---|:---|:---|
| **01** | `01_...png` | Gamified CBT Journey | *"Your mind, one lesson at a time"* / *"Simple & fun."* | Waving happily |
| **02** | `02_...png` | Voice Journaling | *"Just talk. Happy listens."* / *"Effortless & private."* | Wearing cozy headphones |
| **03** | `03_...png` | Life Insights & Trends | *"Daily to Yearly Insights"* / *"Understand your patterns."* | Holding magnifying glass |
| **04** | `04_...png` | Thought Reframing | *"Break Thinking Traps"* / *"Challenge the spiral."* | Pondering with paw on chin |
| **05** | `05_...png` | Daily Habits & Streaks | *"Build Lasting Habits"* / *"One day at a time."* | Holding streak flame / star |
| **06** | `06_...png` | Coping Cards & SOS | *"Your Calm Toolkit"* / *"Ready when you need it."* | Warm comforting hug |

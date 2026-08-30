---
name: Happy Journals
description: Calm CBT journaling interface for structured emotional clarity.
colors:
  sage-50: "#f8fbf6"
  sage-100: "#e5ede1"
  sage-200: "#d3e0cd"
  sage-300: "#abc0a2"
  sage-500: "#5f7f58"
  sage-600: "#44633f"
  sage-700: "#29452a"
  sage-800: "#152714"
  canvas: "#F8FAF7"
  surface: "#ffffff"
  surface-soft: "#F7F7F7"
  ink: "#142414"
  ink-soft: "#767676"
  ink-muted: "#AFAFAF"
  border: "#E5E5E5"
  danger: "#e7000b"
  terracotta: "#FF4B4B"
  gold: "#FFD900"
  otter-blue: "#1CB0F6"
  macaw-purple: "#CE82FF"
typography:
  display:
    fontFamily: "Nunito"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "39px"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Nunito"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Nunito"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "26px"
  body:
    fontFamily: "Nunito"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
  label:
    fontFamily: "Nunito"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  caption:
    fontFamily: "Nunito"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "19px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.sage-500}"
    textColor: "{colors.surface}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "56px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    height: "48px"
    padding: "0 20px"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  guidance-note:
    backgroundColor: "{colors.sage-50}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "16px"
  selected-chip:
    backgroundColor: "{colors.sage-50}"
    textColor: "{colors.sage-700}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
---

## Overview

Happy Journals should feel like a quiet therapy notebook: structured, private, calm, and more precise than decorative. The interface serves vulnerable CBT work, so the user’s own words and next action must lead the hierarchy. Suggestions, examples, voice input, and AI assistance are secondary supports, never the hero.

The visual system is restrained product UI with a playful learning edge: sage-tinted structure, white writing surfaces, dark botanical ink, and Nunito across every text role. Avoid anything that makes the app feel generated, performative, or over-coached.

## Colors

The core palette is sage, white, and dark green ink. Use `canvas` for the app background, `surface` for writing areas, `sage-50` through `sage-200` for gentle instruction states, and `sage-500` through `sage-700` for primary action, selection, and progress.

Semantic accents should be rare and functional. `danger` and `terracotta` are for errors or strong negative feedback, `gold` is for reward states, and bright blue or purple should not become generic AI-assistant branding. Muted text must stay readable on tinted panels; do not use pale gray body copy for elegance.

## Typography

Use Nunito throughout the app. Create hierarchy with weight, size, spacing, and color: 800 for primary learning prompts, 700 for primary actions, 600 for choices and labels, and 400 for supporting content. Do not add another font family unless Nunito cannot serve a specific functional need.

The default screen hierarchy is title, short helper sentence, primary input, then optional assistance. Keep instructional copy short and concrete. Avoid tracked uppercase eyebrows except where an existing component genuinely needs a compact label.

## Elevation

Prefer tonal layering over shadows. Most surfaces should separate through fill, border, and spacing rather than floating cards. Primary buttons can use a physical rim or press-depth treatment because they behave like tactile controls.

Avoid ghost cards: do not pair a 1px border with a wide soft shadow. Cards, inputs, and instruction boxes should top out at `24px` radius, with full pills reserved for chips and buttons. Focus states should be visible but quiet: sage border, subtle glow, or tonal change.

## Components

Primary buttons are sage, pill-like, tactile, and high contrast. Disabled buttons are visually quiet but still legible. Secondary buttons are white with a crisp border and should not compete with the primary action.

Inputs are the main object on exercise screens. They appear before AI suggestions on vulnerable steps, use roomy multiline fields, and show supportive validation only when it explains what is valid. Voice controls are opt-in and need privacy-aware framing when shown.

Guidance notes are concise, factual, and instructional. Suggestion rows are optional starting points with plain `Use` actions; they should not use sparkles, assistant-branded decoration, or harsh priming language. Validation notes should describe quality, not just length.

## Do's and Don'ts

Do lead with the user’s own words, use calm sage structure, keep CTAs physically clear, and make every optional support feel secondary. Do preserve large tap targets, readable contrast, reduced-motion paths, and consistent form-control vocabulary.

Do not ship AI-generated UI slop, generic gradient backgrounds, arbitrary oversized card radii, decorative ghost cards, monotonous card stacks, or eyebrow tropes. Do not place harsh suggestions above an empty user input. Do not turn therapeutic guidance into blue SaaS callouts, sparkle rows, or verbose assistant copy.

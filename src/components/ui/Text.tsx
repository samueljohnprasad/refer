import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { tv, type VariantProps } from "@/lib/tv";
import { GOLD, MACAW_PURPLE, SAGE, TERRACOTTA } from "@/lib/tokens";
import { useThemeColor } from "@/lib/useThemeColor";

/**
 * Text — typography system mapped to the Duolingo type scale.
 *
 * Variant guide
 * ─────────────
 * display        Largest voice. 36px extra-bold Nunito. One instance per screen max.
 *                Lesson-complete headline, streak milestone number, onboarding hero.
 *
 * h1             Screen title. 28px. Anchors the user spatially — every major screen
 *                has exactly one. Modal titles, page headers, section introductions.
 *
 * h2             Section heading. 22px. Divides content into discrete groups.
 *                Settings section headers, challenge category names, grouped blocks.
 *
 * h3             Card heading. 18px. Scannable in a thumb-scroll list.
 *                Card titles, lesson names, achievement titles, challenge names.
 *
 * display-italic / h1-italic / h2-italic
 *                Expressive Nunito italics. Hero pull quotes, celebratory moments,
 *                onboarding emotional beats. Use sparingly — one per screen.
 *
 * body-bold      17px bold Nunito. Interactive text — anything the user reads before
 *                making a decision. Answer option text, key instructions, form labels
 *                that precede a tap target.
 *
 * body           17px regular Nunito. Informational / non-interactive copy. Explanation
 *                after a correct/incorrect answer, tips, help text, descriptions.
 *                Default color is ink-soft to signal "context, not a prompt to act."
 *
 * caption        13px medium. Secondary metadata below a primary label.
 *                Timestamps, lesson duration estimates, "2 mistakes · 3 min" rows.
 *
 * caption-muted  Same as caption but ink-muted. Truly peripheral info — dates,
 *                counts on inactive items, greyed-out supplementary data.
 *
 * label          14px medium. Form field labels, settings row labels, list item
 *                secondary lines that aren't captions.
 *
 * label-bold     14px bold. Emphasized label — selected state labels, step numbers,
 *                active filter pill text.
 *
 * button-label   17px bold, +0.01em tracking. Matches Button component's label slot.
 *                Use only when rendering a button label outside the Button component.
 *
 * eyebrow        11px bold ALL CAPS, wide tracking, sage-500. Section identifiers
 *                that orient the user. "DAILY REFLECTION", "YOUR PATTERN", "UNIT 2".
 *                Max 3 words — longer strings should use caption or h3 instead.
 *
 * overline       Same as eyebrow but ink-muted. Neutral section label with no brand
 *                accent. Use when the sage colour would compete with nearby content.
 *
 * chip           12px bold. Compact text inside pills, badges, and status chips.
 *                XP labels, duration labels, filter counts — anything inside a
 *                rounded-full container. Inherits ink-soft by default.
 *
 * counter        36px extra-bold Nunito with tabular numerals. Streak count, XP total,
 *                hearts remaining. Tabular numerals prevent layout shift during
 *                count-up animations. Pair with eyebrow above and caption below.
 *
 * Color override (works with any variant)
 * ────────────────────────────────────────
 * ink / soft / muted   Three ink levels — primary text, secondary, peripheral.
 * sage                 Brand accent — use only where green communicates "active/success".
 * surface              White text — on dark or coloured fills (primary CTA, premium).
 * danger               Cardinal red — error messages, destructive confirmations.
 * streak               Bee-yellow — streak number, XP boost labels.
 * premium              Macaw purple — Super/premium tier labels.
 */
const textTv = tv({
  base: "",
  variants: {
    variant: {
      // ── Heading weights (Nunito) ────────────────────────────────────────────
      // §3 Display — 36px, -0.02em tracking, one instance per screen max
      display:
        "happy-font-heading-bold text-[36px] leading-[39px] tracking-[-0.02em] text-ink",
      // §3 Screen Title (H1) — 28px, -0.01em tracking
      h1: "happy-font-heading text-[28px] leading-[32px] tracking-[-0.01em] text-ink",
      // §3 Section Heading (H2) — 22px, no tracking
      h2: "happy-font-heading text-[22px] leading-[26px] text-ink",
      // §3 Card Heading (H3) — 18px
      h3: "happy-font-heading-medium text-[18px] leading-[22px] text-ink",
      // Italic expressive variants — hero moments, pull quotes
      "display-italic":
        "happy-font-heading-semibold-italic text-[36px] leading-[39px] tracking-[-0.02em] text-ink",
      "h1-italic":
        "happy-font-heading-semibold-italic text-[28px] leading-[32px] tracking-[-0.01em] text-ink",
      "h2-italic":
        "happy-font-heading-medium-italic text-[22px] leading-[26px] text-ink",

      // ── Body weights (Nunito) ──────────────────────────────────────────────
      // §3 Body Bold — 17px, line-height 1.29 — interactive text, answer options
      "body-bold": "happy-font-body-bold text-[17px] leading-[22px] text-ink",
      // §3 Body Regular — 17px, line-height 1.41 — explanatory / non-interactive
      body: "happy-font-body text-[17px] leading-[24px] text-ink-soft",
      // §3 Caption / Metadata — 13px, medium weight, +0.01em tracking
      caption:
        "happy-font-body-medium text-[13px] leading-[19px] tracking-[0.01em] text-ink-soft",
      "caption-muted":
        "happy-font-body-medium text-[13px] leading-[19px] tracking-[0.01em] text-ink-muted",
      // Label — 14px medium, for form labels and secondary UI text
      label: "happy-font-body-medium text-[14px] leading-[20px] text-ink",
      "label-bold": "happy-font-body-bold text-[14px] leading-[20px] text-ink",
      // §3 Button Label — 17px bold, title case, +0.01em tracking
      "button-label":
        "happy-font-body-bold text-[17px] leading-[22px] tracking-[0.01em] text-brand-surface",
      // §3 Eyebrow — 11px, ALL CAPS, +0.08em tracking, sage accent
      eyebrow:
        "happy-font-body-bold text-[11px] leading-[16px] uppercase tracking-widest text-sage-500",
      // §3 Overline — neutral eyebrow (no sage), for generic section labels
      overline:
        "happy-font-body-bold text-[11px] leading-[16px] uppercase tracking-widest text-ink-muted",
      // §3 Chip — 12px bold, compact pill/badge text
      chip: "happy-font-body-bold text-[12px] leading-[16px] text-ink-soft",
      // §3 Counter / Numeric — tabular numerals, contextual size set via className
      counter:
        "happy-font-heading-bold text-[36px] leading-[36px] tracking-[-0.01em] tabular-nums text-ink",
    },
    color: {
      ink: "text-ink",
      soft: "text-ink-soft",
      muted: "text-ink-muted",
      sage: "text-sage-500",
      surface: "text-brand-surface",
      danger: "text-cardinal-red",
      streak: "text-bee-yellow",
      premium: "text-macaw-purple",
    },
  },
  defaultVariants: { variant: "body" },
});

type TextVariants = VariantProps<typeof textTv>;

interface TextProps extends RNTextProps {
  variant?: TextVariants["variant"];
  color?: TextVariants["color"];
  className?: string;
  allowFontScaling?: boolean;
  children: React.ReactNode;
}

export function Text({
  variant,
  color,
  className,
  allowFontScaling = true,
  children,
  style,
  ...rest
}: TextProps) {
  const theme = useThemeColor();
  const resolvedColor = resolveTextColor(color, variant, theme);

  return (
    <RNText
      className={textTv({ variant, color, class: className })}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={1.5}
      style={[{ color: resolvedColor }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

function resolveTextColor(
  color: TextVariants["color"],
  variant: TextVariants["variant"],
  theme: ReturnType<typeof useThemeColor>,
): string {
  if (color === "surface") return "#FFFFFF";
  if (color === "sage" || variant === "eyebrow") return SAGE[500];
  if (color === "danger") return TERRACOTTA;
  if (color === "streak") return GOLD;
  if (color === "premium") return MACAW_PURPLE;
  if (color === "soft" || isSoftVariant(variant)) return theme.mutedForeground;
  if (
    color === "muted" ||
    variant === "caption-muted" ||
    variant === "overline"
  ) {
    return theme.mutedForeground;
  }
  return theme.foreground;
}

function isSoftVariant(variant: TextVariants["variant"]): boolean {
  return variant === "body" || variant === "caption" || variant === "chip";
}

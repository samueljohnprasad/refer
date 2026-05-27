import React from "react";
import { Pressable, View, type ViewProps } from "react-native";
import * as Haptics from "expo-haptics";
import { tv, type VariantProps } from "@/lib/tv";

/**
 * Card — information container with depth border system.
 * All interactive variants use Pressable automatically when onPress is provided
 * or when the variant is inherently pressable (answer, word-bank, notification, tile).
 *
 * Variant guide
 * ─────────────
 * answer           Default state of a multiple-choice option. White fill, grey border,
 *                  4px bottom border depth. Full-width, min 64px. The most-tapped
 *                  component in any lesson flow.
 *
 * answer-selected  User has tapped an option but not yet submitted. Blue tint signals
 *                  "I chose this." Swap from answer on selection.
 *
 * answer-correct   Confirmed correct result. Sage tint + checkmark icon. Swap from
 *                  answer-selected after the answer is graded.
 *
 * answer-incorrect Confirmed wrong result. Red tint. Swap from answer-selected after
 *                  grading. Pair with a shake animation.
 *
 * answer-disabled  Already-used option (placed in answer area or exhausted). Flat, no
 *                  depth — communicates "not currently actionable."
 *
 * word-bank        Pill-shaped tile for word-bank drag/tap exercises. Shallower border-b-3
 *                  because smaller size makes full border-b-4 look disproportionate.
 *
 * word-bank-placed Flat pill — the word has been placed in the answer slot. Depth removed
 *                  to signal it's no longer available in the bank.
 *
 * unit             Full-width section banner dividing the learning path. Flat (no depth)
 *                  — it's a wayfinding container, not a tappable action. Contextual fill.
 *
 * metric           Soft-grey background tile for XP / stats display. Stack eyebrow +
 *                  counter + caption vertically inside. No border depth — stat panels
 *                  are informational, not interactive.
 *
 * achievement-unlocked  Earned badge. White fill with gold bottom border. Full colour icon.
 * achievement-locked    Locked badge. Grey-tinted fill, no depth. Shows silhouette of
 *                       the badge — user can see what they're working toward.
 *
 * notification     Pressable nudge card. "You're about to lose your streak" style alerts.
 *                  Contextual fill (yellow for streak, green for XP, blue for info).
 *                  Always includes a trailing chevron icon to signal tappability.
 *
 * leaderboard-default    Standard league row. White fill, bottom divider only.
 * leaderboard-self       User's own row. Bee-yellow tint — instantly findable on scroll.
 * leaderboard-promotion  Top-10 zone. Sage tint signals "you're getting promoted."
 * leaderboard-demotion   Bottom-5 zone. Red tint signals "you're at risk."
 *
 * flat             Static info card. Settings rows, stat panels, non-tappable list items.
 *                  Two-sided border, no bottom depth.
 *
 * flat-strong      Flat card with heavier border. Use when the card needs more visual
 *                  weight against a tinted background (e.g. inside a sage-50 section).
 *
 * selected         Active state of a flat card. Sage border + sage-tinted background.
 *                  Settings row that's currently active, selected filter, active tab panel.
 *
 * raised           Hero panel. Deepest depth (border-b-6). Use for the primary widget on
 *                  a screen — streak widget, emotion logger, main exercise card.
 *
 * tile             Interactive exercise or challenge card. border-b-5, press affordance.
 *                  Quick-journal cards, challenge tiles, anything PressableScale-worthy
 *                  that isn't a full-screen flow entry.
 *
 * empty            Dashed border, soft fill. Slot awaiting content — no depth because
 *                  it's not a pressable action. Onboarding empty states, blank journal
 *                  slots, "add your first X" placeholders.
 *
 * Radius guide
 * ────────────
 * sm (12px)   CTA buttons, modal containers
 * md (16px)   Answer cards, most cards — default
 * lg (20px)   Hero panels, prominent widgets
 * xl (24px)   Bottom sheet top corners
 * full        Pill chips, word-bank tiles
 */
const cardTv = tv({
  slots: {
    root: "",
    content: "",
  },
  variants: {
    variant: {
      // ── §8.1 Answer Option Card — most-used card in the product ───────────
      // Default pressable state; swap to answer-correct / answer-incorrect on result
      answer: {
        root: "happy-brand-pressed-card active:border-b-2 active:translate-y-[2px]",
        content: "px-4 py-[14px]",
      },
      "answer-selected": {
        root: "happy-brand-pressed-card-selected active:border-b-2 active:translate-y-[2px]",
        content: "px-4 py-[14px]",
      },
      "answer-correct": {
        root: "happy-brand-card-correct",
        content: "px-4 py-[14px]",
      },
      "answer-incorrect": {
        root: "happy-brand-card-incorrect",
        content: "px-4 py-[14px]",
      },
      // Disabled answer (used / already placed) — flat, no depth
      "answer-disabled": {
        root: "happy-brand-card",
        content: "px-4 py-[14px]",
      },

      // ── §8.2 Word Bank Tile — pill, shallower depth (border-b-[3px]) ──────
      "word-bank": {
        root: "happy-brand-pressed-card rounded-full border-b-[3px] active:border-b-[1px] active:translate-y-[2px]",
        content: "px-4",
      },
      "word-bank-placed": {
        root: "bg-brand-surface-soft border-2 border-brand-border rounded-full",
        content: "px-4",
      },

      // ── §8.4 Unit / Section Banner — flat, no depth (wayfinding only) ─────
      unit: {
        root: "bg-brand-surface-soft border-2 border-brand-border",
        content: "p-4",
      },

      // ── §8.5 XP / Stats Card ──────────────────────────────────────────────
      metric: {
        root: "happy-brand-metric-card",
        content: "p-4",
      },

      // ── §8.6 Achievement / Badge Card ─────────────────────────────────────
      "achievement-unlocked": {
        root: "happy-brand-pressed-card border-b-4 border-b-[#C8960C]",
        content: "p-4",
      },
      "achievement-locked": {
        root: "bg-brand-surface-soft border-2 border-brand-border",
        content: "p-4",
      },

      // ── §8.7 Notification / Nudge Card ────────────────────────────────────
      notification: {
        root: "happy-brand-pressed-card active:border-b-2 active:translate-y-[2px]",
        content: "px-4 py-3",
      },

      // ── §8.8 Leaderboard Row ──────────────────────────────────────────────
      "leaderboard-default": {
        root: "bg-brand-surface border-b border-brand-border",
        content: "px-4 py-3",
      },
      "leaderboard-self": {
        root: "bg-bee-yellow-tint border-b border-brand-border",
        content: "px-4 py-3",
      },
      "leaderboard-promotion": {
        root: "bg-sage-selected border-b border-brand-border",
        content: "px-4 py-3",
      },
      "leaderboard-demotion": {
        root: "bg-cardinal-red-tint border-b border-brand-border",
        content: "px-4 py-3",
      },

      // ── Static flat cards ─────────────────────────────────────────────────
      flat: {
        root: "happy-brand-card",
        content: "p-4",
      },
      "flat-strong": {
        root: "happy-brand-card-strong",
        content: "p-4",
      },
      selected: {
        root: "happy-brand-card-selected",
        content: "p-4",
      },

      // ── Elevated / hero panel ─────────────────────────────────────────────
      raised: {
        root: "happy-brand-raised-panel",
        content: "p-5",
      },

      // ── Interactive tile (exercise / challenge cards) ──────────────────────
      tile: {
        root: "happy-brand-preview-tile active:border-b-[3px] active:translate-y-[2px]",
        content: "p-4",
      },

      // ── §8.10 Empty State Card ────────────────────────────────────────────
      empty: {
        root: "happy-brand-empty-state",
        content: "p-4",
      },
    },
    radius: {
      sm: { root: "rounded-lg" }, // 12px — CTA buttons, modals
      md: { root: "rounded-xl" }, // 16px — answer cards, most cards (default)
      lg: { root: "rounded-2xl" }, // 20px — hero panels
      xl: { root: "rounded-3xl" }, // 24px — bottom sheet top corners
      full: { root: "rounded-full" }, // pill — chips, word bank tiles
    },
    padding: {
      none: { content: "p-0" },
      sm: { content: "p-3" },
      md: { content: "p-4" },
      lg: { content: "p-5" },
    },
  },
  defaultVariants: { variant: "flat", radius: "md" },
});

type CardVariants = VariantProps<typeof cardTv>;

const PRESSABLE_VARIANTS = new Set<CardVariants["variant"]>([
  "answer",
  "answer-selected",
  "word-bank",
  "notification",
  "tile",
]);

interface CardProps extends Omit<ViewProps, "style"> {
  variant?: CardVariants["variant"];
  radius?: CardVariants["radius"];
  padding?: CardVariants["padding"];
  onPress?: () => void;
  haptic?: "none" | "light" | "medium";
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "flat",
  radius = "md",
  padding,
  onPress,
  haptic = "light",
  disabled = false,
  className,
  contentClassName,
  children,
  ...rest
}: CardProps) {
  const { root, content } = cardTv({ variant, radius, padding });

  const isPressable = onPress !== undefined || PRESSABLE_VARIANTS.has(variant);

  const handlePress = () => {
    if (haptic === "light") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (haptic === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.();
  };

  if (isPressable) {
    return (
      <Pressable
        className={root({ class: className })}
        onPress={onPress ? handlePress : undefined}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        {...rest}
      >
        <View className={content({ class: contentClassName })}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View className={root({ class: className })} {...rest}>
      <View className={content({ class: contentClassName })}>{children}</View>
    </View>
  );
}

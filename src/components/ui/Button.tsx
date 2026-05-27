import React, { ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { tv, type VariantProps } from "@/lib/tv";

/**
 * Button — full-width tactile CTA with 3D border-press mechanic.
 *
 * Variant guide
 * ─────────────
 * primary      The one clear next action on every screen. Sage green fill.
 *              Use at the bottom of lesson flows, onboarding steps, form submits.
 *              Never put two primary buttons on the same screen.
 *
 * secondary    Decline / skip action that lives beside a primary CTA.
 *              White surface, neutral border. Lighter visual weight so the eye
 *              goes to primary first. "Skip", "Remind me later", "Maybe later".
 *
 * correct      Appears after a correct answer. Blue tint mirrors the answer card
 *              feedback state. "Got It", "Continue" in the correct-answer moment.
 *
 * incorrect    Appears after a wrong answer. Red tint mirrors the incorrect card.
 *              "Got It", "Try Again". Same copy as correct — colour carries meaning.
 *
 * destructive  Irreversible actions on white fill, red border. Account deletion,
 *              data clearing. Always paired with a secondary "Cancel" button.
 *
 * premium      Purple fill — reserved for Super / premium upsell flows. Users read
 *              purple as "this costs something" without needing copy to say so.
 *
 * streak       Bee-yellow fill — streak freeze purchase, XP boost activation.
 *              Yellow creates a direct visual link to the streak counter nearby.
 *
 * ghost        No fill, no border. Inline text-style dismiss action.
 *              "No thanks", "Skip for now" beneath a primary CTA. Lowest weight.
 *
 * pill         Rounded-full, shallow depth (border-b-3). Word-bank hint words,
 *              filter chips that behave like toggles, tag-style actions.
 */
const buttonTv = tv({
  slots: {
    root: "items-center justify-center overflow-hidden rounded-xl active:border-b-2 active:translate-y-[2px]",
    row: "flex-row items-center justify-center",
    label: "happy-font-body-bold leading-none",
  },
  variants: {
    variant: {
      primary: {
        root: "bg-sage-500 border-b-4 border-b-sage-700",
        label: "text-brand-surface",
      },
      secondary: {
        root: "border-2 border-b-4 border-brand-border border-b-brand-border-strong bg-brand-surface",
        label: "text-ink-soft",
      },
      correct: {
        root: "border-2 border-b-4 border-otter-blue/50 border-b-otter-blue bg-otter-blue-tint",
        label: "text-otter-blue",
      },
      incorrect: {
        root: "border-2 border-b-4 border-cardinal-red-border border-b-cardinal-red bg-cardinal-red-tint",
        label: "text-cardinal-red",
      },
      destructive: {
        root: "border-2 border-b-4 border-cardinal-red-border border-b-cardinal-red bg-brand-surface",
        label: "text-cardinal-red",
      },
      premium: {
        root: "border-2 border-b-4 border-[#9B59B6] border-b-[#7B3AAD] bg-macaw-purple",
        label: "text-brand-surface",
      },
      streak: {
        root: "border-2 border-b-4 border-[#F0B400] border-b-[#C89400] bg-bee-yellow",
        label: "text-ink",
      },
      ghost: {
        root: "bg-transparent active:opacity-70 active:border-b-0 active:translate-y-0",
        label: "text-ink-soft",
      },
      pill: {
        root: "rounded-full border-2 border-b-[3px] border-brand-border border-b-brand-border-strong bg-brand-surface active:border-b-[1px]",
        label: "text-ink",
      },
    },
    size: {
      sm: { root: "h-10 px-4", row: "gap-1.5", label: "text-[15px]" },
      md: { root: "h-12 px-6", row: "gap-2", label: "text-[16px]" },
      lg: { root: "h-14 px-6", row: "gap-2", label: "text-[17px]" },
    },
    fullWidth: {
      true: { root: "w-full" },
      false: { root: "self-start" },
    },
    disabled: {
      true: { root: "opacity-50" },
    },
    loading: {
      true: { root: "opacity-50" },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      disabled: true,
      class: { root: "bg-sage-200 border-b-sage-300 opacity-100" },
    },
  ],
  defaultVariants: { variant: "primary", size: "lg", fullWidth: true },
});

type ButtonVariant = NonNullable<VariantProps<typeof buttonTv>["variant"]>;

const SPINNER_COLOR: Record<ButtonVariant, string> = {
  primary: "accent-brand-surface",
  secondary: "accent-ink-soft",
  correct: "accent-otter-blue",
  incorrect: "accent-cardinal-red",
  destructive: "accent-cardinal-red",
  premium: "accent-brand-surface",
  streak: "accent-ink",
  ghost: "accent-ink-soft",
  pill: "accent-ink",
};

type ButtonVariants = VariantProps<typeof buttonTv>;

interface ButtonProps {
  label: string;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  accessibilityLabel?: string;
  haptic?: "none" | "light" | "medium";
  className?: string;
  labelClassName?: string;
}

export function Button({
  label,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  haptic = "light",
  className,
  labelClassName,
}: ButtonProps) {
  const {
    root,
    row,
    label: labelCls,
  } = buttonTv({
    variant,
    size,
    fullWidth,
    disabled,
    loading,
  });

  const handlePress = () => {
    if (haptic === "light") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (haptic === "medium") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.();
  };

  const spinnerColorClass = SPINNER_COLOR[variant];

  return (
    <Pressable
      className={root({ class: className })}
      onPress={onPress ? handlePress : undefined}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      <View className={row()}>
        {loading ? (
          <ActivityIndicator colorClassName={spinnerColorClass} size="small" />
        ) : (
          <>
            {leftIcon}
            <Text className={labelCls({ class: labelClassName })}>{label}</Text>
            {rightIcon}
          </>
        )}
      </View>
    </Pressable>
  );
}

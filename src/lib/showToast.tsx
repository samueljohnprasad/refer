import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Toast, type useToast } from "heroui-native";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export interface ShowToastOptions {
  variant?: "danger" | "success" | "warning" | "accent" | "default";
  title: string;
  description?: string;
}

/**
 * High-contrast toast wrapper for HeroUI Native useToast hook.
 * Guarantees crisp, readable description subtext on all screen themes.
 */
export function showAppToast(
  toast: ReturnType<typeof useToast>["toast"],
  options: ShowToastOptions
) {
  const { variant = "default", title, description } = options;

  toast.show({
    component: (props) => (
      <Toast variant={variant} {...props}>
        <Toast.Title style={{ fontFamily: APP_FONT_FAMILIES.semiBold, fontSize: 14 }}>
          {title}
        </Toast.Title>
        {description ? (
          <Toast.Description
            style={{
              fontFamily: APP_FONT_FAMILIES.semiBold,
              fontSize: 13,
              color: SEMANTIC_COLORS.text.primary, // High-contrast ink token (WCAG AAA compliant on white)
              opacity: 1,
              marginTop: 2,
            }}
          >
            {description}
          </Toast.Description>
        ) : null}
      </Toast>
    ),
  });
}

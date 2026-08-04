import React, { type ReactNode } from "react";
import {
  StyleSheet,
  type ViewProps,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import { LessonHeader } from "@/src/components/ui/LessonHeader";
import {
  LessonScreenFooter,
  type LessonScreenFooterProps,
  type LessonScreenFooterVariant,
} from "@/src/components/ui/LessonScreenFooter";

// ─── Types ───────────────────────────────────────────────────────────────────

type BackButtonVariant = "close-text" | "close-icon" | "arrow";
type FooterVariant = LessonScreenFooterVariant;

interface ProgressHeaderProps {
  /** Progress value (0–1). Omit to hide the bar entirely. */
  progress?: number;
  /** Label shown to the right of the progress bar (e.g. "+10 XP", "75%"). */
  trailingLabel?: string;
  /** Called when the close/back button is tapped. */
  onClose?: () => void;
  /** Which navigation icon to render. @default "close-icon" */
  backButtonVariant?: BackButtonVariant;
  /** Fill color for the progress bar. @default sage-500 */
  progressFillColor?: string;
  /** Track color for the progress bar. @default sage-100 */
  progressTrackColor?: string;
  /** Height of the progress bar in px. @default 12 */
  progressHeight?: number;
  /** Tint color for the close/back icon. @default "#4F604F" */
  iconColor?: string;
  /** Color of the trailing label text. @default "#C8694B" */
  trailingLabelColor?: string;
  /** Additional style applied to the header container. */
  style?: StyleProp<ViewStyle>;
}

interface ContentProps extends ScrollViewProps {
  children: ReactNode;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

interface LessonScreenProps
  extends
    ViewProps,
    Partial<Omit<ProgressHeaderProps, "style">>,
    Partial<Omit<LessonScreenFooterProps, "style" | "variant" | "className">> {
  children: ReactNode;
  /** Hide the header entirely when using the monolithic component. @default false */
  hideHeader?: boolean;
  /** Hide the footer entirely when using the monolithic component. @default false */
  hideFooter?: boolean;
  /** Footer variant. @default "solid" */
  footerVariant?: FooterVariant;
  /** Custom style for the header container. */
  headerStyle?: StyleProp<ViewStyle>;
  /** Custom style for the footer container. */
  footerStyle?: StyleProp<ViewStyle>;
  /** NativeWind class name */
  className?: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

import { GlassView } from "expo-glass-effect";
import { Stack } from "expo-router";

/**
 * Fixed top bar with close/back navigation, animated progress bar, and
 * optional trailing label (XP, percentage, etc.).
 */
const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  progress,
  trailingLabel,
  onClose,
  backButtonVariant = "close-icon",
  progressFillColor,
  progressTrackColor,
  progressHeight,
  iconColor,
  trailingLabelColor,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,
        headerShadowVisible: false,
        header: () => (
          <GlassView
            glassEffectStyle="regular"
            tintColor="#FFFFFF"
            className="pb-2 overflow-hidden"
            style={[
              {
                paddingTop: Math.max(insets.top + 8, 48),
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowColor: "transparent", // IMPORTANT
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
              },
              style,
            ]}
          >
            <LessonHeader
              onClose={onClose}
              progress={progress}
              trailingLabel={trailingLabel}
              backButtonVariant={backButtonVariant}
              progressFillColor={progressFillColor}
              progressTrackColor={progressTrackColor}
              progressHeight={progressHeight}
              iconColor={iconColor}
              trailingLabelColor={trailingLabelColor}
            />
          </GlassView>
        ),
      }}
    />
  );
};

/**
 * Scrollable body area. Wraps `ScreenLayout.Content` and forwards all
 * `ScrollViewProps` through.
 */
const Content: React.FC<ContentProps> = ({
  children,
  hasHeader,
  hasFooter,
  ...scrollProps
}) => {
  return (
    <ScreenLayout.Content
      hasHeader={hasHeader}
      hasFooter={hasFooter}
      {...scrollProps}
    >
      {children}
    </ScreenLayout.Content>
  );
};

// ─── Root component ──────────────────────────────────────────────────────────

/**
 * Reusable screen layout for journey lessons, CBT exercises, and any step-based activity.
 * Can be used as a monolithic component (passing props directly) or a compound component.
 *
 * @example
 * ```tsx
 * // Monolithic Usage:
 * <LessonScreen
 *   progress={0.6}
 *   trailingLabel="+15 XP"
 *   onClose={handleClose}
 *   primaryLabel="Next"
 *   onPrimaryPress={handleNext}
 *   secondaryLabel="Skip for now"
 *   onSecondaryPress={handleSkip}
 * >
 *   <Text>Step content goes here…</Text>
 * </LessonScreen>
 * ```
 */
const LessonScreen = ({
  children,
  className = "",
  hideHeader = false,
  hideFooter = false,
  progress,
  trailingLabel,
  onClose,
  backButtonVariant,
  progressFillColor,
  progressTrackColor,
  progressHeight,
  iconColor,
  trailingLabelColor,
  headerStyle,
  primaryLabel,
  onPrimaryPress,
  primaryDisabled,
  primaryLoading,
  primaryLeftIcon,
  primaryRightIcon,
  secondaryLabel,
  onSecondaryPress,
  secondaryDisabled,
  footerVariant,
  footerStyle,
  status,
  statusMessage,
  ...props
}: LessonScreenProps) => {
  const flattenedStyle = StyleSheet.flatten(props.style) || {};
  const screenBg = flattenedStyle.backgroundColor;

  return (
    <ScreenLayout className={className} {...props}>
      {!hideHeader && (
        <ProgressHeader
          progress={progress}
          trailingLabel={trailingLabel}
          onClose={onClose}
          backButtonVariant={backButtonVariant}
          progressFillColor={progressFillColor}
          progressTrackColor={progressTrackColor}
          progressHeight={progressHeight}
          iconColor={iconColor}
          trailingLabelColor={trailingLabelColor}
          style={[headerStyle, screenBg ? { backgroundColor: screenBg } : undefined]}
        />
      )}
      <Content hasHeader={!hideHeader} hasFooter={!hideFooter}>
        {children}
      </Content>
      {!hideFooter && onPrimaryPress && (
        <LessonScreenFooter
          primaryLabel={primaryLabel}
          onPrimaryPress={onPrimaryPress}
          primaryDisabled={primaryDisabled}
          primaryLoading={primaryLoading}
          primaryLeftIcon={primaryLeftIcon}
          primaryRightIcon={primaryRightIcon}
          secondaryLabel={secondaryLabel}
          onSecondaryPress={onSecondaryPress}
          secondaryDisabled={secondaryDisabled}
          variant={footerVariant}
          style={[
            footerStyle,
            screenBg ? { backgroundColor: screenBg, borderTopWidth: 0 } : undefined,
          ]}
          status={status}
          statusMessage={statusMessage}
        />
      )}
    </ScreenLayout>
  );
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export { LessonScreen };
export type {
  LessonScreenProps,
  ProgressHeaderProps as LessonScreenHeaderProps,
  ContentProps as LessonScreenContentProps,
  LessonScreenFooterProps,
};

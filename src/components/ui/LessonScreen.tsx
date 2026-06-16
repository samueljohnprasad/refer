import React, { type ReactNode, type ReactElement } from "react";
import {
  View,
  type ViewProps,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import { LessonHeader } from "@/src/components/ui/LessonHeader";
import { Button } from "@/src/components/ui/Button";

// ─── Types ───────────────────────────────────────────────────────────────────

type BackButtonVariant = "close-text" | "close-icon" | "arrow";
type FooterVariant = "solid" | "transparent";

interface LessonScreenProps extends ViewProps {
  children: ReactNode;
}

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

interface ActionFooterProps {
  // ── Primary button ──────────────────────────────────────────────────────
  /** Label for the primary (3-D depth) button. @default "Continue" */
  primaryLabel?: string;
  /** Callback fired when the primary button is pressed. */
  onPrimaryPress: () => void;
  /** Disable the primary button. @default false */
  primaryDisabled?: boolean;
  /** Show a loading spinner in the primary button. @default false */
  primaryLoading?: boolean;
  /** Optional icon on the left side of the primary button. */
  primaryLeftIcon?: ReactElement;
  /** Optional icon on the right side of the primary button. */
  primaryRightIcon?: ReactElement;

  // ── Secondary button (optional) ─────────────────────────────────────────
  /** Label for the ghost secondary button. Omit to hide it. */
  secondaryLabel?: string;
  /** Callback fired when the secondary button is pressed. */
  onSecondaryPress?: () => void;
  /** Disable the secondary button. @default false */
  secondaryDisabled?: boolean;

  // ── Footer chrome ───────────────────────────────────────────────────────
  /** Background variant for the footer sheet. @default "solid" */
  variant?: FooterVariant;
  /** Custom style applied to the outer footer container. */
  style?: StyleProp<ViewStyle>;
  /** Custom className for the footer container. */
  className?: string;
}

interface LessonScreenProps extends ViewProps, Partial<Omit<ProgressHeaderProps, "style">>, Partial<Omit<ActionFooterProps, "style" | "variant" | "className">> {
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

import { BlurView } from "expo-blur";

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
    <BlurView
      intensity={50}
      tint="light"
      style={[{ paddingTop: Math.max(insets.top + 8, 48) }, style]}
      className="absolute top-0 left-0 right-0 z-20"
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
    </BlurView>
  );
};

/**
 * Scrollable body area. Wraps `ScreenLayout.Content` and forwards all
 * `ScrollViewProps` through.
 */
const Content: React.FC<ContentProps> = ({ children, hasHeader, hasFooter, ...scrollProps }) => {
  return (
    <ScreenLayout.Content hasHeader={hasHeader} hasFooter={hasFooter} {...scrollProps}>
      {children}
    </ScreenLayout.Content>
  );
};

/**
 * Fixed bottom sheet with a primary (3-D tactile) button and an optional
 * ghost secondary button. All buttons, colors, and the sheet variant are
 * configurable via props.
 */
const ActionFooter: React.FC<ActionFooterProps> = ({
  primaryLabel = "Continue",
  onPrimaryPress,
  primaryDisabled = false,
  primaryLoading = false,
  primaryLeftIcon,
  primaryRightIcon,
  secondaryLabel,
  onSecondaryPress,
  secondaryDisabled = false,
  variant = "solid",
  style,
  className,
}) => {
  return (
    <ScreenLayout.Footer variant={variant} style={style} className={className}>
      <View className="w-full gap-1">
        <Button
          label={primaryLabel}
          onPress={onPrimaryPress}
          disabled={primaryDisabled}
          loading={primaryLoading}
          leftIcon={primaryLeftIcon}
          rightIcon={primaryRightIcon}
          variant="primary"
          fullWidth
        />

        {secondaryLabel && onSecondaryPress ? (
          <Button
            label={secondaryLabel}
            onPress={onSecondaryPress}
            disabled={secondaryDisabled}
            variant="ghost"
            fullWidth
          />
        ) : null}
      </View>
    </ScreenLayout.Footer>
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
  ...props 
}: LessonScreenProps) => {
  // Determine if using as a monolithic component by checking if specific monolithic props are passed
  const isMonolithic = !!onPrimaryPress || !!onClose || progress !== undefined;

  if (isMonolithic) {
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
            style={headerStyle}
          />
        )}
        <Content hasHeader={!hideHeader} hasFooter={!hideFooter}>
          {children}
        </Content>
        {!hideFooter && onPrimaryPress && (
          <ActionFooter
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
            style={footerStyle}
          />
        )}
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout className={className} {...props}>
      {children}
    </ScreenLayout>
  );
};

// ─── Attach sub-components ───────────────────────────────────────────────────

LessonScreen.ProgressHeader = ProgressHeader;
LessonScreen.Content = Content;
LessonScreen.ActionFooter = ActionFooter;

// ─── Exports ─────────────────────────────────────────────────────────────────

export { LessonScreen };
export type {
  LessonScreenProps,
  ProgressHeaderProps as LessonScreenHeaderProps,
  ContentProps as LessonScreenContentProps,
  ActionFooterProps as LessonScreenFooterProps,
};

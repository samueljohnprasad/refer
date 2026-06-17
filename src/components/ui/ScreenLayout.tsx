import React, { ReactNode } from "react";
import { View, ViewProps, ScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

interface ScreenLayoutProps extends ViewProps {
  children: ReactNode;
}

/**
 * A reusable screen layout component using the compound component pattern.
 * Provides a fixed top header, scrollable content area, and a fixed bottom footer.
 */
const ScreenLayout = ({ children, className = "", ...props }: ScreenLayoutProps) => {
  return (
    <View className={`flex-1 bg-brand-surface ${className}`} {...props}>
      {children}
    </View>
  );
};

const Header = ({ children, className = "", ...props }: ViewProps) => {
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      intensity={50}
      tint="light"
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className={`z-10 px-6 pb-2 ${className}`}
      {...props}
    >
      {children}
    </BlurView>
  );
};

interface ContentProps extends ScrollViewProps {
  hasFooter?: boolean;
  hasHeader?: boolean;
}

const Content = ({ children, className = "", contentContainerStyle, hasFooter = true, hasHeader = true, ...props }: ContentProps) => {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      bottomOffset={hasFooter ? 140 : 20}
      className={`flex-1 ${className}`}
      contentContainerStyle={[
        { 
          paddingBottom: hasFooter ? 200 : Math.max(insets.bottom, 24), 
          paddingTop: hasHeader ? Math.max(insets.top, 24) + 100 : Math.max(insets.top, 24), 
          paddingHorizontal: 16 
        },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

interface FooterProps extends ViewProps {
  variant?: "solid" | "transparent";
}

const Footer = ({ children, className = "", style, variant = "solid", ...props }: FooterProps) => {
  const insets = useSafeAreaInsets();
  const isTransparent = variant === "transparent";

  return (
    <View
      style={[
        { 
          ...(isTransparent ? {} : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.04,
            shadowRadius: 16,
            elevation: 10,
          })
        },
        style
      ]}
      className={`absolute bottom-0 left-0 right-0 z-10 ${className}`}
      {...props}
    >
      <BlurView
        intensity={isTransparent ? 0 : 50}
        tint="light"
        className={`px-6 pt-6 ${isTransparent ? 'bg-transparent' : 'rounded-t-[32px] overflow-hidden'}`}
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        {children}
      </BlurView>
    </View>
  );
};

ScreenLayout.Header = Header;
ScreenLayout.Content = Content;
ScreenLayout.Footer = Footer;

export { ScreenLayout };

import React, { ReactNode } from "react";
import { View, ScrollView, ViewProps, ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenLayoutProps extends ViewProps {
  children: ReactNode;
}

/**
 * A reusable screen layout component using the compound component pattern.
 * Provides a fixed top header, scrollable content area, and a fixed bottom footer.
 *
 * @example
 * <ScreenLayout>
 *   <ScreenLayout.Header>
 *     <Text>Top Header</Text>
 *   </ScreenLayout.Header>
 *   
 *   <ScreenLayout.Content>
 *     <Text>Scrollable Content goes here...</Text>
 *   </ScreenLayout.Content>
 *   
 *   <ScreenLayout.Footer>
 *     <Button label="Continue" />
 *   </ScreenLayout.Footer>
 * </ScreenLayout>
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
    <View
      style={{ paddingTop: Math.max(insets.top, 16) }}
      className={`bg-brand-surface z-10 px-6 pb-2 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

interface ContentProps extends ScrollViewProps {
  hasFooter?: boolean;
  hasHeader?: boolean;
}

const Content = ({ children, className = "", contentContainerStyle, hasFooter = true, hasHeader = true, ...props }: ContentProps) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className={`flex-1 ${className}`}
      contentContainerStyle={[
        { 
          paddingBottom: hasFooter ? 120 : Math.max(insets.bottom, 24), 
          paddingTop: hasHeader ? 16 : Math.max(insets.top, 24), 
          paddingHorizontal: 24 
        },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
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
          paddingBottom: Math.max(insets.bottom, 24),
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
      className={`absolute bottom-0 left-0 right-0 px-6 pt-6 z-10 ${isTransparent ? 'bg-transparent' : 'bg-brand-surface rounded-t-[32px]'} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

ScreenLayout.Header = Header;
ScreenLayout.Content = Content;
ScreenLayout.Footer = Footer;

export { ScreenLayout };

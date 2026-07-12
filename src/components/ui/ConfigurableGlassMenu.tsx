import React from "react";
import {
  Button,
  Host,
  HStack,
  Menu,
  Section,
  Image as SUIImage,
  Text as SUIText,
  Toggle,
  VStack,
} from "@expo/ui/swift-ui";
import {
  controlSize,
  font,
  foregroundStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";

export type GlassMenuItemType = "button" | "toggle";

export interface GlassMenuButtonItem {
  type: "button";
  id: string;
  label: string;
  systemImage?: any; // SF Symbol icon name e.g. "bookmark", "trash", "archivebox"
  role?: "destructive" | "cancel";
  onPress: () => void;
}

export interface GlassMenuToggleItem {
  type: "toggle";
  id: string;
  label: string;
  subtitle?: string;
  isOn: boolean;
  onIsOnChange: (value: boolean) => void;
}

export type GlassMenuItem = GlassMenuButtonItem | GlassMenuToggleItem;

export interface GlassMenuSection {
  id?: string;
  title?: string;
  items: GlassMenuItem[];
}

export interface GlassMenuConfig {
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  controlSize?: "mini" | "small" | "regular" | "large";
  minWidth?: number;
  minHeight?: number;
  sections: GlassMenuSection[];
}

export interface ConfigurableGlassMenuProps {
  config: GlassMenuConfig;
}

/**
 * Reusable native iOS SwiftUI Glass Dropdown Menu component.
 * Driven purely by a declarative configuration object (`config`).
 */
export function ConfigurableGlassMenu({ config }: ConfigurableGlassMenuProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const headerFg = isDark ? "#F8F9F8" : "#1C1C1E";
  const headerFgMuted = isDark
    ? "rgba(248, 249, 248, 0.65)"
    : "rgba(28, 28, 30, 0.55)";

  const showChevron = config.showChevron ?? true;

  const renderItem = (item: GlassMenuItem) => {
    if (item.type === "button") {
      return (
        <Button
          key={item.id}
          systemImage={item.systemImage}
          label={item.label}
          role={item.role}
          onPress={() => {
            if (item.role === "destructive") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } else {
              Haptics.selectionAsync();
            }
            item.onPress();
          }}
        />
      );
    }

    if (item.type === "toggle") {
      return (
        <Toggle
          key={item.id}
          isOn={item.isOn}
          onIsOnChange={(val: boolean) => {
            Haptics.selectionAsync();
            item.onIsOnChange(val);
          }}
        >
          <SUIText>{item.label}</SUIText>
          {item.subtitle ? <SUIText>{item.subtitle}</SUIText> : null}
        </Toggle>
      );
    }

    return null;
  };

  return (
    <Host
      matchContents
      style={{
        ...(config.minWidth ? { minWidth: config.minWidth } : {}),
        minHeight: config.minHeight ?? 36,
      }}
    >
      <Menu
        label={
          <VStack spacing={2}>
            <HStack spacing={4} alignment="center">
              <SUIText
                modifiers={[
                  foregroundStyle(headerFg),
                  font({ weight: "semibold", size: 16 }),
                ]}
              >
                {config.title}
              </SUIText>
              {showChevron ? (
                <SUIImage
                  systemName="chevron.down"
                  size={10}
                  color={headerFg}
                />
              ) : null}
            </HStack>
            {config.subtitle ? (
              <SUIText
                modifiers={[
                  foregroundStyle(headerFgMuted),
                  font({ size: 11 }),
                ]}
              >
                {config.subtitle}
              </SUIText>
            ) : null}
          </VStack>
        }
        modifiers={[controlSize(config.controlSize ?? "regular")]}
      >
        {config.sections.map((section, idx) => {
          const sectionKey = section.id ?? `section-${idx}`;
          if (section.title) {
            return (
              <Section key={sectionKey} title={section.title}>
                {section.items.map(renderItem)}
              </Section>
            );
          }
          return (
            <Section key={sectionKey}>
              {section.items.map(renderItem)}
            </Section>
          );
        })}
      </Menu>
    </Host>
  );
}

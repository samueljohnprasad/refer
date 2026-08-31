import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import React, { useState } from "react";
import { View } from "react-native";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";
import { Host, Popover, Button, HStack, Text as SwiftUIText, Image as SwiftUIImage } from "@expo/ui/swift-ui";
import { tint, buttonStyle, padding, frame, foregroundStyle, font } from "@expo/ui/swift-ui/modifiers";

interface PsychoeducationCardProps {
  content: string;
  className?: string;
}

export const PsychoeducationCard: React.FC<PsychoeducationCardProps> = ({
  content,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  return (
    <View className={`mb-4 z-50 self-start ${className}`}>
      <Host matchContents>
        <Popover
          isPresented={expanded}
          onIsPresentedChange={(val) => {
            if (val !== expanded) {
              triggerSelectionHaptic();
            }
            setExpanded(val);
          }}
          attachmentAnchor="bottom"
          arrowEdge="top"
        >
          <Popover.Trigger>
            <Button
              onPress={() => {
                triggerSelectionHaptic();
                setExpanded(true);
              }}
              modifiers={[buttonStyle("plain")]}
            >
              <HStack spacing={4}>
                <SwiftUIText
                  modifiers={[
                    foregroundStyle(SEMANTIC_COLORS.text.secondary),
                    font({ weight: "semibold", size: 13 }),
                  ]}
                >
                  Why this helps
                </SwiftUIText>
                <SwiftUIImage
                  systemName={expanded ? "chevron.up" : "chevron.down"}
                  modifiers={[
                    foregroundStyle(SEMANTIC_COLORS.text.secondary),
                    font({ weight: "semibold", size: 10 }),
                  ]}
                />
              </HStack>
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <HStack
              alignment="top"
              spacing={12}
              modifiers={[
                padding(16),
                frame({ width: 300 })
              ]}
            >
              <SwiftUIImage
                systemName="lightbulb"
                modifiers={[
                  foregroundStyle(SEMANTIC_COLORS.brand.primary),
                  font({ size: 14 })
                ]}
              />
              <SwiftUIText
                modifiers={[
                  foregroundStyle(SEMANTIC_COLORS.brand.pressed),
                  font({ size: 14 })
                ]}
              >
                {content}
              </SwiftUIText>
            </HStack>
          </Popover.Content>
        </Popover>
      </Host>
    </View>
  );
};

PsychoeducationCard.displayName = "PsychoeducationCard";

import React from "react";
import { View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Share01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { styles } from "@/src/components/celebration/lessonCompleteCelebrationStyles";

interface CelebrationActionsProps {
  canInteract: boolean;
  isSharing: boolean;
  continueLabel: string;
  buttonStyle: AnimatedStyle<ViewStyle>;
  onContinue: () => void;
  onShare: () => void;
  copy: { share: string; preparing: string };
}

export function CelebrationActions({
  canInteract, isSharing, continueLabel, buttonStyle, onContinue, onShare, copy,
}: CelebrationActionsProps) {
  return (
    <>
      <View style={styles.spacer} />
      <Animated.View style={[styles.buttonWrap, buttonStyle]}>
        <View testID="celebration-continue-button" style={styles.continueWrap}>
          <Button label={continueLabel} variant="primary" size="lg" fullWidth onPress={onContinue} disabled={!canInteract} />
        </View>
        <View testID="celebration-share-button">
          <Button
            label={isSharing ? copy.preparing : copy.share}
            variant="ghost"
            size="md"
            fullWidth
            leftIcon={<HugeiconsIcon icon={Share01Icon} size={18} color={SEMANTIC_COLORS.text.secondary} strokeWidth={2.2} />}
            onPress={onShare}
            loading={isSharing}
            disabled={!canInteract}
          />
        </View>
      </Animated.View>
    </>
  );
}

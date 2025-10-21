import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  useCanRecoverStreak,
  useRecoverStreak,
} from "@/hooks/data/useStreakRecovery";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

const { width } = Dimensions.get("window");

interface StreakRecoveryModalProps {
  visible: boolean;
  onClose: () => void;
}

export const StreakRecoveryModal: React.FC<StreakRecoveryModalProps> = ({
  visible,
  onClose,
}) => {
  const { canRecover, brokenStreak, availableOptions } = useCanRecoverStreak();
  const recoverMutation = useRecoverStreak();
  const toast = useToast();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleRecover = async () => {
    if (!selectedOption || !brokenStreak) return;

    try {
      const result = await recoverMutation.mutateAsync({
        recoveryOptionId: selectedOption,
        targetStreak: brokenStreak.streak_value,
      });

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="success">
            <ToastTitle>{result.message}</ToastTitle>
          </Toast>
        ),
      });

      onClose();
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>
              {error.message || "Failed to recover streak"}
            </ToastTitle>
          </Toast>
        ),
      });
    }
  };

  if (!canRecover || !brokenStreak) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.container}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.icon}>💔</Text>
            <Text style={styles.title}>Streak Broken</Text>
            <Text style={styles.subtitle}>
              Your {brokenStreak?.streak_value} day streak ended{" "}
              {brokenStreak?.days_ago} day
              {(brokenStreak?.days_ago || 0) > 1 ? "s" : ""} ago
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Recovery Options</Text>

            {availableOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedOption(option.id)}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.optionCardSelected,
                  !option.available && styles.optionCardDisabled,
                ]}
                disabled={!option.available}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.optionTitleRow}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.cost_type === "premium" && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>Premium</Text>
                      </View>
                    )}
                  </View>
                  {selectedOption === option.id && (
                    <View style={styles.checkmark}>
                      <Feather name="check" size={16} color="#fff" />
                    </View>
                  )}
                </View>

                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>

                {!option.available && (
                  <View style={styles.unavailableBadge}>
                    <Feather name="lock" size={14} color="#EF4444" />
                    <Text style={styles.unavailableText}>Not Available</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {availableOptions.length === 0 && (
              <View style={styles.noOptionsContainer}>
                <Text style={styles.noOptionsIcon}>🔒</Text>
                <Text style={styles.noOptionsText}>
                  No recovery options available
                </Text>
                <Text style={styles.noOptionsSubtext}>
                  Upgrade to Premium to unlock streak recovery
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={recoverMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recoverButton,
                (!selectedOption || recoverMutation.isPending) &&
                  styles.recoverButtonDisabled,
              ]}
              onPress={handleRecover}
              disabled={!selectedOption || recoverMutation.isPending}
            >
              <LinearGradient
                colors={["#7B61FF", "#9C7CFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.recoverButtonGradient}
              >
                {recoverMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="rotate-ccw" size={18} color="#fff" />
                    <Text style={styles.recoverButtonText}>Recover Streak</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    width: width - 40,
    maxWidth: 500,
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 32,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  optionCard: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: "#7B61FF",
    backgroundColor: "#F5F3FF",
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: "#FFD24A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7B61FF",
    justifyContent: "center",
    alignItems: "center",
  },
  optionDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  unavailableBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  unavailableText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 4,
  },
  noOptionsContainer: {
    padding: 32,
    alignItems: "center",
  },
  noOptionsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noOptionsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  noOptionsSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  recoverButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  recoverButtonDisabled: {
    opacity: 0.5,
  },
  recoverButtonGradient: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  recoverButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  BookOpen01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

interface JournalingOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  allPrompts: string[];
  currentPrompt: string;
}

export const JournalingOptionsModal: React.FC<JournalingOptionsModalProps> = ({
  visible,
  onClose,
  onSelectPrompt,
  allPrompts,
  currentPrompt,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  return (
    <ShortBottomModal ref={sheetRef} snapPoints={["75%"]} onDismiss={onClose}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <HugeiconsIcon icon={BookOpen01Icon} size={32} color="#7B61FF" />
            </View>
            <Text style={styles.title}>Journaling Options</Text>
          </View>

          {/* Free Write Option */}
          <View
            onTouchEnd={() => {
              onSelectPrompt("Free Write");
              onClose();
            }}
            style={styles.freeWriteCard}
          >
            <View style={styles.freeWriteIcon}>
              <HugeiconsIcon
                icon={PencilEdit02Icon}
                size={24}
                color="#7B61FF"
              />
            </View>
            <View style={styles.freeWriteText}>
              <Text style={styles.freeWriteTitle}>Free Write</Text>
              <Text style={styles.freeWriteSubtitle}>
                Write without a prompt
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Or select a Prompt</Text>

          {allPrompts.map((prompt, index) => {
            const isSelected = prompt === currentPrompt;
            return (
              <View
                key={index}
                onTouchEnd={() => {
                  onSelectPrompt(prompt);
                  onClose();
                }}
                style={[
                  styles.promptCard,
                  isSelected && styles.promptCardSelected,
                ]}
              >
                <Text
                  style={[
                    styles.promptText,
                    isSelected && styles.promptTextSelected,
                  ]}
                >
                  {prompt}
                </Text>
                {isSelected && (
                  <View style={styles.checkIconContainer}>
                    <HugeiconsIcon icon={Tick02Icon} size={18} color="white" />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ShortBottomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f6f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontFamily: "CormorantSemiBold",
    color: "#1f2937",
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  freeWriteCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F6F4FF",
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  freeWriteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  freeWriteText: {
    flex: 1,
  },
  freeWriteTitle: {
    fontSize: 20,
    fontFamily: "CormorantSemiBold",
    color: "#111827",
    lineHeight: 24,
  },
  freeWriteSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9CA3AF",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  promptCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  promptCardSelected: {
    backgroundColor: "#7B61FF",
    borderColor: "#7B61FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  promptText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
    color: "#374151",
  },
  promptTextSelected: {
    color: "white",
  },
  checkIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
});

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  BookOpen01Icon,
  Tick02Icon,
  Camera01Icon,
} from "@hugeicons/core-free-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

interface JournalingOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  allPrompts: string[];
  currentPrompt: string;
  onScanJournal?: () => void;
}

export const JournalingOptionsModal: React.FC<JournalingOptionsModalProps> = ({
  visible,
  onClose,
  onSelectPrompt,
  allPrompts,
  currentPrompt,
  onScanJournal,
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
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["75%"]}
      onDismiss={onClose}
      style={{
        marginHorizontal: 8,
        borderRadius: 24,
        overflow: "hidden",
      }}
      backgroundStyle={{ backgroundColor: "white" }}
      handleIndicatorStyle={{ backgroundColor: "#E5E7EB" }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: 20, paddingTop: 8 },
        ]}
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
            <HugeiconsIcon icon={PencilEdit02Icon} size={24} color="#7B61FF" />
          </View>
          <View style={styles.freeWriteText}>
            <Text style={styles.freeWriteTitle}>Free Write</Text>
            <Text style={styles.freeWriteSubtitle}>Write without a prompt</Text>
          </View>
        </View>

        {/* Scan Journal Option */}
        <View
          onTouchEnd={() => {
            onScanJournal?.();
            onClose();
          }}
          style={styles.scanCard}
        >
          <View style={styles.scanIcon}>
            <HugeiconsIcon icon={Camera01Icon} size={24} color="#7C3AED" />
          </View>
          <View style={styles.freeWriteText}>
            <Text style={styles.freeWriteTitle}>Scan Journal Page</Text>
            <Text style={styles.freeWriteSubtitle}>
              Capture handwritten entries
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
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
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
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3E8FF",
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  scanIcon: {
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
});

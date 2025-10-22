import React, { forwardRef, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import WeekyScreenAIWrapper from "@/src/screens/DailyNotesScreen/components/WeekyScreenAIWrapper";

interface AIInsightsModalBottomSheetProps {
  weekStart: string;
  weekEnd: string;
  onClose?: () => void;
}

/**
 * Presentational bottom sheet component for displaying AI weekly insights
 * Uses Gorhom BottomSheetModal to appear above bottom tabs
 */
export const AIInsightsModalBottomSheet = forwardRef<
  BottomSheetModal,
  AIInsightsModalBottomSheetProps
>(({ weekStart, weekEnd, onClose }, ref) => {
  const snapPoints = useMemo(() => ["90%"], []);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onDismiss={onClose}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>✨ AI Weekly Insights</Text>
          <Text style={styles.subtitle}>
            {weekStart} - {weekEnd}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <BottomSheetScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <WeekyScreenAIWrapper />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

AIInsightsModalBottomSheet.displayName = "AIInsightsModalBottomSheet";

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
    height: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    // Remove flex: 1 for BottomSheetScrollView
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    minHeight: 600,
  },
});

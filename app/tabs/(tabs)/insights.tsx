import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { useJournalData } from "@/hooks/useJournalData";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { ProgressCard } from "@/components/ui/ProgressCard";
import { AnimatedModal } from "@/components/ui/AnimatedModal";
import { JournalCalendar } from "@/components/ui/JournalCalendar";
import { ModalState } from "@/types/journal";
import Happy from "@/assets/Icons/Happy";
import { SafeAreaView } from "react-native-safe-area-context";

const InsightsScreen: React.FC = () => {
  const theme = useSeasonalTheme();
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    date: "",
    modalType: "add",
  });

  const { journalEntries, getMoodEmoji } = useJournalData(theme);
  const { animationValues, closeModal } = useModalAnimation({
    isVisible: modalState.open,
    onCloseComplete: () =>
      setModalState({ open: false, date: "", modalType: "add" }),
  });

  const accentColor = theme.particleSparkle;
  const secondaryColor = theme.particleDot;

  const handleDatePress = (date: string, hasEntry: boolean): void => {
    setModalState({
      open: true,
      date,
      modalType: hasEntry ? "view" : "add",
    });
  };

  return (
    <MindfulBackground enableParticles={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <VStack space="xl" style={styles.header}>
            <Heading size="2xl" style={styles.welcomeHeading}>
              Good Evening, Sam
            </Heading>

            {/* Progress Section */}
            <VStack space="lg" style={styles.progressSection}>
              <Text style={styles.sectionLabel}>Your Progress</Text>

              <HStack space="lg" style={styles.progressCards}>
                <ProgressCard
                  icon="🔥"
                  value="2 days"
                  label="Current streak"
                  accent={accentColor}
                />
                <ProgressCard
                  icon="🏆"
                  value="3 days"
                  label="Next milestone"
                  accent={secondaryColor}
                />
              </HStack>
            </VStack>

            {/* Calendar Section */}
            <VStack space="lg" style={styles.calendarSection}>
              <HStack style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Mindful Moments</Text>
                <Text style={styles.calendarSubtitle}>July 2025</Text>
              </HStack>
              <JournalCalendar
                journalEntries={journalEntries}
                getMoodEmoji={getMoodEmoji}
                onDatePress={handleDatePress}
              />
            </VStack>
          </VStack>
        </ScrollView>

        {/* Add Entry Modal */}
        <AnimatedModal
          visible={modalState.open}
          modalType={modalState.modalType}
          animationValues={animationValues}
          onClose={closeModal}
          onRequestClose={closeModal}
        />
      </SafeAreaView>
    </MindfulBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeHeading: {
    fontSize: 28,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  progressSection: {
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textAlign: "center",
    marginBottom: 4,
  },
  progressCards: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  calendarSection: {
    // paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  calendarHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: -0.3,
  },
  calendarSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B9DC3",
    letterSpacing: 0.3,
  },
});

export default InsightsScreen;

import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Modal, Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Calendar } from "react-native-calendars";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { BlurView } from "expo-blur";
import { Icon } from "@/components/ui/icon";
import { Ionicons } from "@expo/vector-icons";
import Happy from "@/assets/Icons/Happy";
import LightbulbPerson from "@/assets/Icons/LightbulbPerson";
import Sad from "@/assets/Icons/Sad";
import Laugh from "@/assets/Icons/Laugh";
import Lost from "@/assets/Icons/Lost";
import Angry from "@/assets/Icons/Angry";

interface ProgressCardProps {
  icon: string;
  value: string;
  label: string;
  accent: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  value,
  label,
  accent,
}) => {
  return (
    <Box
      style={[
        styles.progressCard,
        { backgroundColor: `${accent}10`, borderColor: `${accent}30` },
      ]}
    >
      <HStack space="sm" className="items-center">
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <VStack space="xs">
          <Text className="font-bold text-lg" style={{ color: accent }}>
            {value}
          </Text>
          <Text className="text-sm text-gray-600">{label}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const InsightsScreen: React.FC = () => {
  const theme = useSeasonalTheme();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isAddEntryModalOpen, setAddEntryModalOpen] = useState<boolean>(false);

  // Sample journal entry data with mood indicators
  const journalEntries = {
    "2025-07-21": {
      marked: true,
      customStyles: { text: { color: theme.particleSparkle } },
    },
    "2025-07-22": {
      marked: true,
      customStyles: { text: { color: theme.particleDot } },
    },
    "2025-07-23": {
      marked: true,
      customStyles: { text: { color: theme.particleSparkle } },
    },
  };

  // Mood emoji mapping
  const getMoodEmoji = (date: string): JSX.Element => {
    const moodMap: Record<string, JSX.Element> = {
      "2025-07-21": <Happy />,
      "2025-07-15": <Sad />,
      "2025-07-18": <Laugh />,
      "2025-07-22": <Lost />,
      "2025-07-04": <Angry />,
    };
    return moodMap[date];
  };

  const primaryColor = theme.gradient[0];
  const accentColor = theme.particleSparkle;
  const secondaryColor = theme.particleDot;

  return (
    <MindfulBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <VStack space="lg" style={styles.header}>
          <Heading size="2xl" className="font-bold text-center">
            Sam
          </Heading>

          {/* Progress Section */}
          <VStack space="md">
            <Text className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              PROGRESS
            </Text>
            <Happy />

            <HStack space="md" className="justify-between">
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
          <VStack space="md">
            <HStack className="justify-between items-center">
              <Heading size="lg" className="font-bold">
                Entries Calendar
              </Heading>
              <Text className="text-sm text-gray-500">July 2025</Text>
            </HStack>

            <Box
              style={[styles.calendarContainer, { backgroundColor: "white" }]}
            >
              <Calendar
                current="2025-07-23"
                hideExtraDays={false}
                firstDay={1} // Start with Monday
                onDayPress={(day) => setSelectedDate(day.dateString)}
                renderArrow={(direction) => (
                  <Text
                    style={{ color: "#666", fontSize: 20, fontWeight: "300" }}
                  >
                    {direction === "left" ? "‹" : "›"}
                  </Text>
                )}
                // customHeader={() => (
                //   <View>
                //     <Text> sdfjnk </Text>
                //   </View>
                // )}
                theme={{
                  backgroundColor: "white",
                  calendarBackground: "white",
                  textSectionTitleColor: "#999",
                  textSectionTitleDisabledColor: "#d9d9d9",
                  selectedDayBackgroundColor: "transparent",
                  selectedDayTextColor: "#000",
                  todayTextColor: "#000",
                  dayTextColor: "#000",
                  textDisabledColor: "#d9d9d9",
                  arrowColor: "#666",
                  disabledArrowColor: "#d9d9d9",
                  monthTextColor: "#000",
                  indicatorColor: "transparent",
                  textDayFontFamily: "System",
                  textMonthFontFamily: "System",
                  textDayHeaderFontFamily: "System",
                  textDayFontWeight: "400",
                  textMonthFontWeight: "600",
                  textDayHeaderFontWeight: "400",
                  textDayFontSize: 16,
                  textMonthFontSize: 20,
                  textDayHeaderFontSize: 12,
                }}
                dayComponent={({ date, state }) => {
                  const moodEmoji = getMoodEmoji(date?.dateString || "");

                  // const isToday = state === "today";
                  // const isDisabled = state === "disabled";

                  return (
                    <VStack style={styles.cleanDayContainer}>
                      <Box style={styles.dayCell}>
                        {!moodEmoji ? (
                          <Pressable
                            onPress={() => {
                              setSelectedDate(date?.dateString ?? "");
                              setAddEntryModalOpen(true);
                            }}
                            style={styles.plusButton}
                          >
                            <Text style={styles.plusText}>+</Text>
                          </Pressable>
                        ) : (
                         <Box>{moodEmoji}</Box>
                        )}
                        <Text style={styles.cleanDayText}>{date?.day}</Text>
                      </Box>
                    </VStack>
                  );
                }}
              />
            </Box>
          </VStack>
        </VStack>
      </ScrollView>

      {/* Add Entry Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isAddEntryModalOpen}
        onRequestClose={() => setAddEntryModalOpen(false)}
      >
        <BlurView intensity={60} style={styles.modalBlur} tint="light">
          <VStack space="lg" style={styles.modalContent}>
            <Heading size="lg" className="font-bold text-center">
              Add New Entry
            </Heading>
            <Pressable
              style={styles.addEntryButton}
              onPress={() => {
                // TODO: integrate navigation or further logic here
                setAddEntryModalOpen(false);
              }}
            >
              <Text className="text-white font-semibold">Add Entry</Text>
            </Pressable>
            <Pressable onPress={() => setAddEntryModalOpen(false)}>
              <Text className="text-gray-500 mt-4">Cancel</Text>
            </Pressable>
          </VStack>
        </BlurView>
      </Modal>
    </MindfulBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for tab bar
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#f8fafc",
  },

  calendarContainer: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 35px rgba(0,0,0,.1)",
    elevation: 0,
  },
  dayContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    textAlign: "center",
  },
  moodEmoji: {
    position: "absolute",
    bottom: 2,
    fontSize: 12,
  },
  cleanDayContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 50,
    height: 50,
    margin: 1,
  },
  dayCell: {
    // width: 80,
    // height: 80,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cleanDayText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 2,
  },
  cleanMoodEmoji: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 18,
  },
  emojiPlaceholder: {
    height: 18,
    width: 16,
  },
  plusButton: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 10,
    fontWeight: "400",
    color: "#666",
    textAlign: "center",
    lineHeight: 12,
  },
  modalBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 24,
    borderRadius: 24,
    width: "80%",
    alignItems: "center",
  },
  addEntryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  }
});

export default InsightsScreen;

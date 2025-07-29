import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { JournalEntries } from "@/types/journal";
import { MoodTrendVisualization } from "./MoodTrendVisualization";

interface JournalCalendarProps {
  journalEntries: JournalEntries;
  getMoodEmoji: (date: string) => JSX.Element | undefined;
  onDatePress: (date: string, hasEntry: boolean) => void;
}

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  journalEntries,
  getMoodEmoji,
  onDatePress,
}) => {
  return (
    <Box style={styles.calendarWrapper}>
      <LinearGradient
        colors={["#FDFDFD", "#F8F9FA", "#F3F4F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.calendarContainer}
      >
        {/* Mood Trend Visualization Overlay */}
        <MoodTrendVisualization
          journalEntries={journalEntries}
          getMoodEmoji={getMoodEmoji}
          calendarWidth={320}
          calendarHeight={300}
        />
        <Calendar
          current="2025-07-23"
          hideExtraDays={false}
          firstDay={1} // Start with Monday
          renderArrow={(direction) => (
            <Text style={{ color: "#8B9DC3", fontSize: 20, fontWeight: "300" }}>
              {direction === "left" ? "‹" : "›"}
            </Text>
          )}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#8B9DC3",
            textSectionTitleDisabledColor: "#D1D5DB",
            selectedDayBackgroundColor: "transparent",
            selectedDayTextColor: "#6B7280",
            todayTextColor: "#059669",
            dayTextColor: "#6B7280",
            textDisabledColor: "#E5E7EB",
            arrowColor: "#8B9DC3",
            disabledArrowColor: "#D1D5DB",
            monthTextColor: "#374151",
            indicatorColor: "transparent",
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "500",
            textMonthFontWeight: "600",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 15,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
          dayComponent={({ date, state }) => {
            const moodEmoji = getMoodEmoji(date?.dateString || "");
            const hasEntry = Boolean(moodEmoji);

            return (
              <VStack style={styles.cleanDayContainer}>
                <Pressable
                  onPress={() => {
                    if (date?.dateString) {
                      onDatePress(date.dateString, hasEntry);
                    }
                  }}
                  style={[styles.dayCell, hasEntry && styles.dayWithEntry]}
                >
                  <VStack space="xs" style={styles.dayContent}>
                    {moodEmoji ? (
                      <VStack style={styles.entryDay}>
                        <Box style={styles.moodContainer}>{moodEmoji}</Box>
                        <Text style={styles.dayTextWithEntry}>{date?.day}</Text>
                      </VStack>
                    ) : (
                      <VStack style={styles.emptyDay}>
                        <Text style={styles.dayText}>{date?.day}</Text>
                        <Box style={styles.addIndicator}>
                          <Text style={styles.addText}>+</Text>
                        </Box>
                      </VStack>
                    )}
                  </VStack>
                </Pressable>
              </VStack>
            );
          }}
        />
      </LinearGradient>
    </Box>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    // Soft, therapeutic shadow
    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  calendarContainer: {
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  cleanDayContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    height: 68,
    margin: 2,
  },
  dayCell: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    // Better touch target for mobile
    minHeight: 48,
    minWidth: 48,
  },
  dayWithEntry: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 2,
    borderColor: "rgba(5, 150, 105, 0.4)",
    // Bolder therapeutic shadow
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  dayContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  entryDay: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyDay: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  moodContainer: {
    marginBottom: 6,
    // Larger for better visibility and bolder appearance
    transform: [{ scale: 1.3 }],
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  dayTextWithEntry: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 15,
  },
  addIndicator: {
    marginTop: 4,
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: "rgba(5, 150, 105, 0.12)",
    borderWidth: 1.5,
    borderColor: "rgba(5, 150, 105, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    textAlign: "center",
    opacity: 0.8,
  },
});

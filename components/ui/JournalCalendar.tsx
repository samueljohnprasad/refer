import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { JournalEntries } from "@/types/journal";
import { MoodTrendVisualization } from "./MoodTrendVisualization";
import { BlurView } from "expo-blur";
import { Text } from "../Themed";

const { width: screenWidth } = Dimensions.get("window");

interface JournalCalendarProps {
  journalEntries: JournalEntries;
  getMoodEmoji: (date: string) => JSX.Element | undefined;
  onDatePress: (date: string, hasEntry: boolean) => void;
}

// Ultra-clean minimalist day component
const MinimalistDayComponent: React.FC<{
  date: any;
  state?: string;
  moodEmoji: JSX.Element | undefined;
  hasEntry: boolean;
  onPress: (dateString: string, hasEntry: boolean) => void;
}> = ({ date, state, moodEmoji, hasEntry, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const isToday = date?.dateString === new Date().toISOString().split("T")[0];
  const isDisabled = state === "disabled";

  return (
    <Animated.View
      style={[
        styles.dayContainer,
        {
          opacity: isDisabled ? 0.3 : opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => {
          if (date?.dateString && !isDisabled) {
            onPress(date.dateString, hasEntry);
          }
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.dayCell, isToday && styles.todayCell]}
        disabled={isDisabled}
      >
        <VStack style={styles.dayContent}>
          {/* Emoji positioned above number */}
          {hasEntry && <Box style={styles.emojiContainer}>{moodEmoji}</Box>}

          {/* Elegant empty state indicator */}
          {!hasEntry && !isDisabled && (
            <Text
              style={[
                styles.emptyIndicator,
                isToday && styles.todayEmptyIndicator,
              ]}
            >
              +
            </Text>
          )}

          {/* Date number - hero element */}
          <Text
            style={[
              styles.dateNumber,
              isToday && styles.todayDateNumber,
              isDisabled && styles.disabledDateNumber,
            ]}
          >
            {date?.day}
          </Text>
        </VStack>
      </Pressable>
    </Animated.View>
  );
};

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  journalEntries,
  getMoodEmoji,
  onDatePress,
}) => {
  const [calendarOpacity] = useState(new Animated.Value(0));
  const [headerOpacity] = useState(new Animated.Value(0));
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    // Gentle fade-in animation
    Animated.stagger(300, [
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(calendarOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.calendarWrapper, { opacity: calendarOpacity }]}
    >
      {/* Glassmorphism container */}
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.95)",
          "rgba(248, 250, 252, 0.90)",
          "rgba(241, 245, 249, 0.85)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.calendarContainer}
      >
        {Platform.OS === "ios" && (
          <BlurView
            style={StyleSheet.absoluteFillObject}
            tint="light"
            intensity={20}
          />
        )}

        {/* Ambient light overlay */}
        <LinearGradient
          colors={[
            "rgba(168, 85, 247, 0.08)",
            "rgba(59, 130, 246, 0.05)",
            "rgba(16, 185, 129, 0.08)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 32 }]}
        />

        {/* Enhanced mood visualization */}
        <MoodTrendVisualization
          journalEntries={journalEntries}
          getMoodEmoji={getMoodEmoji}
          calendarWidth={screenWidth - 32}
          calendarHeight={320}
        />

        <Animated.View style={{ opacity: headerOpacity }}>
          <Calendar
            current={selectedMonth}
            hideExtraDays={false}
            firstDay={1}
            enableSwipeMonths={true}
            renderArrow={(direction) => (
              <Animated.View style={styles.arrowContainer}>
                <Text style={styles.arrowText}>
                  {direction === "left" ? "‹" : "›"}
                </Text>
              </Animated.View>
            )}
            theme={{
              backgroundColor: "transparent",
              todayBackgroundColor: "transparent",
              calendarBackground: "transparent",
              textSectionTitleColor: "#64748B",
              textSectionTitleDisabledColor: "#CBD5E1",
              selectedDayBackgroundColor: "transparent",
              selectedDayTextColor: "#475569",
              todayTextColor: "#059669",
              dayTextColor: "#64748B",
              textDisabledColor: "#E2E8F0",
              arrowColor: "#64748B",
              disabledArrowColor: "#CBD5E1",
              monthTextColor: "#1E293B",
              indicatorColor: "transparent",
              textDayFontFamily:
                Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
              textMonthFontFamily:
                Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
              textDayHeaderFontFamily:
                Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
              textDayFontWeight: "500",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 15,
              textMonthFontSize: 20,
              textDayHeaderFontSize: 13,
            }}
            dayComponent={({ date, state }) => {
              const moodEmoji = getMoodEmoji(date?.dateString || "");
              const hasEntry = Boolean(moodEmoji);

              return (
                <MinimalistDayComponent
                  date={date}
                  state={state}
                  moodEmoji={moodEmoji}
                  hasEntry={hasEntry}
                  onPress={onDatePress}
                />
              );
            }}
            onMonthChange={(month) => {
              if (month?.dateString) {
                setSelectedMonth(month.dateString);
              }
            }}
          />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Ultra-clean calendar wrapper with minimal shadow
  calendarWrapper: {
    shadowColor:
      Platform.OS === "ios" ? "rgba(0, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 24,
  },

  // Pure white container with subtle border
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.06)",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  // Minimal day container - mathematical precision
  dayContainer: {
    width: Math.floor((screenWidth - 80) / 7), // Perfect grid
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  // Clean day cell - no background, no borders
  dayCell: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  // Subtle today highlight
  todayCell: {
    backgroundColor: "rgba(16, 185, 129, 0.04)",
  },

  // Clean content structure
  dayContent: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    gap: 2,
  },

  // Minimal emoji container
  emojiContainer: {
    marginBottom: 2,
  },

  // Hero element - the date number
  dateNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
    letterSpacing: -0.2,
    lineHeight: 20,
  },

  // Today's date number with gentle emphasis
  todayDateNumber: {
    color: "#059669",
    fontWeight: "700",
  },

  // Disabled date number
  disabledDateNumber: {
    color: "#D1D5DB",
    opacity: 0.7,
  },

  // Elegant empty state indicator
  emptyIndicator: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
    opacity: 0.6,
    marginTop: 1,
    letterSpacing: 1,
  },

  // Today's empty indicator
  todayEmptyIndicator: {
    color: "#000",
    opacity: 0.8,
  },

  // Enhanced navigation arrows with clean design
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.04)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },

  arrowText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
});

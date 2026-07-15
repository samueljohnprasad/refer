import React from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";
import { SAGE } from "@/lib/tokens";

interface TimelineSectionHeaderProps {
  readonly date: number;
  readonly title?: string;
  readonly mode?: "days" | "weeks" | "months";
}

export const TimelineSectionHeader: React.FC<TimelineSectionHeaderProps> = React.memo(({ date, title, mode = "days" }) => {
    if (mode === "months" || mode === "weeks") {
      // For weeks or months, render the provided title if available, otherwise fallback to standard text
      // E.g., for Months: "July 2026". We might want to stack month and year similar to how "1 WED" is rendered.
      if (mode === "months") {
        const monthStr = dayjs(date).format("MMM").toUpperCase();
        const yearStr = dayjs(date).format("YYYY");
        return (
          <View className="items-center">
            <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 13 }}>{monthStr}</Text>
            <Text style={{ fontFamily: "Nunito-SemiBold", color: SAGE[500], fontSize: 10, letterSpacing: 1.2 }}>{yearStr}</Text>
          </View>
        );
      }
      
      // For weeks, display the date range and year cleanly
      if (mode === "weeks" && title) {
        // title is like "JUL 6-12, 2026" or "JUN 29 - JUL 5, 2026"
        const parts = title.split(", ");
        const dateRange = parts[0] || "";
        const yearStr = parts[1] || "";
        
        if (dateRange.includes(" - ")) {
          // Cross-month: "JUN 29 - JUL 5"
          const [start, end] = dateRange.split(" - ");
          return (
            <View className="items-center">
              <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 10, textAlign: 'center' }}>{start}</Text>
              <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 10, textAlign: 'center' }}>{end}</Text>
              <Text style={{ fontFamily: "Nunito-SemiBold", color: SAGE[500], fontSize: 9, letterSpacing: 1.2, marginTop: 2 }}>{yearStr}</Text>
            </View>
          );
        } else {
          // Same-month: "JUN 22-28"
          const spaceIdx = dateRange.indexOf(" ");
          const month = dateRange.substring(0, spaceIdx);
          const days = dateRange.substring(spaceIdx + 1);
          return (
            <View className="items-center">
              <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 11, textAlign: 'center' }}>{month}</Text>
              <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 11, textAlign: 'center' }}>{days}</Text>
              <Text style={{ fontFamily: "Nunito-SemiBold", color: SAGE[500], fontSize: 9, letterSpacing: 1.2, marginTop: 2 }}>{yearStr}</Text>
            </View>
          );
        }
      }
    }

    // Default "days" mode rendering
    const isToday = dayjs(date).isSame(dayjs(), "day");
    const isYesterday = dayjs(date).isSame(dayjs().subtract(1, "day"), "day");

    let prefix = null;
    if (isToday) prefix = <Text style={{ fontFamily: "Nunito-ExtraBold", color: "#1A1A1A", fontSize: 11, letterSpacing: 1.5 }}>TODAY</Text>;
    else if (isYesterday) prefix = <Text style={{ fontFamily: "Nunito-ExtraBold", color: "#1A1A1A", fontSize: 11, letterSpacing: 1.5 }}>YEST.</Text>;
    else {
      const dayNum = dayjs(date).format("D");
      const monthStr = dayjs(date).format("MMM").toUpperCase();
      const yearStr = dayjs(date).format("YYYY");
      prefix = (
        <View className="items-center">
          <Text style={{ fontFamily: "Nunito-Bold", color: "#1A1A1A", fontSize: 11 }}>{monthStr} {dayNum}</Text>
          <Text style={{ fontFamily: "Nunito-SemiBold", color: SAGE[500], fontSize: 10, letterSpacing: 1.2, marginTop: 2 }}>{yearStr}</Text>
        </View>
      );
    }

    return (
      <View className="items-center px-1">
        {prefix}
      </View>
    );
});

TimelineSectionHeader.displayName = "TimelineSectionHeader";

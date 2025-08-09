import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { JournalEntries } from "@/types/journal";

interface MoodTrendVisualizationProps {
  journalEntries: JournalEntries;
  getMoodEmoji: (date: string) => JSX.Element | undefined;
  calendarWidth: number;
  calendarHeight: number;
}

interface MoodPoint {
  x: number;
  y: number;
  mood: string;
  date: string;
  moodValue: number;
}

const MOOD_VALUES = {
  "😊": 5, // Very Happy
  "😐": 4, // Neutral/OK
  "🤔": 3, // Thinking/Contemplative
  "😟": 2, // Worried/Concerned
  "😢": 1, // Sad
};

// Helper function to extract emoji text from JSX element
const extractEmojiFromJSX = (
  element: JSX.Element | undefined
): string | null => {
  if (!element) return null;

  // Simple approach: check if it's a Text element with emoji content
  try {
    // Access props if it's a React element
    if (element && typeof element === "object" && "props" in element) {
      const props = element.props as any;
      if (props.children && typeof props.children === "string") {
        const emoji = props.children;
        if (MOOD_VALUES[emoji as keyof typeof MOOD_VALUES]) {
          return emoji;
        }
      }
    }
  } catch (error) {
    // Fallback: extract emoji from string representation
    const elementString = String(element);
    const emojiMatch = elementString.match(/[😊😐🤔😟😢]/g);
    return emojiMatch ? emojiMatch[0] : null;
  }

  return null;
};

const MoodTrendVisualization: React.FC<MoodTrendVisualizationProps> = ({
  journalEntries,
  getMoodEmoji,
  calendarWidth,
  calendarHeight,
}) => {
  const getMoodValue = (mood: string): number => {
    return MOOD_VALUES[mood as keyof typeof MOOD_VALUES] || 3;
  };

  const generateMoodPoints = (): MoodPoint[] => {
    const points: MoodPoint[] = [];
    const dayWidth = calendarWidth / 7; // 7 days per week
    const dayHeight = calendarHeight / 6; // Approximately 6 weeks visible

    // Convert journal entries to mood points with positions
    Object.entries(journalEntries).forEach(([date, entry]) => {
      const moodEmoji = getMoodEmoji(date);
      if (moodEmoji) {
        // Extract emoji from JSX element
        const moodText = extractEmojiFromJSX(moodEmoji);
        if (moodText) {
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const weekOfMonth = Math.floor(dateObj.getDate() / 7);

          const x =
            (dayOfWeek === 0 ? 6 : dayOfWeek - 1) * dayWidth + dayWidth / 2; // Monday = 0
          const y = weekOfMonth * dayHeight + dayHeight / 2;
          const moodValue = getMoodValue(moodText);

          points.push({
            x,
            y: y + (3 - moodValue) * 8, // Adjust y based on mood (higher = happier)
            mood: moodText,
            date,
            moodValue,
          });
        }
      }
    });

    // Sort points by date for proper line connection
    return points.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const createSmoothPath = (points: MoodPoint[]): string => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      // Calculate control points for smooth curves
      const cp1x = prev.x + (curr.x - prev.x) * 0.3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) * 0.3;
      const cp2y = curr.y;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return path;
  };

  const getOverallMoodGradient = (
    points: MoodPoint[]
  ): { start: string; end: string } => {
    if (points.length === 0) {
      return {
        start: "rgba(156, 163, 175, 0.1)",
        end: "rgba(156, 163, 175, 0.05)",
      };
    }

    const avgMood =
      points.reduce((sum, point) => sum + point.moodValue, 0) / points.length;

    if (avgMood >= 4.5) {
      return {
        start: "rgba(34, 197, 94, 0.15)",
        end: "rgba(34, 197, 94, 0.05)",
      }; // Green - Very positive
    } else if (avgMood >= 3.5) {
      return {
        start: "rgba(59, 130, 246, 0.12)",
        end: "rgba(59, 130, 246, 0.04)",
      }; // Blue - Positive
    } else if (avgMood >= 2.5) {
      return {
        start: "rgba(245, 158, 11, 0.12)",
        end: "rgba(245, 158, 11, 0.04)",
      }; // Yellow - Neutral
    } else {
      return {
        start: "rgba(239, 68, 68, 0.10)",
        end: "rgba(239, 68, 68, 0.03)",
      }; // Red - Needs attention
    }
  };

  const moodPoints = generateMoodPoints();
  const smoothPath = createSmoothPath(moodPoints);
  const gradientColors = getOverallMoodGradient(moodPoints);

  if (moodPoints.length < 2) {
    return null; // Don't render if insufficient data
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={calendarWidth} height={calendarHeight} style={styles.svg}>
        <Defs>
          <LinearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
          <LinearGradient id="trendLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="rgba(5, 150, 105, 0.6)" />
            <Stop offset="50%" stopColor="rgba(34, 197, 94, 0.4)" />
            <Stop offset="100%" stopColor="rgba(5, 150, 105, 0.6)" />
          </LinearGradient>
        </Defs>

        {/* Background mood gradient */}
        <Path
          d={`${smoothPath} L ${calendarWidth} ${calendarHeight} L 0 ${calendarHeight} Z`}
          fill="url(#moodGradient)"
        />

        {/* Mood trend line */}
        <Path
          d={smoothPath}
          stroke="url(#trendLine)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Subtle dots at mood points */}
        {moodPoints.map((point, index) => (
          <React.Fragment key={`${point.date}-${index}`}>
            {/* Glow effect */}
            <Circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="rgba(5, 150, 105, 0.1)"
            />
            {/* Main dot */}
            <Circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="rgba(5, 150, 105, 0.7)"
            />
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export { MoodTrendVisualization };

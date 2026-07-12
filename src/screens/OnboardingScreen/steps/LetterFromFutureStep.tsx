import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes, StressTiming } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mail01Icon } from "@hugeicons/core-free-icons";

interface LetterFromFutureStepProps {
  dailyGoal: DailyGoalMinutes;
  timing?: StressTiming;
}

const TIMING_MOMENTS: Record<StressTiming, string> = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "late night",
};

const LetterFromFutureStep: React.FC<LetterFromFutureStepProps> = ({
  timing,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const futureLetterMeta = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const calendarDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const moment = timing ? TIMING_MOMENTS[timing] : "evening";

    return {
      dateLabel: `${calendarDate} · ${weekday} ${moment}`,
      weekdayLower: weekday.toLowerCase(),
      moment,
    };
  }, [timing]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 220,
        paddingHorizontal: 24,
        paddingTop: Math.max(16, headerHeight - insets.top + 8),
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1"
    >
      <Animated.View
        entering={FadeIn.duration(180).delay(80)}
        className="items-center"
      >
        <View
          style={{
            alignSelf: "center",
            borderRadius: 999,
            borderCurve: "continuous",
            backgroundColor: "#F2F6EF",
            borderColor: "#D8E5D4",
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <HugeiconsIcon icon={Mail01Icon} size={14} color="#4A6A45" />
          <Text
            style={{
              fontFamily: "GeistSemiBold",
              color: "#375234",
              fontSize: 12,
              letterSpacing: 0.3,
            }}
          >
            Something arrived for you
          </Text>
        </View>

        <Text
          style={{
            marginTop: 16,
            fontFamily: "CormorantRegular",
            fontSize: 30,
            lineHeight: 35,
            textAlign: "center",
            color: "#142414",
          }}
        >
          A letter from{" "}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
            }}
          >
            you,
          </Text>
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: "GeistRegular",
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: "#4F604F",
          }}
        >
          written 30 days from now.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        style={{
          marginTop: 20,
          overflow: "hidden",
          borderRadius: 24,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "#D3E0CD",
          boxShadow:
            "0 8px 24px rgba(42, 63, 42, 0.08), 0 2px 6px rgba(42, 63, 42, 0.04)",
        }}
      >
        <LinearGradient
          colors={["#FFFFFF", "#F8FBF6"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 }}
        >
          <LinearGradient
            colors={["transparent", "#E5EDE1", "#D3E0CD", "#E5EDE1", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 3,
              opacity: 0.6,
            }}
          />

          <Animated.View
            entering={FadeIn.duration(180).delay(260)}
            style={{
              position: "absolute",
              right: 18,
              top: 18,
              transform: [{ rotate: "-8deg" }],
              width: 54,
              height: 54,
              borderRadius: 999,
              borderCurve: "continuous",
              overflow: "hidden",
              boxShadow:
                "inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.2), 0 2px 4px rgba(200,105,75,0.3)",
            }}
          >
            <LinearGradient
              colors={["#E8A88E", "#C8694B"]}
              start={{ x: 0.2, y: 0.2 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "CormorantBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                  fontStyle: "italic",
                }}
              >
                S
              </Text>
            </LinearGradient>
          </Animated.View>

          <Text
            style={{
              fontFamily: "GeistMedium",
              paddingRight: 64,
              color: "#6C7D6A",
              fontSize: 11.5,
              fontWeight: "600",
              letterSpacing: 0.4,
            }}
          >
            {futureLetterMeta.dateLabel}
          </Text>

          <Text
            style={{
              marginTop: 12,
              fontFamily: "CormorantRegular",
              fontSize: 20,
              lineHeight: 25,
              color: "#142414",
            }}
          >
            Hey, friend —
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              I&apos;m writing from a {futureLetterMeta.weekdayLower}{" "}
              {futureLetterMeta.moment}. I closed Happy{" "}
              <Text
                style={{
                  color: "#3A5636",
                  fontFamily: "CormorantSemiBold",
                }}
              >
                five minutes ago.
              </Text>{" "}
              Just like you will, in a moment.
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              I won&apos;t lie to you. The noise didn&apos;t stop. Some mornings
              the thoughts still race. Some evenings the weight is still there.
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              But yesterday, when the spiral started — I caught it. I named it.
              I sat with it for thirty seconds.{" "}
              <Text
                style={{
                  color: "#3A5636",
                  fontFamily: "CormorantSemiBold",
                }}
              >
                And it didn&apos;t get bigger.
              </Text>
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              Thirty days ago, that wasn&apos;t possible.
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              You showed up today. Five minutes. Just like you said you would,
              in that pact you signed.
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontFamily: "CormorantRegular",
                fontSize: 16,
                lineHeight: 24,
                color: "#243324",
              }}
            >
              Keep going.{" "}
              <Text
                style={{
                  color: "#3A5636",
                  fontFamily: "CormorantSemiBold",
                }}
              >
                We&apos;re not the same person anymore.
              </Text>
            </Text>
          </View>

          <LinearGradient
            colors={["transparent", "#D3E0CD", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ marginTop: 14, height: 1 }}
          />

          <View style={{ marginTop: 10, alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "CormorantRegularItalic",
                fontSize: 19,
                lineHeight: 23,
                color: "#C8694B",
              }}
            >
              — You, in 30 days.
            </Text>
            <Text
              style={{
                marginTop: 3,
                fontFamily: "GeistMedium",
                fontSize: 11.5,
                lineHeight: 16,
                color: "#6C7D6A",
                letterSpacing: 0.3,
              }}
            >
              P.S. Still anxious sometimes. Just less afraid of it.
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(260)}
        style={{
          marginTop: 16,
          marginBottom: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#E3ECE0",
          backgroundColor: "#FAFCF9",
          paddingHorizontal: 14,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <MochiMascot expression="notes" size={54} animate={false} />
        <Text
          style={{
            flex: 1,
            fontFamily: "GeistMedium",
            fontSize: 13.5,
            lineHeight: 19,
            color: "#3A4B3A",
          }}
        >
          Hold onto this. Some days you&apos;ll need to remember who you&apos;re
          becoming.
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(LetterFromFutureStep);

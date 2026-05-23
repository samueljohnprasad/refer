import React, { useMemo } from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes, StressTiming } from "../types";

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
        paddingTop: 8,
        paddingBottom: 156,
        paddingHorizontal: 24,
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
            alignSelf: "stretch",
            borderRadius: 999,
            borderCurve: "continuous",
            backgroundColor: "#D4A943",
            paddingHorizontal: 18,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "GeistBold",
              color: "#29452A",
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.8,
              textTransform: "uppercase",
            }}
          >
            📨 Something arrived for you
          </Text>
        </View>

        <Text
          style={{
            marginTop: 18,
            fontFamily: "FrauncesRegular",
            fontSize: 28,
            lineHeight: 33,
            textAlign: "center",
            color: "#142414",
          }}
        >
          A letter from{" "}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
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
            fontSize: 15,
            lineHeight: 21,
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
          marginTop: 18,
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
          style={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 20 }}
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
              width: 58,
              height: 58,
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
                  fontFamily: "FrauncesBold",
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
              paddingRight: 60,
              color: "#7D8D7B",
              fontSize: 11,
              fontWeight: "500",
              letterSpacing: 0.5,
            }}
          >
            {futureLetterMeta.dateLabel}
          </Text>

          <Text
            style={{
              marginTop: 14,
              fontFamily: "FrauncesRegular",
              fontSize: 18,
              lineHeight: 22,
              color: "#142414",
            }}
          >
            Hey, friend —
          </Text>

          <View style={{ marginTop: 14 }}>
            <Text
              style={{
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              I&apos;m writing from a {futureLetterMeta.weekdayLower}{" "}
              {futureLetterMeta.moment}. I closed Happy{" "}
              <Text
                style={{
                  color: "#44633F",
                  fontFamily: "FrauncesSemiBold",
                }}
              >
                five minutes ago.
              </Text>{" "}
              Just like you will, in a moment.
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              I won&apos;t lie to you. The noise didn&apos;t stop. Some mornings
              the thoughts still race. Some evenings the weight is still there.
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              But yesterday, when the spiral started — I caught it. I named it.
              I sat with it for thirty seconds.{" "}
              <Text
                style={{
                  color: "#44633F",
                  fontFamily: "FrauncesSemiBold",
                }}
              >
                And it didn&apos;t get bigger.
              </Text>
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              Thirty days ago, that wasn&apos;t possible.
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              You showed up today. Five minutes. Just like you said you would,
              in that pact you signed.
            </Text>
            <Text
              style={{
                marginTop: 12,
                fontFamily: "FrauncesRegular",
                fontSize: 14,
                lineHeight: 23,
                color: "#4F604F",
              }}
            >
              Keep going.{" "}
              <Text
                style={{
                  color: "#44633F",
                  fontFamily: "FrauncesSemiBold",
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
            style={{ marginTop: 16, height: 1 }}
          />

          <View style={{ marginTop: 12, alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "FrauncesRegularItalic",
                fontSize: 18,
                lineHeight: 22,
                color: "#C8694B",
              }}
            >
              — You, in 30 days.
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontFamily: "GeistRegular",
                fontSize: 11,
                lineHeight: 15,
                color: "#7D8D7B",
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
          marginTop: 6,
          marginBottom: 4,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <MochiMascot expression="notes" size={60} animate={false} />
        <Text
          style={{
            flex: 1,
            fontFamily: "FrauncesMediumItalic",
            fontSize: 13,
            lineHeight: 18,
            color: "#4F604F",
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

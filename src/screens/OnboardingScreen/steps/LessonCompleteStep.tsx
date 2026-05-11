import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import MochiMascot from "../components/MochiMascot";

const LessonCompleteStep: React.FC = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 140, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-8"
    >
      <View className="items-center">
        <MochiMascot expression="celebrating" size={160} delay={40} />

        <Animated.View
          entering={FadeIn.duration(180).delay(120)}
          style={{
            marginTop: 18,
            borderRadius: 999,
            borderCurve: "continuous",
            backgroundColor: "#D4A943",
            paddingHorizontal: 16,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{ fontFamily: "GeistBold" }}
            className="text-[11px] uppercase tracking-[0.15em] text-sage-700"
          >
            First Lesson Complete
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(180)}
          className="mt-5 items-center"
        >
          <Text
            style={{ fontFamily: "FrauncesRegular" }}
            className="text-center text-[28px] leading-[1.08] text-ink"
          >
            You did it.{" "}
            <Text
              style={{
                fontFamily: "FrauncesRegularItalic",
                color: "#5A7A56",
              }}
            >
              Truly.
            </Text>
          </Text>
          <Text
            style={{ fontFamily: "GeistRegular" }}
            className="mt-3 text-center text-[15px] leading-[1.55] text-ink-soft"
          >
            <Text
              style={{
                fontFamily: "FrauncesRegularItalic",
                color: "#5A7A56",
              }}
            >
              You showed up. That&apos;s the whole thing.
            </Text>{" "}
            Five minutes, just like you said.
          </Text>
        </Animated.View>

        <View className="mt-8 w-full flex-row gap-3">
          <Animated.View
            entering={FadeIn.duration(180).delay(260)}
            className="flex-1 items-center rounded-[14px] border-2 border-sage-100 bg-warm-white px-2 py-4"
          >
            <Text
              style={{ fontFamily: "FrauncesSemiBold" }}
              className="text-[22px] text-sage-600"
            >
              +20
            </Text>
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted"
            >
              XP Earned
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(180).delay(320)} className="flex-1">
            <LinearGradient
              colors={["#E8A88E", "#C8694B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                alignItems: "center",
                borderRadius: 14,
                borderCurve: "continuous",
                paddingHorizontal: 8,
                paddingVertical: 14,
              }}
            >
              <Text
                style={{ fontFamily: "FrauncesSemiBold" }}
                className="text-[22px] text-white"
              >
                🔥 1
              </Text>
              <Text
                style={{ fontFamily: "GeistSemiBold" }}
                className="mt-1 text-[10px] uppercase tracking-[0.05em] text-white/90"
              >
                Day Streak
              </Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(380)}
            className="flex-1 items-center rounded-[14px] border-2 border-sage-100 bg-warm-white px-2 py-4"
          >
            <Text
              style={{ fontFamily: "FrauncesSemiBold" }}
              className="text-[22px] text-sage-600"
            >
              7%
            </Text>
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted"
            >
              Toolkit
            </Text>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(LessonCompleteStep);

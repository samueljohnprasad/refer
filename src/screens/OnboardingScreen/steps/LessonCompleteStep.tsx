import React from "react";
import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import Animated, { FadeIn } from "react-native-reanimated";
import { SAGE, TERRACOTTA } from "@/lib/tokens";
import MochiMascot from "../components/MochiMascot";

const LessonCompleteStep: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 160,
        paddingTop: headerHeight - insets.top + 32,
        flexGrow: 1,
        justifyContent: "center",
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="items-center gap-10 py-2">
        {/* 1. Hero Mascot & Milestone Badge */}
        <View className="items-center">
          <MochiMascot expression="celebrating" size={168} delay={40} />

          <Animated.View
            entering={FadeIn.duration(180).delay(120)}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="First lesson complete"
            style={{
              marginTop: 18,
              borderRadius: 999,
              borderCurve: "continuous",
              backgroundColor: "#FFF7DB",
              borderColor: "#EAD178",
              borderWidth: 1,
              paddingHorizontal: 16,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[11px] uppercase tracking-[0.14em] text-[#7A6114]"
            >
              First Lesson Complete
            </Text>
          </Animated.View>
        </View>

        {/* 2. Affirmation Narrative */}
        <Animated.View
          entering={FadeIn.duration(180).delay(180)}
          className="items-center px-2"
        >
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-center text-[34px] leading-[1.05] tracking-[-0.01em] text-ink"
          >
            You did it.{" "}
            <Text
              style={{
                fontFamily: "CormorantRegularItalic",
                color: SAGE[500],
              }}
            >
              Truly.
            </Text>
          </Text>

          <Text
            style={{ fontFamily: "GeistRegular" }}
            className="mt-3 text-center text-[16px] leading-[24px] text-ink-soft"
          >
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="text-sage-700"
            >
              You learned a skill and used it right away.
            </Text>{" "}
            You can return to it whenever feelings are hard to name.
          </Text>
        </Animated.View>

        {/* 3. Balanced Stat Shelf */}
        <View className="w-full flex-row gap-3 pt-6">
          <Animated.View
            entering={FadeIn.duration(180).delay(260)}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel="1 of 14 lessons complete"
            style={{ borderCurve: "continuous" }}
            className="flex-1 items-center justify-center rounded-[18px] border-2 border-sage-100 bg-warm-white px-2 py-4 shadow-sm"
          >
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[22px] tracking-tight text-sage-600"
            >
              1 / 14
            </Text>
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="mt-1 text-center text-[11px] uppercase tracking-[0.07em] text-ink-muted"
            >
              Lessons
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(320)}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel="20 XP earned"
            style={{ borderCurve: "continuous" }}
            className="flex-1 items-center justify-center rounded-[18px] border-2 border-terracotta/25 bg-warm-white px-2 py-4 shadow-sm"
          >
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[22px] tracking-tight text-terracotta"
            >
              +20
            </Text>
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="mt-1 text-center text-[11px] uppercase tracking-[0.07em] text-ink-muted"
            >
              XP Earned
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(180).delay(380)}
            accessible={true}
            accessibilityRole="summary"
            accessibilityLabel="Day 1 complete"
            style={{ borderCurve: "continuous" }}
            className="flex-1 items-center justify-center rounded-[18px] border-2 border-sage-100 bg-warm-white px-2 py-4 shadow-sm"
          >
            <Text
              style={{ fontFamily: "GeistBold" }}
              className="text-[22px] tracking-tight text-sage-600"
            >
              Day 1
            </Text>
            <Text
              style={{ fontFamily: "GeistSemiBold" }}
              className="mt-1 text-center text-[11px] uppercase tracking-[0.07em] text-ink-muted"
            >
              Complete
            </Text>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(LessonCompleteStep);

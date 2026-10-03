import React from "react";
import { View, Pressable, Platform } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import MoodBadge from "@/src/components/MoodBadge";
import TodayPill from "@/src/components/TodayPill";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Bookmark03Icon,
  Calendar01Icon,
  Cancel01Icon,
  BarChartHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { isIOS } from "@/src/utils/mood";
import { DayButton } from "./DayButtonComponent";
import SuspensLoader from "@/src/components/SuspensLoader";
import { EmotionDetailsModal } from "@/src/components/modals";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { BlurView } from "expo-blur";
import { Host, Menu as SUIMenu, Button as SUIButton } from "@expo/ui/swift-ui";
import { labelStyle, controlSize, tint } from "@expo/ui/swift-ui/modifiers";
import { CalendarPicker } from "./CalendarPicker";
import { useDailyNotesHeaderModel } from "./hooks/useDailyNotesHeaderModel";
import { useTranslation } from "react-i18next";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface DailyNotesHeaderProps {
  onBookmarksPress?: () => void;
}

const DailyNotesHeader = React.memo(
  ({ onBookmarksPress }: DailyNotesHeaderProps) => {
    const { t } = useTranslation("journal");
    const {
      selectedDate,
      insets,
      moodMap,
      isExpanded,
      collapse,
      gesture,
      hasBeenExpanded,
      showEmotionDetails,
      setShowEmotionDetails,
      emotionDetailsDate,
      headerContainerAnimatedStyle,
      titleAndBookmarkStyle,
      headerControlsAnimatedStyle,
      weekHeaderAnimatedStyle,
      inlineCalendarAnimatedStyle,
      weekSlideAnimatedStyle,
      panHandlers,
      isSelectedDateValid,
      selectDate,
      currentMonthView,
      weekDaysData,
      setWeekWidth,
      setButtonHeight,
      animatedPillStyle,
      dayPressHandlers,
      handleGoToToday,
      showTodayPill,
      onEmojiPress,
      handleCalendarPress,
      calendarIconStyle,
      handleBookmarkPressInternal,
      handleTimelinePress,
    } = useDailyNotesHeaderModel(onBookmarksPress);
    return (
      <View className="bg-brand-surface">
        <SafeAreaView
          edges={["top"]}
          style={{ paddingTop: insets.top - 30 }}
        >
          <Animated.View
            className="bg-brand-surface justify-start relative border-b border-brand-border"
            style={[
              headerContainerAnimatedStyle,
              { backgroundColor: SEMANTIC_COLORS.surface.primary, marginTop: -25 },
            ]}
          >
            {/* Calendar Header */}
            <Animated.View style={headerControlsAnimatedStyle} pointerEvents="box-none">
              <View
                className="flex-row items-center justify-between px-4 pt-1 pb-2 rounded-3xl"
                pointerEvents="box-none"
              >
                <Pressable
                  className="min-h-[44px] min-w-[44px] justify-center items-center -ml-1 rounded-full"
                  onPress={handleCalendarPress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={t(isExpanded ? "calendar.collapse" : "calendar.expand")}
                  accessibilityHint={t("calendar.expandHint")}
                >
                  <Animated.View style={calendarIconStyle}>
                    <HugeiconsIcon
                      icon={isExpanded ? Cancel01Icon : Calendar01Icon}
                      size={20}
                      color={SEMANTIC_COLORS.brand.pressed}
                      strokeWidth={2}
                    />
                  </Animated.View>
                </Pressable>

                {/* ponytail: softer month title and compressed week row spacing */}
                <Animated.View 
                  style={[titleAndBookmarkStyle, { position: 'absolute', left: 72, right: 72, top: 0, bottom: 0, zIndex: -1 }]} 
                  className="flex-row items-center justify-center pointer-events-none"
                  pointerEvents="none"
                >
                  <Text variant="h2" className="text-[21px] text-center" adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7}>
                    {currentMonthView || ""}
                  </Text>
                </Animated.View>

                <Animated.View 
                  style={titleAndBookmarkStyle} 
                  className="flex-row items-center gap-1.5"
                  pointerEvents={isExpanded ? "none" : "auto"}
                >
                  <TodayPill visible={showTodayPill} onPress={handleGoToToday} offsetX={0} label={t("calendar.today")} />
                  {Platform.OS === "ios" ? (
                    <Host matchContents style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
                      <SUIMenu
                        label={t("calendar.moreOptions")}
                        systemImage="ellipsis"
                        modifiers={[
                          labelStyle("iconOnly"),
                          controlSize("regular"),
                          tint(SEMANTIC_COLORS.brand.pressed as string),
                        ]}
                      >
                        <SUIButton
                          label={t("calendar.timeline")}
                          systemImage="chart.bar.xaxis"
                          onPress={handleTimelinePress}
                        />
                        <SUIButton
                          label={t("calendar.bookmarks")}
                          systemImage="bookmark"
                          onPress={handleBookmarkPressInternal}
                        />
                      </SUIMenu>
                    </Host>
                  ) : (
                    <Pressable
                      className="min-h-[44px] min-w-[44px] justify-center items-center rounded-full"
                      onPress={handleBookmarkPressInternal}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityRole="button"
                      accessibilityLabel={t("calendar.bookmarks")}
                    >
                      <HugeiconsIcon
                        icon={Bookmark03Icon}
                        size={20}
                        color={SEMANTIC_COLORS.brand.pressed}
                        strokeWidth={2}
                      />
                    </Pressable>
                  )}
                </Animated.View>
              </View>
            </Animated.View>
            {/* Week View */}
            <View className="px-4 pb-4 w-full relative" {...panHandlers}>
              <Animated.View
                className="flex-row w-full"
                style={[weekHeaderAnimatedStyle]}
              >
                <Animated.View
                  className="flex flex-1 flex-row gap-1 relative"
                  style={[weekSlideAnimatedStyle]}
                  accessibilityElementsHidden={isExpanded}
                  importantForAccessibility={
                    isExpanded ? "no-hide-descendants" : "auto"
                  }
                  onLayout={(e) => setWeekWidth(e.nativeEvent.layout.width)}
                >
                  {/* The Morphing Selection Pill */}
                  {isGlassEffectAPIAvailable() ? (
                    <AnimatedGlassView
                      style={animatedPillStyle}
                      pointerEvents="none"
                      glassEffectStyle="regular"
                      tintColor={SEMANTIC_COLORS.selection.surface as string}
                    />
                  ) : Platform.OS === "ios" ? (
                    <AnimatedBlurView
                      style={animatedPillStyle}
                      pointerEvents="none"
                      intensity={20}
                      tint="light"
                      experimentalBlurMethod="dimezisBlurView"
                    >
                      <View style={{ flex: 1, backgroundColor: SEMANTIC_COLORS.selection.surface, opacity: 0.8 }} />
                    </AnimatedBlurView>
                  ) : (
                    <Animated.View
                      style={[animatedPillStyle, { backgroundColor: SEMANTIC_COLORS.selection.surface }]}
                      pointerEvents="none"
                    />
                  )}

                  {weekDaysData.map((dayData, index) => (
                    <View className="flex-1 gap-1 mb-1.5" key={dayData.dayStr}>
                      <DayButton
                        day={dayData.day}
                        dayName={dayData.dayName}
                        isSelected={dayData.isSelectedDay}
                        isToday={dayData.isTodayDate}
                        disabled={dayData.disabled}
                        onPress={dayPressHandlers(dayData)}
                        onLayout={index === 0 ? (e) => setButtonHeight(e.nativeEvent.layout.height) : undefined}
                      />
                      <View className="h-6 items-center justify-center mt-0.5">
                        <MoodBadge
                          disabled={dayData.disabled}
                          moodscore={dayData.mood !== undefined ? Math.round(dayData.mood) : undefined}
                          active={dayData.isSelectedDay}
                          size={22}
                          onPress={() => onEmojiPress(dayData.day, dayData.mood)}
                          hideEmptySlot={dayData.mood === undefined}
                        />
                      </View>
                    </View>
                  ))}
                </Animated.View>
              </Animated.View>
            </View>
            {/* Only render CalendarPicker after first expansion for smooth animations */}
            {hasBeenExpanded && (
              <Animated.View
                className="absolute left-0 right-0 z-20 overflow-hidden px-4 pb-3 rounded-t-none bg-brand-surface top-0"
                style={[inlineCalendarAnimatedStyle]}
                accessibilityElementsHidden={!isExpanded}
                importantForAccessibility={
                  !isExpanded ? "no-hide-descendants" : "yes"
                }
              >
                <SuspensLoader>
                  <CalendarPicker
                    moodMap={moodMap}
                    selectedDate={isSelectedDateValid ? selectedDate : new Date()}
                    visible={isExpanded}
                    onDateSelect={(date: Date) => {
                      // First collapse smoothly, then update date so header morph feels natural
                      collapse(() => {
                        selectDate(date);
                      });
                    }}
                  />
                </SuspensLoader>
              </Animated.View>
            )}
            {/* Drag handle for calendar expansion */}
            <View
              className="absolute bottom-2 left-0 right-0 items-center z-10"
              pointerEvents="box-none"
            >
              <GestureDetector gesture={gesture}>
                <View
                  className="min-h-[44px] justify-center px-8 hidden"
                  accessibilityRole="adjustable"
                  accessibilityLabel={t("calendar.dragHandle")}
                >
                  <View className="w-12 h-1.5 rounded-full bg-sage-200" />
                </View>
              </GestureDetector>
            </View>
          </Animated.View>

          <EmotionDetailsModal
            visible={showEmotionDetails}
            onClose={() => setShowEmotionDetails(false)}
            selectedDate={emotionDetailsDate}
          />
        </SafeAreaView>
      </View>
    );
  }
);

DailyNotesHeader.displayName = "DailyNotesHeader";

export default DailyNotesHeader;

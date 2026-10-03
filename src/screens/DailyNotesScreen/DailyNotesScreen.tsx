import {
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { Text } from "@/src/components/ui/Text";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useAtom, useSetAtom } from "jotai";
import { SafeAreaView } from "@/src/components/tw";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  Easing,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  currentWeekViewAtom,
  selectedDateAtom,
  calenderVisibleDatesAtom,
  openAIInsightsAtom,
} from "./atoms";
import DailyNotesHeader from "./DailyNotesHeader";
import { formateDate_y_m_d } from "@/src/utils/date";
import SuspensLoader from "@/src/components/SuspensLoader";
import { HabitsSection } from "@/src/components/habits/HabitsSection";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { useMentalHealthData } from "@/hooks/data/useMentalHealthData";
import { useHabits } from "@/hooks/data/useHabits";
import { useAppDispatch } from "@/src/store/hooks";
import { setVisible } from "@/src/store/slices/happyAssistantSlice";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, badge } from "@expo/ui/swift-ui/modifiers";

// Static imports to avoid Metro bundler React.lazy chunk resolution crashes
import { MentalHealthProfileContainer } from "./notes/MentalHealthProfileContainer";
import { AIInsightsModalBottomSheet } from "@/src/components/ai/AIInsightsModalBottomSheet";
import { useJournalDateSwipe } from "./hooks/useJournalDateSwipe";
import { useTranslation } from "react-i18next";

type TabFilter = "habits" | "journal";

function DailyNotesScreenComponent(): ReactElement {
  const { i18n, t } = useTranslation("journal");
  // State for selected date
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [openAIInsights, setOpenAIInsights] = useAtom(openAIInsightsAtom);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);

  // Tab filter state
  const [tabFilter, setTabFilter] = useState<TabFilter>("journal");

  // Fetch journal entries to get the count
  const { data: insightsResponse } = useMentalHealthData(selectedDate);
  const journalCount = insightsResponse?.length || 0;

  const dispatch = useAppDispatch();
  const { habits } = useHabits();
  const habitsCount = habits?.length || 0;
  const isEmptyState =
    (tabFilter === "journal" && journalCount === 0) ||
    (tabFilter === "habits" && habitsCount === 0);

  // ponytail: hide floating assistant when screen displays empty state mascot; restore on tab blur
  useFocusEffect(
    useCallback(() => {
      dispatch(setVisible(!isEmptyState));
      return () => {
        dispatch(setVisible(true));
      };
    }, [dispatch, isEmptyState]),
  );

  // State for current week view (independent of selected date)
  const [currentWeekView, setCurrentWeekView] = useAtom(currentWeekViewAtom);

  // Set calendar visible dates based on current week in view
  const setCalenderVisibleDates = useSetAtom(calenderVisibleDatesAtom);

  // Update calendar visible dates when the displayed week changes.
  useEffect(() => {
    const monthStart = startOfMonth(currentWeekView);
    const monthEnd = endOfMonth(currentWeekView);
    const visibleStartDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const visibleEndDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    setCalenderVisibleDates({
      visibleStartDate: formateDate_y_m_d(visibleStartDate),
      visibleEndDate: formateDate_y_m_d(visibleEndDate),
    });
  }, [currentWeekView, setCalenderVisibleDates]);

  // Bottom sheet ref for AI insights
  const bottomSheetRef =
    useRef<
      import("@/src/components/ai/AIInsightsModalBottomSheet").AIInsightsModalRef
    >(null);

  useEffect(() => {
    if (!openAIInsights) return;

    setTabFilter("journal");

    const timer = setTimeout(() => {
      bottomSheetRef.current?.present();
      setOpenAIInsights(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [openAIInsights, setOpenAIInsights]);

  // Format week dates for display
  const weekDateFormatter = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const weekStartFormatted = weekDateFormatter.format(
    startOfWeek(currentWeekView, { weekStartsOn: 0 }),
  );
  const weekEndFormatted = weekDateFormatter.format(
    endOfWeek(currentWeekView, { weekStartsOn: 0 }),
  );

  const { gesture: contentPanGesture, animatedStyle: contentAnimatedStyle } =
    useJournalDateSwipe();

  // Memoize Mental Health Container to prevent re-renders during animations
  const mentalHealthContent = useMemo(
    () => (
      <View className="pt-4 pb-2">
        <SuspensLoader>
          <MentalHealthProfileContainer
            selectedDate={selectedDate}
            showBookmarksModal={showBookmarksModal}
            setShowBookmarksModal={setShowBookmarksModal}
            onRefresh={() => {
              // Optional refresh logic for mental health data
            }}
          />
        </SuspensLoader>
      </View>
    ),
    [selectedDate, showBookmarksModal],
  );

  // Memoize header callback
  const handleBookmarksPress = useCallback(
    () => setShowBookmarksModal((prev) => !prev),
    [],
  );
  const handleAIInsightsClose = useCallback((): void => {
    bottomSheetRef.current?.dismiss();
  }, []);

  // Memoize header component
  const headerComponent = useMemo(
    () => <DailyNotesHeader onBookmarksPress={handleBookmarksPress} />,
    [handleBookmarksPress],
  );
  const screenOptions = useMemo(
    () => ({
      header: () => headerComponent,
      headerShown: true,
    }),
    [headerComponent],
  );

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <ScrollView
        className="flex-1 bg-brand-surface"
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Tab Picker */}
        <View className="px-4 pt-2.5 pb-2 items-start">
          <Host style={{ height: 32, width: 230 }}>
            <Picker
              selection={tabFilter}
              onSelectionChange={(newSelection) => {
                if (typeof newSelection === "string") {
                  Haptics.selectionAsync();
                  setTabFilter(newSelection as TabFilter);
                }
              }}
              modifiers={[pickerStyle("segmented")]}
            >
              <SwiftUIText
                modifiers={[
                  tag("journal"),
                  badge(
                    journalCount > 0 ? String(journalCount) : undefined,
                  ),
                ]}
              >
                {t("tab.journal")}
              </SwiftUIText>

              <SwiftUIText modifiers={[tag("habits")]}>
                {t("tab.habits")}
              </SwiftUIText>
            </Picker>
          </Host>
        </View>

        {/* Unified Animated Container for Swipe Transitions */}
        <GestureDetector gesture={contentPanGesture}>
          <Animated.View
            className="flex-1 px-4 pb-8"
            style={contentAnimatedStyle}
          >
            {/* Habits Section */}
            {tabFilter === "habits" ? (
              <Animated.View
                entering={FadeIn.duration(500).easing(
                  Easing.bezier(0.4, 0.0, 0.2, 1),
                )}
                className="flex-1 pt-4"
              >
                <HabitsSection selectedDate={selectedDate} />
              </Animated.View>
            ) : null}

            {/* Journal Section */}
            {tabFilter === "journal" ? (
              <Animated.View
                entering={FadeIn.duration(500).easing(
                  Easing.bezier(0.4, 0.0, 0.2, 1),
                )}
                className="flex-1"
              >
                {mentalHealthContent}
              </Animated.View>
            ) : null}
          </Animated.View>
        </GestureDetector>
      </ScrollView>

      {/* AI Insights Bottom Sheet */}
      <SuspensLoader>
        <AIInsightsModalBottomSheet
          ref={bottomSheetRef}
          weekStart={weekStartFormatted}
          weekEnd={weekEndFormatted}
          onClose={handleAIInsightsClose}
        />
      </SuspensLoader>

      {/* Calendar Modal */}
    </>
  );
}

// Memoize the entire screen to prevent unnecessary re-renders from parent
const DailyNotesScreen = memo(DailyNotesScreenComponent);

export default DailyNotesScreen;

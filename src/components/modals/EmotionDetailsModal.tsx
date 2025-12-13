import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import ShortBottomModal from "../ShortBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { format } from "date-fns";
import { Image } from "@/components/ui/image";
import { emotions, Emotion } from "@/assets/emojis";
import useFetchDailyMoods from "@/hooks/data/useFetchDailyMoods";
import dayjs from "dayjs";

interface EmotionDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
}

interface EmotionEntry {
  time: string;
  mood: string;
  source: string;
  exactTime: Date;
}

export const EmotionDetailsModal: React.FC<EmotionDetailsModalProps> = ({
  visible,
  onClose,
  selectedDate,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const targetDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
  const { data: dailyMoods, isLoading } = useFetchDailyMoods({
    targetDate: targetDateStr,
  });

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const getMoodLabel = (score: number): string => {
    if (score >= 5) return "great";
    if (score >= 4) return "good";
    if (score >= 3) return "fine";
    if (score >= 2) return "bad";
    return "terrible";
  };

  const getSourceLabel = (inputMethod?: string | null): string => {
    if (inputMethod === "emotion_logger") return "Mood Log";
    if (inputMethod === "journal") return "Journal Entry";
    return "Mood Log";
  };

  const emotionEntries: EmotionEntry[] = React.useMemo(() => {
    return dailyMoods.map((moodData) => {
      const exactTime = new Date(moodData.selected_date);
      return {
        time: dayjs(exactTime).format("h:mm A"),
        mood: getMoodLabel(moodData.mood_score),
        source: getSourceLabel(moodData.input_method),
        exactTime,
      };
    });
  }, [dailyMoods]);

  return (
    <ShortBottomModal ref={sheetRef} snapPoints={["70%"]} onDismiss={onClose}>
      <VStack className="flex-1 px-5 pt-1 pb-6" space="sm">
        <View className="items-center w-full mb-4">
          <Heading className="text-center text-3xl font-cormorantSemiBold text-[#1f2937] mb-2 leading-9">
            Emotions for {format(selectedDate, "MMM d")}
          </Heading>
          <Text className="text-gray-600 text-center text-base">
            {format(selectedDate, "EEEE, yyyy")}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#7B61FF" />
          </View>
        ) : emotionEntries.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-gray-500 text-center text-base">
              No emotions logged for this day
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-4"
          >
            <VStack space="sm">
              {emotionEntries.map((entry, index) => (
                <View
                  key={`${entry.time}-${index}`}
                  className="flex-row items-center bg-gray-50 rounded-2xl p-4"
                >
                  <View className="flex-row items-center flex-1">
                    <Image
                      source={emotions[entry.mood as Emotion]}
                      className="w-10 h-10 mr-3"
                      alt={entry.mood}
                    />
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base capitalize">
                        {entry.mood}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {entry.source}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-600 font-medium text-sm">
                    {entry.time}
                  </Text>
                </View>
              ))}
            </VStack>
          </ScrollView>
        )}
      </VStack>
    </ShortBottomModal>
  );
};

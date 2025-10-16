import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Pressable, Platform, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTimePicker } from "./useTimePicker";
import TimePill from "./TimePill";

// Enable className on BottomSheetView (NativeWind CSS interop)
cssInterop(BottomSheetView, { className: "style" });

// Tokens-based styles (header/containers)

export type TimePickerModalProps = {
  visible: boolean;
  initial?: string; // formatted as 'hh:mm A'
  minuteStep?: number; // default 5
  title?: string;
  onCancel: () => void;
  onConfirm: (formatted: string) => void; // returns 'hh:mm A'
  onChange?: (formatted: string) => void; // live updates
};

const fmt2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initial,
  minuteStep = 5,
  title = "Select time",
  onCancel,
  onConfirm,
  onChange,
}) => {
  const snapPoints = useMemo(() => ["60%", "80%"], []);
  const modalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const {
    hour,
    minute,
    ampm,
    hours,
    minutes,
    setHour,
    setMinute,
    setAmPm,
    setFromInitial,
    formatOut,
  } = useTimePicker(initial, minuteStep);

  // Live update callback
  useEffect(() => {
    // announce live changes only while visible
    if (visible && typeof onChange === "function") {
      onChange(formatOut());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, ampm, visible]);

  useEffect(() => {
    if (visible) {
      setFromInitial(initial);
      modalRef.current?.present();
      // modalRef.current?.snapToIndex(0)
    } else {
      modalRef.current?.dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initial]);

  const handleConfirm = () => {
    onConfirm(formatOut());
  };

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
      opacity={0.25}
    />
  );

  const backgroundStyle = useMemo((): ViewStyle => {
    const style: ViewStyle = {
      backgroundColor: "#fff",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: "hidden",
    };
    if (Platform.OS === "ios") {
      // RN iOS supports borderCurve; TS types may not include it yet
      (
        style as unknown as { borderCurve?: "continuous" | "circular" }
      ).borderCurve = "continuous";
    }
    return style;
  }, []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={backgroundStyle}
      handleIndicatorStyle={{
        backgroundColor: "#D1D5DB",
        width: 36,
        height: 4,
        borderRadius: 2,
      }}
      //   keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
      onDismiss={() => {
        // if (visible) onCancel();
      }}
    >
      <BottomSheetView
        className="px-4 pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="pb-6">
          <View className="flex-row items-center justify-between py-3">
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text className="text-[#6B7280] font-semibold">Cancel</Text>
            </Pressable>
            <Text className="text-[#0F172A] font-extrabold text-lg">
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleConfirm}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
              className="px-4 py-2 rounded-2xl bg-[#0F172A]"
            >
              <Text className="text-white font-bold">Done</Text>
            </Pressable>
          </View>

          {/* Live selection summary */}
          <View className="items-center mb-2">
            <Text
              accessibilityLiveRegion="polite"
              className="text-xs text-[#6B7280]"
            >
              Selected {formatOut()}
            </Text>
          </View>

          <View className="flex-row pb-2 items-start">
            <View className="flex-1 mr-4">
              <Text className="text-xs text-[#6B7280] mb-2">Hour</Text>
              <View className="flex-row flex-wrap -m-2">
                {hours.map((h) => (
                  <TimePill
                    key={`h-${h}`}
                    label={fmt2(h)}
                    selected={hour === h}
                    accessibilityLabel={`Hour ${fmt2(h)} ${
                      hour === h ? "selected" : ""
                    }`}
                    onPress={() => setHour(h)}
                  />
                ))}
              </View>
            </View>

            <View className="flex-1 mr-4">
              <Text className="text-xs text-[#6B7280] mb-2">Minute</Text>
              <View className="flex-row flex-wrap -m-2">
                {minutes.map((m) => (
                  <TimePill
                    key={`m-${m}`}
                    label={fmt2(m)}
                    selected={minute === m}
                    accessibilityLabel={`Minute ${fmt2(m)} ${
                      minute === m ? "selected" : ""
                    }`}
                    onPress={() => setMinute(m)}
                  />
                ))}
              </View>
            </View>

            <View className="w-24 pl-4">
              <Text className="text-xs text-[#6B7280] mb-2">AM/PM</Text>
              <View className="flex-row flex-wrap -m-2">
                {["AM", "PM"].map((ap) => (
                  <TimePill
                    key={`ap-${ap}`}
                    label={ap}
                    selected={ampm === ap}
                    accessibilityLabel={`${ap} ${
                      ampm === ap ? "selected" : ""
                    }`}
                    onPress={() => setAmPm(ap as "AM" | "PM")}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default TimePickerModal;

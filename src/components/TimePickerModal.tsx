import React, { useMemo } from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export type TimePickerModalProps = {
  visible: boolean;
  initial?: string; // formatted as 'hh:mm A'
  // Allowed minute intervals per @react-native-community/datetimepicker
  minuteStep?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30; // default 5
  title?: string;
  onCancel: () => void;
  onConfirm: (formatted: string) => void; // returns 'hh:mm A'
  onChange?: (formatted: string) => void; // live updates
};
export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initial,
  minuteStep = 5,
  title = "Select time",
  onCancel,
  onConfirm,
  onChange,
}) => {
  // Build an initial Date from the 'hh:mm A' string (or fallback to now)
  const initialDate = useMemo(() => {
    if (initial) {
      const d = dayjs(initial, "hh:mm A", true);
      if (d.isValid()) {
        const base = dayjs();
        return base
          .hour(d.hour())
          .minute(d.minute())
          .second(0)
          .millisecond(0)
          .toDate();
      }
    }
    return new Date();
  }, [initial]);

  return (
    <DateTimePickerModal
      isVisible={visible}
      mode="time"
      date={initialDate}
      display={Platform.OS === "ios" ? "spinner" : undefined}
      pickerContainerStyleIOS={{ backgroundColor: "#ffffff" }}
      pickerStyleIOS={{ height: 216 }}
      pickerComponentStyleIOS={{ height: 216 }}
      backdropStyleIOS={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      textColor="#0F172A"
      modalPropsIOS={{ presentationStyle: "overFullScreen" }}
      confirmTextIOS="Confirm"
      cancelTextIOS="Cancel"
      is24Hour={false}
      minuteInterval={minuteStep}
      onConfirm={(date: Date) => {
        const formatted = dayjs(date).format("hh:mm A");
        onChange?.(formatted);
        onConfirm(formatted);
      }}
      onCancel={onCancel}
    />
  );
};

export default TimePickerModal;

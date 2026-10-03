import React from "react";
import * as Haptics from "expo-haptics";
import {
  Host,
  BottomSheet,
  Group,
  VStack,
  Text as SUIText,
  DatePicker as SwiftUIDateTimePicker,
} from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  padding,
  font,
  foregroundStyle,
  datePickerStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useTranslation } from "react-i18next";

interface CalendarDatePickerSheetProps {
  isVisible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

export const CalendarDatePickerSheet: React.FC<CalendarDatePickerSheetProps> = React.memo(
  ({ isVisible, selectedDate, onClose, onSelectDate }) => {
    const { t } = useTranslation("journal");
    return (
      <Host>
        <BottomSheet
          isPresented={isVisible}
          onIsPresentedChange={(val) => {
            if (!val) {
              onClose();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["medium"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <VStack
              alignment="leading"
              spacing={16}
              modifiers={[padding({ all: 24 } as any)]}
            >
              <SUIText
                modifiers={[
                  font({ weight: "bold", size: 20 }),
                  foregroundStyle("#1C1C1E"),
                ]}
              >
                {t("capture.selectDate")}
              </SUIText>
              <SwiftUIDateTimePicker
                onDateChange={(date: Date) => {
                  void Haptics.selectionAsync();
                  onSelectDate(date);
                }}
                displayedComponents={["date"]}
                title={t("capture.selectDate")}
                selection={selectedDate}
                modifiers={[datePickerStyle("graphical")]}
              />
            </VStack>
          </Group>
        </BottomSheet>
      </Host>
    );
  }
);

CalendarDatePickerSheet.displayName = "CalendarDatePickerSheet";

/**
 * NotificationsUI Component
 *
 * Main component for managing daily reminder notifications.
 * Allows users to configure multiple reminder times with custom messages.
 */

import React from "react";
// FIX #2: Removed justify-center items-center from View — incompatible with scrollable content
import { View, ScrollView } from "react-native";
import TimePickerModal from "./TimePickerModal";
import {
  DEFAULT_REMINDERS,
  ReminderCard,
  NotificationHeader,
  useReminderConfig,
} from "./notifications";

// FIX #1: Empty interface replaced with explicit empty type (no-arg)
const NotificationsUI: React.FC = () => {
  const {
    items,
    cfg,
    editingId,
    currentEditingItem,
    openEdit,
    closeEdit,
    handleConfirm,
    handleTimeChange,
    toggleSelected,
  } = useReminderConfig(DEFAULT_REMINDERS);

  return (
    // FIX #1: bg-offwhite instead of hard-coded #DCF2FF
    // FIX #2: Removed justify-center items-center — those break ScrollView layout
    <View className="flex-1 bg-offwhite">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <NotificationHeader />

        {/* Reminder Cards */}
        <View className="border-y border-border/50 bg-background mt-2">
          {items.map((item, index) => {
            const isSelected = cfg[item.id]?.enabled;
            return (
              <ReminderCard
                key={item.id}
                item={item}
                index={index}
                isSelected={isSelected}
                onToggle={() => toggleSelected(item.id)}
                onTimeChange={(hour, minute) => handleTimeChange(item.id, hour, minute)}
                isLast={index === items.length - 1}
              />
            );
          })}
        </View>
      </ScrollView>

    </View>
  );
};

export default NotificationsUI;

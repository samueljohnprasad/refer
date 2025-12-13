/**
 * NotificationsUI Component
 *
 * Main component for managing daily reminder notifications.
 * Allows users to configure multiple reminder times with custom messages.
 */

import React from "react";
import { View, ScrollView } from "react-native";
import TimePickerModal from "./TimePickerModal";
import {
  DEFAULT_REMINDERS,
  ReminderCard,
  NotificationHeader,
  useReminderConfig,
} from "./notifications";

type NotificationsUIProps = {};
/**
 * Main NotificationsUI Component
 */
const NotificationsUI: React.FC<NotificationsUIProps> = () => {
  const {
    items,
    cfg,
    editingId,
    currentEditingItem,
    openEdit,
    closeEdit,
    handleConfirm,
    toggleSelected,
  } = useReminderConfig(DEFAULT_REMINDERS);

  return (
    <View className="flex-1 bg-[#DCF2FF]">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 104 }}
      >
        <NotificationHeader />

        {/* Reminder Cards */}
        <View className="mt-5">
          {items.map((item, index) => {
            const isSelected = cfg[item.id]?.enabled;
            return (
              <ReminderCard
                key={item.id}
                item={item}
                index={index}
                isSelected={isSelected}
                onToggle={() => toggleSelected(item.id)}
                onEditTime={() => openEdit(item.id)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={!!editingId}
        initial={{
          hour: currentEditingItem?.hour ?? 9,
          minute: currentEditingItem?.minute ?? 0,
        }}
        minuteStep={1}
        onCancel={closeEdit}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export default NotificationsUI;

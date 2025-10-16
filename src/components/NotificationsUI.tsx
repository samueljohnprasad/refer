// NotificationsUI.tsx
// React Native single-file UI mock (TypeScript) recreating the provided screenshot.
// Note: UI-only, no interactivity.

import React, { useMemo, useState } from "react";
import type { ComponentProps } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { notification } from "@/assets/lottie";
import TimePickerModal from "./TimePickerModal";

type FeatherName = ComponentProps<typeof Feather>["name"];
type MCName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type BaseItem = {
  id: string;
  title: string;
  time: string;
};

type FeItem = BaseItem & { iconLib: "fe"; icon: FeatherName };
type McItem = BaseItem & { iconLib: "mc"; icon: MCName };

type Item = FeItem | McItem;

const DEFAULT_DATA: Item[] = [
  {
    id: "1",
    title: "Morning",
    icon: "weather-sunset-up",
    time: "09:01 AM",
    iconLib: "mc",
  },
  { id: "2", title: "Day", icon: "sun", time: "02:30 PM", iconLib: "fe" },
  {
    id: "3",
    title: "Evening",
    icon: "weather-night",
    time: "09:00 PM",
    iconLib: "mc",
  },
];

const NotificationsUI: React.FC = () => {
  const [items, setItems] = useState<Item[]>(DEFAULT_DATA);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const openEdit = (id: string) => {
    setEditingId(id);
  };

  const closeEdit = () => setEditingId(null);

  const currentEditingItem = useMemo(
    () => items.find((x) => x.id === editingId) ?? null,
    [items, editingId]
  );
  const handleConfirm = (formatted: string) => {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((it) => (it.id === editingId ? { ...it, time: formatted } : it))
    );
    setEditingId(null);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <View style={styles.card}>
        <View style={styles.leftRow}>
          <View style={styles.iconWrap}>
            {item.iconLib === "fe" ? (
              <Feather name={item.icon} size={20} style={styles.icon} />
            ) : (
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                style={styles.icon}
              />
            )}
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>

        <View style={styles.rightRow}>
          <TouchableOpacity
            style={styles.timePill}
            onPress={() => openEdit(item.id)}
          >
            <Text style={styles.timeText}>{item.time}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleSelected(item.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            style={[
              styles.toggleCircle,
              isSelected && styles.toggleCircleSelected,
            ]}
            accessibilityLabel={`${item.title} reminder`}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={notification}
        />
        {/* <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Users who set reminders journal
          {`
`}
          2x more consistently
        </Text> */}

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
        {/* Time Picker Modal (reusable) */}
        <TimePickerModal
          visible={!!editingId}
          initial={currentEditingItem?.time}
          minuteStep={5}
          onCancel={closeEdit}
          onConfirm={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backIcon: {
    color: "#262626",
    opacity: 0.9,
  },
  bellContainer: {
    flex: 1,
    alignItems: "center",
  },
  bellCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCE86F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bellIcon: {
    color: "#7B5E00",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#9AA0A6",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
  },
  listContainer: {
    marginTop: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F6F6F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 0,
  },
  icon: {
    color: "#9AA0A6",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timePill: {
    backgroundColor: "#F8F8F9",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 0,
  },
  timeText: {
    fontSize: 15,
    color: "#585858",
    fontWeight: "600",
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E6E6E8",
    backgroundColor: "transparent",
  },
  toggleCircleSelected: {
    borderColor: "#0c86f7",
    backgroundColor: "#0c86f7",
  },
  // modal styles removed (moved into TimePickerModal)
});

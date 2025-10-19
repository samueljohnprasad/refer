// NotificationsUI.tsx
// Beginner-friendly, commented implementation of a reminders UI.
// Lets the user pick times and enable/disable daily local notifications.

import React, { useMemo, useState, useEffect } from "react";
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
// import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { notification } from "@/assets/lottie";
import TimePickerModal from "./TimePickerModal";
// Import the small notifications helper we wrote. It wraps Expo Notifications
// to: request permissions, parse the time string, schedule/cancel reminders,
// and persist the user's choices to AsyncStorage so they survive app restarts.
import type { RemindersConfig } from "@/src/lib/notification-reminders";
import {
  ensureNotificationPermissions,
  loadRemindersConfig,
  saveRemindersConfig,
  scheduleDailyReminder,
  cancelReminder,
} from "@/src/lib/notification-reminders";
import { hydrateLocalFromSupabaseIfEmpty } from "@/src/network/reminders";
import { atom, useAtom } from "jotai";
import dayjs from "dayjs";

type FeatherName = ComponentProps<typeof Feather>["name"];
type MCName = ComponentProps<typeof MaterialCommunityIcons>["name"];

// Item shape displayed in the list. Each row is a "reminder slot" with:
// - id: a stable identifier we use for persistence
// - title: a human label shown in the UI
// - time: a string like '09:01 AM' coming from the time picker
type BaseItem = {
  id: string;
  title: string;
  hour: number;
  minute: number;
};

type FeItem = BaseItem & { iconLib: "fe"; icon: FeatherName };
type McItem = BaseItem & { iconLib: "mc"; icon: MCName };

type Item = FeItem | McItem;

// Default three reminder slots with initial times; users can edit these.
const DEFAULT_DATA: Item[] = [
  {
    id: "1",
    title: "Morning",
    icon: "weather-sunset-up",
    hour: 9,
    minute: 1,
    iconLib: "mc",
  },
  { id: "2", title: "Day", icon: "sun", hour: 14, minute: 30, iconLib: "fe" },
  {
    id: "3",
    title: "Evening",
    icon: "weather-night",
    hour: 21,
    minute: 0,
    iconLib: "mc",
  },
];

type NotificationsUIProps = {};

export const cfgAtom = atom<RemindersConfig>({});
// Component: manages screen state, loads and saves reminders config,
// schedules/cancels notifications, and reflects UI status.
const NotificationsUI: React.FC<NotificationsUIProps> = ({}) => {
  const [items, setItems] = useState<Item[]>(DEFAULT_DATA);
  // const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cfg, setCfg] = useAtom(cfgAtom);
  const openEdit = (id: string) => {
    setEditingId(id);
  };
  const closeEdit = () => setEditingId(null);

  // On first mount: load saved reminder settings from storage, then
  // - update the visible times for each row
  // - mark the toggles as ON for any previously-enabled reminders
  useEffect(() => {
    let active = true;
    (async () => {
      let stored = await loadRemindersConfig();
      if (!active) return;
      // If local storage is empty, try hydrating from Supabase (single daily time)
      if (Object.keys(stored).length === 0) {
        // stored = await hydrateLocalFromSupabaseIfEmpty(stored, "1", "Morning");
      }
      setCfg(stored);
      // Put saved times into the UI list so the user sees what was last chosen
      setItems((prev) =>
        prev.map((it) => {
          const c = stored[it.id];
          return c?.hour
            ? { ...it, hour: c.hour, minute: c.minute, enabled: c.enabled }
            : it;
        })
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  const currentEditingItem = useMemo(
    () => items.find((x) => x.id === editingId) ?? null,
    [items, editingId]
  );
  // When the user taps "Done" in the time picker:
  // 1) Update the visible time in the UI
  // 2) Save it to storage
  // 3) If this reminder is currently enabled, cancel the old schedule and
  //    immediately schedule a new daily notification at the new time.
  const handleConfirm = ({
    hour,
    minute,
  }: {
    hour: number;
    minute: number;
  }) => {
    if (!editingId) return;
    const id = editingId;
    const it = items.find((x) => x.id === id) ?? null;

    // Update the UI list with the new time string (e.g., '09:30 PM')
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hour, minute } : p))
    );
    setEditingId(null);

    // Merge into our persisted config
    let nextCfg: RemindersConfig = {
      ...cfg,
      [id]: {
        ...(cfg[id] ?? {}),
        hour,
        minute,
        title: it?.title ?? cfg[id]?.title,
        enabled: cfg[id]?.enabled ?? false,
      },
    };
    setCfg(nextCfg);

    // If enabled, reschedule to reflect the new time.
    // if (selectedIds.has(id)) {
    //   await cancelReminder(cfg[id]?.notifId);
    //   const newNotifId = await scheduleDailyReminder(
    //     id,
    //     it?.title ?? "Reminder",
    //     { hour, minute }
    //   );
    //   nextCfg = {
    //     ...nextCfg,
    //     [id]: { ...nextCfg[id], notifId: newNotifId },
    //   };
    // }

    // Persist to AsyncStorage so it survives app restarts.
    // await saveRemindersConfig(nextCfg);
  };

  // Toggle a reminder ON/OFF when the user taps the small circle:
  // - ON: ask for permission (if needed), schedule a daily notification,
  //       remember the new notifId, and persist.
  // - OFF: cancel the scheduled notification and persist.
  const toggleSelected = async (id: string) => {
    const it = items.find((x) => x.id === id) ?? null;
    if (!it) return;

    const enabled = cfg[id]?.enabled ?? false;
    if (enabled) {
      // Turning OFF: cancel any existing schedule for this slot
      // await cancelReminder(cfg[id]?.notifId);
      const nextCfg: RemindersConfig = {
        ...cfg,
        [id]: { ...(cfg[id] ?? {}), enabled: false },
      };
      setCfg(nextCfg);
      // await saveRemindersConfig(nextCfg);
      return;
    }

    // Turning ON: ensure the OS has granted notification permission
    const granted = await ensureNotificationPermissions();
    if (!granted) return;

    // Schedule a daily notification at the selected time
    // const notifId = await scheduleDailyReminder(id, it.title, {
    //   hour: it.hour,
    //   minute: it.minute,
    // });
    const nextCfg: RemindersConfig = {
      ...cfg,
      [id]: {
        hour: it.hour,
        minute: it.minute,
        enabled: true,
        title: it.title,
      },
    };
    setCfg(nextCfg);
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => {
    const isSelected = cfg[item.id]?.enabled;
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
            <Text style={styles.timeText}>
              {dayjs().hour(item.hour).minute(item.minute).format("h:mm A")}
            </Text>
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
        {/* <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={notification}
        /> */}
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
          initial={{
            hour: currentEditingItem?.hour ?? 9,
            minute: currentEditingItem?.minute ?? 0,
          }}
          minuteStep={1}
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

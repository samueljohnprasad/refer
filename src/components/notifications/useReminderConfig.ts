import { useState, useEffect, useMemo } from "react";
import { Alert, Linking } from "react-native";
import { useAtom } from "jotai";
import type { RemindersConfig } from "@/src/lib/notification-reminders";
import {
  ensureNotificationPermissions,
  loadRemindersConfig,
} from "@/src/lib/notification-reminders";
import type { ReminderItem } from "./types";
import { cfgAtom } from "./store";

type UseReminderConfigReturn = {
  items: ReminderItem[];
  cfg: RemindersConfig;
  editingId: string | null;
  currentEditingItem: ReminderItem | null;
  setItems: React.Dispatch<React.SetStateAction<ReminderItem[]>>;
  setCfg: (cfg: RemindersConfig) => void;
  openEdit: (id: string) => void;
  closeEdit: () => void;
  handleConfirm: (time: { hour: number; minute: number }) => void;
  toggleSelected: (id: string) => Promise<void>;
};

/**
 * Custom hook to manage reminder configuration state and operations
 */
export const useReminderConfig = (
  defaultItems: ReminderItem[]
): UseReminderConfigReturn => {
  const [items, setItems] = useState<ReminderItem[]>(defaultItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cfg, setCfg] = useAtom(cfgAtom);

  // Load saved configuration on mount
  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await loadRemindersConfig();
      if (!active) return;

      setCfg(stored);

      // Update UI with saved times
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

  const openEdit = (id: string) => {
    setEditingId(id);
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  /**
   * Handle time confirmation from picker
   */
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

    // Update UI
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hour, minute } : p))
    );
    setEditingId(null);

    // Update config
    const nextCfg: RemindersConfig = {
      ...cfg,
      [id]: {
        ...(cfg[id] ?? {}),
        hour,
        minute,
        title: it?.title ?? cfg[id]?.title,
        body: it?.notificationBody ?? cfg[id]?.body,
        enabled: cfg[id]?.enabled ?? false,
      },
    };
    setCfg(nextCfg);
  };

  /**
   * Toggle reminder on/off
   */
  const toggleSelected = async (id: string) => {
    const it = items.find((x) => x.id === id) ?? null;
    if (!it) return;

    const enabled = cfg[id]?.enabled ?? false;

    if (enabled) {
      // Turn OFF
      const nextCfg: RemindersConfig = {
        ...cfg,
        [id]: { ...(cfg[id] ?? {}), enabled: false },
      };
      setCfg(nextCfg);
      return;
    }

    // Turn ON - request permissions first
    const granted = await ensureNotificationPermissions();
    if (!granted) {
      Alert.alert(
        "Notification Permission Needed",
        "Please enable notification access in Settings to receive reminders.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openURL("app-settings:"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    const nextCfg: RemindersConfig = {
      ...cfg,
      [id]: {
        hour: it.hour,
        minute: it.minute,
        enabled: true,
        title: it.title,
        body: it.notificationBody,
      },
    };
    setCfg(nextCfg);
  };

  return {
    items,
    cfg,
    editingId,
    currentEditingItem,
    setItems,
    setCfg,
    openEdit,
    closeEdit,
    handleConfirm,
    toggleSelected,
  };
};

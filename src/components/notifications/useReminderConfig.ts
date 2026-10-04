import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";
import { useAtom } from "jotai";
import type { RemindersConfig } from "@/src/components/lib/notification-reminders";
import {
  ensureNotificationPermissions,
  loadRemindersConfig,
} from "@/src/components/lib/notification-reminders";
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
  handleTimeChange: (id: string, hour: number, minute: number) => void;
  toggleSelected: (id: string) => Promise<void>;
};

interface UseReminderConfigOptions {
  requestPermissionsOnToggle?: boolean;
}

/**
 * Custom hook to manage reminder configuration state and operations
 */
export const useReminderConfig = (
  defaultItems: ReminderItem[],
  options?: UseReminderConfigOptions
): UseReminderConfigReturn => {
  const { t } = useTranslation("settings");
  const requestPermissionsOnToggle = options?.requestPermissionsOnToggle ?? true;
  const localizedItems = useMemo(
    () =>
      defaultItems.map((item) => ({
        ...item,
        title: t(`reminders.slots.${item.id}.title`, { defaultValue: item.title }),
        notificationBody: t(`reminders.slots.${item.id}.body`, {
          defaultValue: item.notificationBody,
        }),
      })),
    [defaultItems, t],
  );
  const [items, setItems] = useState<ReminderItem[]>(localizedItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cfg, setCfg] = useAtom(cfgAtom);

  // Load saved configuration on mount
  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await loadRemindersConfig();
      if (!active) return;

      let initialCfg = { ...stored };

      // ponytail: default all reminders to enabled locally
      if (Object.keys(stored).length === 0) {
        localizedItems.forEach((it) => {
          initialCfg[it.id] = {
            hour: it.hour,
            minute: it.minute,
            enabled: true,
            title: it.title,
            body: it.notificationBody,
          };
        });
      }

      setCfg(initialCfg);

      // Update UI with saved times
      setItems((prev) =>
        prev.map((it) => {
          const c = initialCfg[it.id];
          return c?.hour
            ? { ...it, hour: c.hour, minute: c.minute, enabled: c.enabled }
            : it;
        })
      );
    })();

    return () => {
      active = false;
    };
  }, [localizedItems, setCfg]);

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

  const handleTimeChange = (id: string, hour: number, minute: number) => {
    const it = items.find((x) => x.id === id) ?? null;
    
    // Update UI
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hour, minute } : p))
    );

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

    // Turn ON - request permissions first if requested
    if (requestPermissionsOnToggle) {
      const granted = await ensureNotificationPermissions();
      if (!granted) {
        Alert.alert(
          t("reminders.permissionTitle"),
          t("reminders.permissionMessage"),
          [
            {
              text: t("reminders.openSettings"),
              onPress: () => Linking.openURL("app-settings:"),
            },
            { text: t("reminders.cancel"), style: "cancel" },
          ]
        );
        return;
      }
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
    handleTimeChange,
    toggleSelected,
  };
};

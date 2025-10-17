import {
  cancelReminder,
  RemindersConfigItem,
  saveRemindersConfig,
  scheduleDailyReminder,
} from "@/src/lib/notification-reminders";
import { cfgAtom } from "@/src/components/NotificationsUI";
import { useAtom } from "jotai";
import * as Notifications from "expo-notifications";

const useNotifications = () => {
  const [cfg, setCfg] = useAtom(cfgAtom);

  const addNotification = async (id: string, cfgItem: RemindersConfigItem) => {
    const { hour, minute, notifId, title } = cfgItem;
    const newNotifId = await scheduleDailyReminder(id, title ?? "remainder", {
      hour,
      minute,
    });
    const nextCfg = {
      ...cfg,
      [id]: { ...cfgItem, notifId: newNotifId },
    };

    setCfg(nextCfg);
    return nextCfg;
  };

  const addNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Object.keys(cfg).forEach(async (id) => {
      await addNotification(id, cfg[id]);
    });
    await saveRemindersConfig(cfg);
  };

  return { addNotifications, addNotification };
};

export default useNotifications;

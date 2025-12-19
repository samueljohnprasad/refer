import {
  cancelReminder,
  RemindersConfigItem,
  saveRemindersConfig,
  scheduleDailyReminder,
} from "@/src/components/lib/notification-reminders";
import { useAtom } from "jotai";
import * as Notifications from "expo-notifications";
import { cfgAtom } from "@/src/components/notifications";

const useNotifications = () => {
  const [cfg, setCfg] = useAtom(cfgAtom);

  const addNotification = async (id: string, cfgItem: RemindersConfigItem) => {
    const { hour, minute, notifId, title, body } = cfgItem;
    const newNotifId = await scheduleDailyReminder(
      id,
      title ?? "Reminder",
      { hour, minute },
      body
    );
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

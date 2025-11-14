import { intervalToDuration } from "date-fns";
import dayjs from "dayjs";
import { createAudioPlayer } from "expo-audio";

export const ISO_DATE_FORMAT = "YYYY-MM-DD";

export const formateDate_y_m_d = (date: Date | string) => {
  return dayjs(date).format(ISO_DATE_FORMAT);
};

export const formattedDateTime = (inputDate?: string | null | Date): string => {
  if (!inputDate) return "-";
  return dayjs(inputDate || new Date()).format("MMM D, YYYY • h:mm A");
};

export async function getAudioDuration(source: string) {
  const player = createAudioPlayer(source);
  await new Promise((resolve) => {
    const check = setInterval(() => {
      if (player.isLoaded) {
        clearInterval(check);
        resolve(1);
      }
    }, 100);
  });

  const duration = player.duration;
  player.remove();
  return duration;
}

export const getDuration = (durationSeconds?: number | null) => {
  if (!durationSeconds) return "";
  const d = intervalToDuration({
    start: 0,
    end: durationSeconds * 1000,
  });
  const parts = [];
  if (d.hours) parts.push(`${d.hours}h`);
  if (d.minutes) parts.push(`${d.minutes}m`);
  if (d.seconds) parts.push(`${d.seconds}s`);
  return parts.join(" ") || "0s";
};

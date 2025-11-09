import { format } from "date-fns/format";
import { createAudioPlayer } from "expo-audio";

export const formateDate_y_m_d = (date: Date | string) => {
  return format(date, "yyyy-MM-dd");
};

export const formattedDateTime = (inputDate?: string | null | Date): string => {
  if (!inputDate) return "-";
  return format(inputDate || new Date(), "MMM d, yyyy • h:mm a");
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

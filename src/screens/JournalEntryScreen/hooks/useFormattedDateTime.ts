import { useMemo } from "react";

/**
 * Hook to format current date and time for display
 * Returns formatted string like "Jan 15, 2024 • 3:45 PM"
 */
export const useFormattedDateTime = (): string => {
  return useMemo<string>((): string => {
    const now: Date = new Date();
    const date: string = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time: string = now.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${date} • ${time}`;
  }, []);
};

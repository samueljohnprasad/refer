import {
  seasonalThemes,
  defaultTheme,
  SeasonalTheme,
} from "@/constants/seasonalThemes";

/**
 * Hook that returns the currently active seasonal theme based on:
 * - Current month (0-11) for seasonal colors
 * - Current time (6AM-7PM) for day/night mode
 *
 * This ensures consistent theming across all components in the app.
 */
export const useSeasonalTheme = ():
  | SeasonalTheme["day"]
  | SeasonalTheme["night"] => {
  // Day/Night mode based on current time
  const currentHour = new Date().getHours();
  const isDayMode = currentHour >= 6 && currentHour < 19; // 6 AM to 7 PM is day mode

  // Get current month for seasonal theming
  const currentMonth = new Date().getMonth(); // 0-11

  // Return the active theme
  const activeTheme = isDayMode
    ? (seasonalThemes[currentMonth] || defaultTheme).day
    : (seasonalThemes[currentMonth] || defaultTheme).night;

  return activeTheme;
};

/**
 * Hook that returns additional theme utilities
 */
export const useSeasonalThemeUtils = () => {
  const activeTheme = useSeasonalTheme();
  const currentHour = new Date().getHours();
  const isDayMode = currentHour >= 6 && currentHour < 19;
  const currentMonth = new Date().getMonth();

  return {
    activeTheme,
    isDayMode,
    currentMonth,
    currentHour,
  };
};

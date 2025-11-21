import { AgeRange, Gender } from "@/types/types";
import { MoodDef, AgeRangeOption } from "./types";

// Premium color palette with luxury gradients
export const MOODS: MoodDef[] = [
  {
    emoji: "😞",
    name: "Terrible",
    backgroundColor: "#E8D5FF", // Rich lavender gradient base
    inputType: "name",
  },
  {
    emoji: "😢",
    name: "Sad",
    backgroundColor: "#FFE0F0", // Elegant rose gradient base
    inputType: "birthday",
  },
  {
    emoji: "😐",
    name: "Fine",
    backgroundColor: "#FFF3D4", // Warm golden gradient base
    inputType: "options",
  },
  {
    emoji: "🙂",
    name: "Good",
    backgroundColor: "#DCF2FF", // Premium sky gradient base
    inputType: "reminder",
  },
  {
    emoji: "😄",
    name: "Great",
    backgroundColor: "#E5FFE5", // Fresh mint gradient base
    inputType: "great",
  },
];

export const AGE_RANGES: readonly AgeRangeOption[] = [
  { label: "18-24", value: "18_24" },
  { label: "25-34", value: "25_34" },
  { label: "35-44", value: "35_44" },
  { label: "45-54", value: "45_54" },
  { label: "55-64", value: "55_64" },
  { label: "65+", value: "65+" },
];

export const GENDERS: readonly Gender[] = ["male", "female", "other"];

export const BACKGROUND_COLORS = [
  "#E8D5FF", // Rich lavender
  "#FFE0F0", // Elegant rose
  "#FFF3D4", // Warm golden
  "#DCF2FF", // Premium sky
  "#E5FFE5", // Fresh mint
];

export const TOTAL_STEPS = 5;
export const BUTTON_COLOR = "#7C3AED"; // Premium violet

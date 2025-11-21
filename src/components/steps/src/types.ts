import { AgeRange, Gender } from "@/types/types";

export type InputType = "name" | "birthday" | "options" | "reminder" | "great";

export interface MoodDef {
  emoji: string;
  name: string;
  backgroundColor: string;
  inputType: InputType;
}

export interface OnBoardingFormData {
  name: string;
  ageRange?: AgeRange;
  gender?: Gender;
  reasons: string[];
}

export interface AgeRangeOption {
  label: string;
  value: AgeRange;
}

export type StepsAppProps = {
  onComplete?: (onBoardingData: OnBoardingFormData) => void;
};

import { OnBoardingFormData, MoodDef } from "./types";

/**
 * Validates if the user can proceed to the next step based on current step requirements
 */
export const canProceedToNextStep = (
  currentMood: MoodDef,
  formData: OnBoardingFormData
): boolean => {
  switch (currentMood?.inputType) {
    case "birthday":
      return !!formData?.ageRange && !!formData.gender;
    case "options":
      return Array.isArray(formData.reasons) && formData.reasons.length > 0;
    default:
      return true;
  }
};

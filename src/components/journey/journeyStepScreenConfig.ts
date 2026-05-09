import type { ImageSourcePropType } from "react-native";

export type JourneyStepScreenName = "feel-better" | "reframe-thoughts";

export type JourneyStepScreenConfig = {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
};

export const journeyStepScreenConfig: Record<
  JourneyStepScreenName,
  JourneyStepScreenConfig
> = {
  "feel-better": {
    image: require("@/assets/journey/journey-step.png"),
    title: "Feel\nbetter",
    subtitle: "Take one guided\nstep at a time.",
  },
  "reframe-thoughts": {
    image: require("@/assets/journey/cbt-step.png"),
    title: "Reframe\nThoughts",
    subtitle: "Reset anxious thinking with guided thought reframing tools.",
  },
};

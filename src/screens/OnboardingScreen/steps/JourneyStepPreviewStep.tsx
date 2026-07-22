import React from "react";
import JourneyStepScreen from "@/src/domains/journey/ui/screens/JourneyStepScreen";

const JourneyStepPreviewStep: React.FC = () => {
  return <JourneyStepScreen name="feel-better" />;
};

export default React.memo(JourneyStepPreviewStep);

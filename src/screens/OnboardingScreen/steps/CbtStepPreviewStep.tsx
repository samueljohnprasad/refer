import React from "react";
import JourneyStepScreen from "@/src/domains/journey/ui/screens/JourneyStepScreen";

const CbtStepPreviewStep: React.FC = () => {
  return <JourneyStepScreen name="reframe-thoughts" />;
};

export default React.memo(CbtStepPreviewStep);

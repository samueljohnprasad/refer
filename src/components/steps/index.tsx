import { App, OnBoardingFormData } from "./src";

export type StepsProps = {
  onComplete?: (onBoardingData: OnBoardingFormData) => void;
};

export const Steps: React.FC<StepsProps> = ({ onComplete }) => {
  return <App onComplete={onComplete} />;
};

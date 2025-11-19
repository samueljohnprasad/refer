import { App, OnBoardingFormData } from "./src";

export type StepsProps = {
  onComplete?: (onBoardingData: OnBoardingFormData) => void;
};

const Steps: React.FC<StepsProps> = ({ onComplete }) => {
  return <App onComplete={onComplete} />;
};
export default Steps;

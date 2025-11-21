import { App } from "./src";
import { OnBoardingFormData } from "./src/types";

export type StepsProps = {
  onComplete?: (onBoardingData: OnBoardingFormData) => void;
};

const Steps: React.FC<StepsProps> = ({ onComplete }) => {
  return <App onComplete={onComplete} />;
};
export default Steps;

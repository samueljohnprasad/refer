import { useRouter } from "expo-router";
import { App } from "./src";
import { OnBoardingFormData } from "./src/types";
import useNotifications from "@/hooks/data/useNotifications";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useAtom } from "jotai";
import { cfgAtom } from "../notifications";


const Steps: React.FC = () => {
  const router = useRouter();
  const [cfg] = useAtom(cfgAtom);
  const { addNotifications } = useNotifications();

  const { markCompleted } = useCompleteOnboarding();

  const handleComplete = async (
    onBoardingData: OnBoardingFormData
  ): Promise<void> => {
    try {
      await markCompleted({ ...onBoardingData, cfg });
      await addNotifications();
      router.replace("/tabs/(tabs)/home");
    } catch (error) {
      throw error;
    }
  };

  return <App onComplete={handleComplete} />;
};
export default Steps;

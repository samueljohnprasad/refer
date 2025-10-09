import { View, Text } from "react-native";
import React from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { AirbnbFlipInteraction } from "@/screens/components/animations/airbnb-flip-interaction";
import { ParticlesButton } from "@/screens/components/animations/particles-button";
import { ComposableTextScreen } from "@/screens/components/animations/composable-text";
import { FluidTabInteraction } from "@/screens/components/animations/fluid-tab-interaction";
import { VerificationCodeFace } from "@/screens/components/animations/verification-code-face";
import { DeleteButton } from "@/screens/components/animations/delete-button";
import { IMessageStack } from "@/screens/components/animations/imessage-stack";
import { StackedBottomSheet } from "@/screens/components/animations/stacked-bottom-sheet";
import { VerificationCode } from "@/screens/components/animations/verification-code";
import { LoadingButton } from "@/screens/components/animations/loading-button";
import { Steps } from "@/screens/components/animations/steps";
import { NameInput } from "@/screens/components/animations/name-input";
import NotificationsUI from "@/screens/components/NotificationsUI";

const comps = {
  0: "airbnb",
  1: "button-particle",
  2: "composable-text",
  3: "fluid-tab-interaction",
  4: "verification-code-face",
  5: "delete-button",
  6: "imessage-stack",
  7: "stacked-bottom-sheet",
  8: "verification-code",
  9: "loading-button",
  10: "steps",
  11: "name-input",
  12: "notifications",
};
const Animations = () => {
  const [state, setState] = React.useState(0);
  return (
    <View className="flex-1  relative w-full">
      {!!!state && (
        <View className="gap-3 mt-20">
          {[...Array(Object.keys(comps).length)].map((_, i) => (
            <Button key={i} onPress={() => setState(i + 1)}>
              <ButtonText>{comps[i as keyof typeof comps]}</ButtonText>
            </Button>
          ))}
        </View>
      )}
      {/* {!!state && (
        <Button className="absolute top-14 z-10" onPress={() => setState(0)}>
          <ButtonText>airbnb</ButtonText>
        </Button>
      )} */}
      {state === 1 && <AirbnbFlipInteraction />}
      {state === 2 && <ParticlesButton />}
      {state === 3 && <ComposableTextScreen />}
      {state === 4 && <FluidTabInteraction />}
      {state === 5 && <VerificationCodeFace />}
      {state === 6 && <DeleteButton />}
      {state === 7 && <IMessageStack />}
      {state === 8 && <StackedBottomSheet />}
      {state === 9 && <VerificationCode />}
      {state === 10 && <LoadingButton />}
      {state === 11 && <Steps />}
      {state === 12 && <NameInput />}
      {state === 13 && <NotificationsUI />}
    </View>
  );
};

export default Animations;

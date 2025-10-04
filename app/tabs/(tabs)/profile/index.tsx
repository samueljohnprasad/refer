import Paywall from "@/screens/paywall/Paywall";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import { InsightsType } from "@/network/genAi";
import NameEditScreen from "@/screens/EditName";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";

import { Text, View } from "@/components/Themed";
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Center } from "@/components/ui/center";
import { Modal } from "react-native";
import { AirbnbFlipInteraction } from "@/screens/components/animations/airbnb-flip-interaction";
import Animations from "../../pages/Animations";
import AppOnboarding from "@/screens/OnboardingStepper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Steps } from "@/screens/components/animations/steps";

export default function Example() {
  const [showModal, setShowModal] = React.useState(0);
  return (
    <View className="flex-1 justify-center items-center">
      {/* <Animations /> */}
      <Button onPress={() => setShowModal(1)}>
        <ButtonText>animations</ButtonText>
      </Button>
      <Button onPress={() => setShowModal(2)}>
        <ButtonText>onboarding</ButtonText>
      </Button>
      <Modal visible={!!showModal}>
        {showModal === 1 && <Animations />}
        {showModal === 2 && <AppOnboarding />}
      </Modal>
    </View>
  );
}

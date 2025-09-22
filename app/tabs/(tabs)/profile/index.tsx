import Paywall from "@/screens/paywall/Paywall";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import { InsightsType } from "@/network/genAi";
import NameEditScreen from "@/screens/EditName";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";

import { Text } from "@/components/Themed";
import React from "react";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Center } from "@/components/ui/center";
import { Modal } from "react-native";

export default function Example() {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Center className="flex-1 justify-center items-center">
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Open Modal</ButtonText>
      </Button>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <NameEditScreen setShowModal={setShowModal} />
      </Modal>
    </Center>
  );
}

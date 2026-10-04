import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/Text";
import { useTranslation } from "react-i18next";

export default function ModalScreen() {
  const { t } = useTranslation("common");
  return (
    <Box className=" flex flex-1 items-center justify-center">
      <Text className="text-xl font-bold">{t("shell.modal")}</Text>
      <Box className="my-[30px] h-1 w-[80%]" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Box>
  );
}

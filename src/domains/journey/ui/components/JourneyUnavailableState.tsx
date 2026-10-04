import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "@/src/components/tw";

import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface JourneyUnavailableStateProps {
  hasError: boolean;
  onRetry: () => void;
  onExploreCatalog?: () => void;
}

export default function JourneyUnavailableState({
  hasError,
  onRetry,
  onExploreCatalog,
}: JourneyUnavailableStateProps): React.JSX.Element {
  const { t } = useTranslation("journeys");
  return (
    <SafeAreaView className="flex-1 bg-brand-canvas px-8">
      <View className="flex-1 items-center justify-center pb-16">
        <Text variant="h1" className="text-center">
          {hasError ? t("loadErrorTitle") : t("noJourneyTitle")}
        </Text>
        <Text variant="body" className="mt-3 max-w-[290px] text-center">
          {hasError
            ? t("connectionError")
            : t("startJourneyPrompt")}
        </Text>
        {hasError ? (
          <View className="mt-8 w-full max-w-[300px]">
            <Button label={t("tryAgain")} onPress={onRetry} />
          </View>
        ) : onExploreCatalog ? (
          <View className="mt-8 w-full max-w-[300px]">
            <Button label={t("explore")} onPress={onExploreCatalog} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "@/src/components/tw";

import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";

interface JourneyUnavailableStateProps {
  hasError: boolean;
  onRetry: () => void;
}

export default function JourneyUnavailableState({
  hasError,
  onRetry,
}: JourneyUnavailableStateProps): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-brand-canvas px-8">
      <View className="flex-1 items-center justify-center pb-16">
        <Text variant="h1" className="text-center">
          {hasError ? "Journey could not load" : "No journey available"}
        </Text>
        <Text variant="body" className="mt-3 max-w-[290px] text-center">
          {hasError
            ? "Check your connection, then try again."
            : "Publish a course to make it available here."}
        </Text>
        {hasError ? (
          <View className="mt-8 w-full max-w-[300px]">
            <Button label="Try again" onPress={onRetry} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

import { ActivityIndicator, View } from "react-native";
import React, { Suspense } from "react";
import { SAGE } from "@/lib/tokens";

type SuspenseLoaderProps = {
  children: React.ReactNode;
};
const SuspensLoader: React.FC<SuspenseLoaderProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <View className="flex-1 w-full h-full items-center justify-center">
          <ActivityIndicator color={SAGE[500]} size="large" />
        </View>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspensLoader;

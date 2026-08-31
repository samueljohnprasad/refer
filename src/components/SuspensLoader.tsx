import { ActivityIndicator, View } from "react-native";
import React, { Suspense } from "react";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

type SuspenseLoaderProps = {
  children: React.ReactNode;
};
const SuspensLoader: React.FC<SuspenseLoaderProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <View className="flex-1 w-full h-full items-center justify-center">
          <ActivityIndicator color={SEMANTIC_COLORS.brand.primary} size="large" />
        </View>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspensLoader;

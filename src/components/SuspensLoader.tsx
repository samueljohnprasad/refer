import { ActivityIndicator, View } from "react-native";
import React, { Suspense } from "react";
import Loading from "./Loading";
import { isIOS } from "../utils/mood";

type SuspenseLoaderProps = {
  children: React.ReactNode;
};
const SuspensLoader: React.FC<SuspenseLoaderProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <View className="flex-1 w-full h-full items-center justify-center">
          {isIOS ? <Loading /> : <ActivityIndicator />}
        </View>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspensLoader;

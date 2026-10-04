import { View } from "react-native";
import Loading from "@/src/components/Loading";

export function ChartLoadingOverlay() {
  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 24,
      }}
    >
      <Loading />
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import { Mascot } from "@/src/components/ui/Mascot";

export const RecordMascotStage = React.memo(() => {
  return (
    <View className="items-center justify-center" pointerEvents="none">
      {/* ponytail: panda reduced ~18% (138px) with subtle soft halo to keep attention on prompt */}
      <View className="happy-mascot-stage h-[148px] w-[148px] items-center justify-center rounded-[38px] border-0 bg-sage-100/40">
        <Mascot state="panda-notes" size={138} />
      </View>
    </View>
  );
});

RecordMascotStage.displayName = "RecordMascotStage";

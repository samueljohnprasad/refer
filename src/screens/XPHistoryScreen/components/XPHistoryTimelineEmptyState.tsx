import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Mascot } from "@/src/components/ui/Mascot";

const XPHistoryTimelineEmptyState: React.FC = React.memo(() => {
  const { t } = useTranslation("common");

  return (
    <View className="items-center justify-center px-8 py-20">
      <View className="happy-mascot-stage h-20 w-20 items-center justify-center rounded-[28px]">
        <Mascot state="panda-notes" size={54} />
      </View>
      <Text className="happy-font-heading-bold mt-4 text-lg text-ink">
        {t("xp.noInsightsYet")}
      </Text>
      <Text className="happy-font-body-medium mt-1 text-center text-sm leading-5 text-ink-muted">
        {t("xp.noInsightsDescription")}
      </Text>
    </View>
  );
});

XPHistoryTimelineEmptyState.displayName = "XPHistoryTimelineEmptyState";

export default XPHistoryTimelineEmptyState;

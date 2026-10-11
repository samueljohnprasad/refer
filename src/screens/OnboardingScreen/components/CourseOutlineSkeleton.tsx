import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/src/components/ui/Skeleton";

export function CourseOutlineSkeleton(): React.JSX.Element {
  const { t } = useTranslation("onboarding");

  return (
    <View className="mt-2" accessibilityLabel={t("plan_reveal.loading_milestones")}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={index}
          className={`flex-row items-center gap-3 px-3 py-3.5 ${
            index === 0
              ? "rounded-2xl bg-sage-50"
              : "border-b border-sage-100"
          }`}
        >
          <Skeleton width={36} height={36} radius={18} />
          <View className="flex-1 gap-1.5">
            <Skeleton width="60%" height={16} radius={6} />
            <Skeleton width="40%" height={12} radius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

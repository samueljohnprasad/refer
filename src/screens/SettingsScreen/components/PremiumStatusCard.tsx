import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View, Platform } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle02Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons";
import type { CustomerInfo } from "react-native-purchases";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Card } from "@/src/components/ui/Card";

let SwiftUIImage: any = null;
let SwiftUIHost: any = null;
if (Platform.OS === "ios") {
  try {
    const swiftui = require("@expo/ui/swift-ui");
    SwiftUIImage = swiftui.Image;
    SwiftUIHost = swiftui.Host;
  } catch {
    // Fallback if not available
  }
}

interface PremiumStatusCardProps {
  customerInfo: CustomerInfo | null;
  isLoading: boolean;
}

const PREMIUM_ENTITLEMENT_ID = "Premium journals";

const formatEntitlementDate = (dateString: string): string => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

export const PremiumStatusCard: React.FC<PremiumStatusCardProps> = ({
  customerInfo,
  isLoading,
}) => {
  const { t } = useTranslation("settings");
  const entitlement = customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];

  const statusLabel = useMemo(() => {
    if (isLoading) return t("premium.checking");
    if (!entitlement) return t("premium.active");
    if (!entitlement.expirationDate) return t("premium.lifetime");

    const dateLabel = formatEntitlementDate(entitlement.expirationDate);
    return entitlement.willRenew
      ? t("premium.renews", { date: dateLabel })
      : t("premium.activeUntil", { date: dateLabel });
  }, [entitlement, isLoading, t]);

  return (
    <Card
      variant="tile"
      radius="xl"
      showDepth={true}
      className="mx-5 mb-5"
      contentClassName="p-4"
    >
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-gold/15">
          {Platform.OS === "ios" && SwiftUIImage && SwiftUIHost ? (
            <SwiftUIHost matchContents>
              <SwiftUIImage
                systemName="crown.fill"
                size={22}
                color="#EAB308"
              />
            </SwiftUIHost>
          ) : (
            <HugeiconsIcon
              icon={CrownIcon}
              size={25}
              color={SEMANTIC_COLORS.warning.foreground}
              strokeWidth={1.8}
            />
          )}
        </View>

        <View className="flex-1">
          <View className="mb-1 flex-row items-center gap-2">
            <Text className="happy-font-body-bold text-[17px] text-ink">
              {t("premium.activeTitle")}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color={SEMANTIC_COLORS.brand.pressed} />
            ) : (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                color={SEMANTIC_COLORS.brand.pressed}
                strokeWidth={2}
              />
            )}
          </View>

          <Text className="happy-font-body-medium text-[14px] leading-5 text-ink-muted">
            {t("premium.status", { status: statusLabel })}
          </Text>
        </View>
      </View>
    </Card>
  );
};

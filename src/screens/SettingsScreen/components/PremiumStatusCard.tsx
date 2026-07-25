import React, { useMemo } from "react";
import { ActivityIndicator, Text, View, Platform } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle02Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons";
import type { CustomerInfo } from "react-native-purchases";
import { GOLD, SAGE } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";

let SwiftUIImage: any = null;
let SwiftUIHost: any = null;
if (Platform.OS === "ios") {
  try {
    const swiftui = require("@expo/ui/swift-ui");
    SwiftUIImage = swiftui.Image;
    SwiftUIHost = swiftui.Host;
  } catch (e) {
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
  const entitlement = customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];

  const statusLabel = useMemo(() => {
    if (isLoading) return "Checking Premium status";
    if (!entitlement) return "Premium is active";
    if (!entitlement.expirationDate) return "Lifetime Premium access";

    const dateLabel = formatEntitlementDate(entitlement.expirationDate);
    return entitlement.willRenew
      ? `Renews ${dateLabel}`
      : `Active until ${dateLabel}`;
  }, [entitlement, isLoading]);

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
              color={GOLD}
              strokeWidth={1.8}
            />
          )}
        </View>

        <View className="flex-1">
          <View className="mb-1 flex-row items-center gap-2">
            <Text className="happy-font-body-bold text-[17px] text-ink">
              Premium Active
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color={SAGE[600]} />
            ) : (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                color={SAGE[600]}
                strokeWidth={2}
              />
            )}
          </View>

          <Text className="happy-font-body-medium text-[14px] leading-5 text-ink-muted">
            {statusLabel}. All Premium features are unlocked.
          </Text>
        </View>
      </View>
    </Card>
  );
};

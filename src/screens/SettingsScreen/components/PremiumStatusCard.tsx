import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle02Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons";
import type { CustomerInfo } from "react-native-purchases";

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
    <LinearGradient
      colors={["#FFF7ED", "#F5F3FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#E9D5FF",
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#7C5CFF",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
        elevation: 3,
      }}
    >
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: "#7C5CFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HugeiconsIcon
            icon={CrownIcon}
            size={25}
            color="#FFFFFF"
            strokeWidth={1.8}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: "#1F2937",
                fontSize: 17,
                fontWeight: "900",
              }}
            >
              Premium Active
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#7C5CFF" />
            ) : (
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                color="#16A34A"
                strokeWidth={2}
              />
            )}
          </View>

          <Text
            style={{
              color: "#64748B",
              fontSize: 13,
              lineHeight: 18,
              fontWeight: "600",
            }}
          >
            {statusLabel}. All Premium features are unlocked.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};


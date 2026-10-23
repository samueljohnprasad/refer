import React, { useCallback } from "react";
import { View } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import type { PricingTier } from "../types";

interface SoftPaywallStepProps {
  selectedTier?: PricingTier;
  onSelectTier: (tier: PricingTier) => void;
  onStartTrial: () => void;
  onContinueFree: () => void;
}

const SoftPaywallStep: React.FC<SoftPaywallStepProps> = ({
  onStartTrial,
  onContinueFree,
}) => {
  const { registerPurchasedCustomer } = useRevenueCat();

  const handleAccessGranted = useCallback(
    (customerInfo: Parameters<typeof registerPurchasedCustomer>[0]): void => {
      if (registerPurchasedCustomer(customerInfo)) {
        onStartTrial();
      }
    },
    [onStartTrial, registerPurchasedCustomer],
  );

  return (
    <View className="flex-1 bg-surface-canvas">
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        options={{ displayCloseButton: true }}
        onPurchaseCompleted={({ customerInfo }) =>
          handleAccessGranted(customerInfo)
        }
        onRestoreCompleted={({ customerInfo }) =>
          handleAccessGranted(customerInfo)
        }
        onDismiss={onContinueFree}
      />
    </View>
  );
};

export default React.memo(SoftPaywallStep);

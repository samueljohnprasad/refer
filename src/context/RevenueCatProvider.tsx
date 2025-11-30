import { Platform, Text, View } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import { useAuth } from "./AuthContext";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

interface RevenueCatContextValue {
  customerInfo: CustomerInfo | null;
  isLoadingRevenueCat: boolean;
  hasPro: boolean;
  presentPaywall: () => Promise<boolean>;
}

const apiKey = Platform.select({
  ios: "appl_vziHsnYOgSMjzwblNQBZlcvuNAo",
  android: "test_uplWOSJiaUBXqOcHZzthmJvPxNI",
});

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined
);

export const useRevenueCat = () => {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) {
    throw new Error("useRevenueCat must be used inside RevenueCatProvider");
  }
  return ctx;
};

const RevenueCatProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoadingRevenueCat, setIsLoadingRevenueCat] = useState<boolean>(true);
  const [hasPro, setHasPro] = useState<boolean>(false);
  const { user } = useAuth();

  async function presentPaywall(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all["journal"];

      if (!offering) {
        return false;
      }

      const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
        offering: offering,
      });

      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          return false;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          setHasPro(true);
          return true;
        default:
          return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function presentPaywallIfNeeded() {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.all["journal"];

    if (!offering) {
      return false;
    }

    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Premium journals",
      });
  }

  const hasProHandler = (customerInfo: CustomerInfo) => {
    if (
      typeof customerInfo?.entitlements.active["Premium journals"] !==
      "undefined"
    ) {
      // Grant user "pro" access
      setHasPro(true);
    }
  };
  useEffect(() => {
    if (!user?.id) return;

    if (!apiKey) {
      throw new Error("RevenueCat API key not found");
    }

    Purchases.configure({ apiKey: apiKey, appUserID: user.id });
    const fetchInfo = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        setCustomerInfo(customerInfo);

        hasProHandler(customerInfo);
      } catch (e) {
      } finally {
        setIsLoadingRevenueCat(false);
      }
    };
    fetchInfo();

    const customerInfoUpdated = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, [user?.id]);

  return (
    <RevenueCatContext.Provider
      value={{
        customerInfo,
        isLoadingRevenueCat,
        hasPro,
        presentPaywall,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};

export default RevenueCatProvider;

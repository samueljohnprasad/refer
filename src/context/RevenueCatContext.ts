// ponytail: extracted context and hook for RevenueCat to keep files < 300 lines
import { createContext, useContext } from "react";
import type { CustomerInfo } from "react-native-purchases";

export interface RevenueCatContextValue {
  customerInfo: CustomerInfo | null;
  isLoadingRevenueCat: boolean;
  hasPro: boolean;
  presentPaywall: (source?: string) => Promise<boolean>;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
  identifyCurrentUser: (userId: string) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  registerPurchasedCustomer: (info: CustomerInfo) => boolean;
  getAppUserID: () => Promise<string | null>;
  shouldPromptAccountClaim: boolean;
  dismissAccountClaimPrompt: () => void;
}

export const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined,
);

export const useRevenueCat = (): RevenueCatContextValue => {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) {
    throw new Error("useRevenueCat must be used inside RevenueCatProvider");
  }
  return ctx;
};

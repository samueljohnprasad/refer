import { Platform } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Purchases, { CustomerInfo, LOG_LEVEL } from "react-native-purchases";
import { useAuth } from "./AuthContext";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

interface RevenueCatContextValue {
  customerInfo: CustomerInfo | null;
  isLoadingRevenueCat: boolean;
  hasPro: boolean;
  presentPaywall: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
  identifyCurrentUser: (userId: string) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  getAppUserID: () => Promise<string | null>;
  shouldPromptAccountClaim: boolean;
  dismissAccountClaimPrompt: () => void;
}

const apiKey = Platform.select({
  ios: "appl_vziHsnYOgSMjzwblNQBZlcvuNAo",
  android: "test_uplWOSJiaUBXqOcHZzthmJvPxNI",
});

const isPurchaseCancelledError = (error: unknown): boolean => {
  const maybeError = error as {
    code?: string | number;
    message?: string;
    userCancelled?: boolean;
  };
  const haystack = [
    maybeError?.code,
    maybeError?.message,
    error instanceof Error ? error.message : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    maybeError?.userCancelled === true ||
    haystack.includes("purchasecancelled") ||
    haystack.includes("purchase cancelled") ||
    haystack.includes("purchase was cancelled") ||
    (haystack.includes("purchase") && haystack.includes("cancelled"))
  );
};

const revenueCatLogHandler = (
  logLevel: LOG_LEVEL,
  message: string,
): void => {
  const formattedMessage = `[RevenueCat] ${message}`;

  if (logLevel === LOG_LEVEL.ERROR && isPurchaseCancelledError({ message })) {
    console.info(formattedMessage);
    return;
  }

  switch (logLevel) {
    case LOG_LEVEL.DEBUG:
      console.debug(formattedMessage);
      return;
    case LOG_LEVEL.INFO:
      console.info(formattedMessage);
      return;
    case LOG_LEVEL.WARN:
      console.warn(formattedMessage);
      return;
    case LOG_LEVEL.ERROR:
      console.error(formattedMessage);
      return;
    default:
      console.log(formattedMessage);
  }
};

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
  const [shouldPromptAccountClaim, setShouldPromptAccountClaim] =
    useState<boolean>(false);
  const { user, isAnonymous } = useAuth();
  const isConfiguredRef = useRef<boolean>(false);
  const identifiedUserIdRef = useRef<string | null>(null);

  const hasProHandler = (info: CustomerInfo | null): boolean => {
    const nextHasPro =
      typeof info?.entitlements.active["Premium journals"] !== "undefined";
    setHasPro(nextHasPro);
    return nextHasPro;
  };

  const refreshCustomerInfo = async (): Promise<CustomerInfo | null> => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      hasProHandler(info);
      return info;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsLoadingRevenueCat(false);
    }
  };

  const identifyCurrentUser = async (
    userId: string,
  ): Promise<CustomerInfo | null> => {
    try {
      const result = await Purchases.logIn(userId);
      identifiedUserIdRef.current = userId;
      setCustomerInfo(result.customerInfo);
      hasProHandler(result.customerInfo);
      return result.customerInfo;
    } catch (e) {
      console.error(e);
      await refreshCustomerInfo();
      return null;
    }
  };

  const restorePurchases = async (): Promise<CustomerInfo | null> => {
    try {
      setIsLoadingRevenueCat(true);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      hasProHandler(info);
      return info;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsLoadingRevenueCat(false);
    }
  };

  const getAppUserID = async (): Promise<string | null> => {
    try {
      return await Purchases.getAppUserID();
    } catch {
      return null;
    }
  };

  async function presentPaywall(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.current;

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
          await refreshCustomerInfo();
          if (isAnonymous) {
            setShouldPromptAccountClaim(true);
          }
          return true;
        default:
          return false;
      }
    } catch (e) {
      if (!isPurchaseCancelledError(e)) {
        console.error(e);
      }
      return false;
    }
  }

  async function presentPaywallIfNeeded(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.current;

      if (!offering) {
        return false;
      }

      const paywallResult: PAYWALL_RESULT =
        await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: "Premium journals",
        });

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          setHasPro(true);
          await refreshCustomerInfo();
          if (isAnonymous) {
            setShouldPromptAccountClaim(true);
          }
          return true;
        default:
          return false;
      }
    } catch (e) {
      if (!isPurchaseCancelledError(e)) {
        console.error(e);
      }
      return false;
    }
  }

  useEffect(() => {
    if (!apiKey) {
      throw new Error("RevenueCat API key not found");
    }

    if (!isConfiguredRef.current) {
      Purchases.setLogHandler(revenueCatLogHandler);
      Purchases.configure({ apiKey: apiKey });
      isConfiguredRef.current = true;
    }

    refreshCustomerInfo();

    const customerInfoUpdated = (info: CustomerInfo) => {
      setCustomerInfo(info);
      hasProHandler(info);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);

  useEffect(() => {
    if (!isConfiguredRef.current || !user?.id) return;

    if (isAnonymous) {
      if (identifiedUserIdRef.current) {
        Purchases.logOut()
          .then((info) => {
            identifiedUserIdRef.current = null;
            setCustomerInfo(info);
            hasProHandler(info);
          })
          .catch(console.error);
      }
      return;
    }

    if (identifiedUserIdRef.current === user.id) return;

    identifyCurrentUser(user.id).catch(console.error);
  }, [isAnonymous, user?.id]);

  return (
    <RevenueCatContext.Provider
      value={{
        customerInfo,
        isLoadingRevenueCat,
        hasPro,
        presentPaywall,
        refreshCustomerInfo,
        identifyCurrentUser,
        restorePurchases,
        getAppUserID,
        shouldPromptAccountClaim,
        dismissAccountClaimPrompt: () => setShouldPromptAccountClaim(false),
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};

export default RevenueCatProvider;

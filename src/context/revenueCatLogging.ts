import { LOG_LEVEL } from "react-native-purchases";

export const isPurchaseCancelledError = (error: unknown): boolean => {
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

export const revenueCatLogHandler = (
  logLevel: LOG_LEVEL,
  message: string,
): void => {
  const formattedMessage = `[RevenueCat] ${message}`;

  if (logLevel === LOG_LEVEL.ERROR && isPurchaseCancelledError({ message })) {
    console.info(formattedMessage);
    return;
  }

  if (
    logLevel === LOG_LEVEL.ERROR &&
    /operation is already in progress|error when syncing subscriber attributes/i.test(
      message,
    )
  ) {
    console.warn(formattedMessage);
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

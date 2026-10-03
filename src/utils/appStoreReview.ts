// ponytail: minimal App Store review launcher using direct product page deep link (Apple HIG compliant)
import { Linking } from "react-native";

export const APP_STORE_ID = "6755650433";
export const APP_STORE_REVIEW_URL = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;

/**
 * Opens App Store product review composer directly.
 * Permitted for voluntary user-initiated button taps (e.g. in Settings).
 */
export async function openAppStoreReview(): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(APP_STORE_REVIEW_URL);
    if (supported) {
      await Linking.openURL(APP_STORE_REVIEW_URL);
    }
  } catch (error) {
    console.warn("[appStoreReview] Failed to open review URL:", error);
  }
}

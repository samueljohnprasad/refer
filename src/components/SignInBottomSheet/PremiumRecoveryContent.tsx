import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import type { PremiumRecoveryState } from "./useSignInBottomSheetController";

interface PremiumRecoveryContentProps {
  recovery: PremiumRecoveryState;
  busyRestore: boolean;
  onRetryRestore: () => void;
  onContinue: () => void;
}

export default function PremiumRecoveryContent({
  recovery,
  busyRestore,
  onRetryRestore,
  onContinue,
}: PremiumRecoveryContentProps) {
  const { t } = useTranslation("settings");
  const isClaim = recovery.reason === "claim";

  return (
    <View className="flex-1 justify-between">
      <View>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-center text-[20px] mb-2 text-ink"
        >
          {t(isClaim ? "accountAuth.recovery.refreshTitle" : "accountAuth.recovery.restoreTitle")}
        </Text>
        <Text variant="body" className="text-center mb-5 leading-[22px]">
          {t(isClaim ? "accountAuth.recovery.claimDescription" : "accountAuth.recovery.moveDescription")}
        </Text>
        <Card
          variant="tile"
          radius="lg"
          showDepth={false}
          className="mb-5 bg-brand-surface-soft border border-brand-border"
          contentClassName="p-4 gap-2"
        >
          <Text variant="eyebrow">{t("accountAuth.recovery.revenueCatId")}</Text>
          <Text variant="label" className="text-ink-soft select-text">
            {recovery.appUserID ?? t("accountAuth.recovery.unavailable")}
          </Text>
          <Text variant="eyebrow" className="mt-2">
            {t("accountAuth.recovery.supabaseId")}
          </Text>
          <Text variant="label" className="text-ink-soft select-text">
            {recovery.supabaseUserId}
          </Text>
        </Card>
      </View>
      <View className="gap-3">
        <Button
          label={t("accountAuth.recovery.tryRestoreAgain")}
          variant="primary"
          onPress={onRetryRestore}
          loading={busyRestore}
          fullWidth
        />
        <Button
          label={t(isClaim ? "accountAuth.recovery.continue" : "accountAuth.recovery.continueWithoutPremium")}
          variant="secondary"
          onPress={onContinue}
          disabled={busyRestore}
          fullWidth
        />
      </View>
    </View>
  );
}

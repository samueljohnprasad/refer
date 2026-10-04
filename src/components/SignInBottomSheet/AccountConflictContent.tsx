import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";

interface AccountConflictContentProps {
  hasPro: boolean;
  providerLabel: string;
  busyMove: boolean;
  onStay: () => void;
  onMove: () => void;
}

export default function AccountConflictContent({
  hasPro,
  providerLabel,
  busyMove,
  onStay,
  onMove,
}: AccountConflictContentProps) {
  const { t } = useTranslation("settings");
  const title = hasPro
    ? "accountAuth.conflict.premiumTitle"
    : "accountAuth.conflict.existingTitle";

  return (
    <View className="flex-1 justify-between">
      <View>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.bold }}
          className="text-center text-[20px] mb-2 text-ink"
        >
          {t(title)}
        </Text>
        <Text variant="body" className="text-center leading-[22px]">
          {t(
            hasPro
              ? "accountAuth.conflict.premiumDescription"
              : "accountAuth.conflict.description",
            { provider: providerLabel },
          )}
        </Text>
      </View>
      <View className="gap-3">
        <Button
          label={t(hasPro ? "accountAuth.conflict.keepPremium" : "accountAuth.conflict.continueExisting")}
          variant="primary"
          onPress={hasPro ? onStay : onMove}
          loading={busyMove && !hasPro}
          disabled={busyMove}
          fullWidth
        />
        <Button
          label={t(hasPro ? "accountAuth.conflict.moveExisting" : "accountAuth.conflict.stayCurrent")}
          variant="secondary"
          onPress={hasPro ? onMove : onStay}
          loading={busyMove && hasPro}
          disabled={busyMove}
          fullWidth
        />
      </View>
    </View>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { subDays } from "date-fns";
import { useBulkImportJournals } from "@/hooks/post/useBulkImportJournals";

export const useSettingsBulkImport = () => {
  const { t } = useTranslation("settings");
  const { bulkImport, importing, progress } = useBulkImportJournals();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDaysCount, setImportDaysCount] = useState("20");
  const [importStartDate] = useState<Date>(subDays(new Date(), 10));

  const handleBulkImport = async () => {
    const count = parseInt(importDaysCount);
    if (isNaN(count) || count <= 0 || count > 20) {
      Alert.alert(t("bulkImport.invalidTitle"), t("bulkImport.invalidMessage"));
      return;
    }

    try {
      await bulkImport(importStartDate, count);
      Alert.alert(t("bulkImport.successTitle"), t("bulkImport.successMessage", { count }));
      setShowImportModal(false);
    } catch (error: any) {
      Alert.alert(t("bulkImport.errorTitle"), t("bulkImport.errorMessage", { error: error?.message || JSON.stringify(error) }));
    }
  };

  return {
    showImportModal,
    setShowImportModal,
    importDaysCount,
    setImportDaysCount,
    importStartDate,
    importing,
    progress,
    handleBulkImport,
  };
};

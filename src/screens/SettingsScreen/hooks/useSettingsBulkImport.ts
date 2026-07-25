import { useState } from "react";
import { Alert } from "react-native";
import { subDays } from "date-fns";
import { useBulkImportJournals } from "@/hooks/post/useBulkImportJournals";

export const useSettingsBulkImport = () => {
  const { bulkImport, importing, progress } = useBulkImportJournals();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDaysCount, setImportDaysCount] = useState("20");
  const [importStartDate] = useState<Date>(subDays(new Date(), 10));

  const handleBulkImport = async () => {
    const count = parseInt(importDaysCount);
    if (isNaN(count) || count <= 0 || count > 20) {
      Alert.alert("Invalid Count", "Please enter a number between 1 and 20");
      return;
    }

    try {
      await bulkImport(importStartDate, count);
      Alert.alert("Success", `Successfully imported ${count} journal entries!`);
      setShowImportModal(false);
    } catch (error: any) {
      Alert.alert("Error", `Failed to import journals: ${error?.message || JSON.stringify(error)}`);
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

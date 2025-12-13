import { useState, useEffect, useCallback, useRef } from "react";
import VersionCheck from "react-native-version-check";

interface UseAppUpdateReturn {
  showUpdateModal: boolean;
  currentVersion?: string;
  latestVersion?: string;
  showModal: () => void;
  hideModal: () => void;
  checkForUpdates: () => Promise<void>;
  isChecking: boolean;
}

interface UseAppUpdateOptions {
  autoCheck?: boolean;
}

export function useAppUpdate(
  options: UseAppUpdateOptions = {}
): UseAppUpdateReturn {
  const { autoCheck = true } = options;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [latestVersion, setLatestVersion] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);

  // Track if we've already checked for updates
  const hasCheckedRef = useRef(false);

  const checkForUpdates = useCallback(async () => {
    if (isChecking) return;

    try {
      setIsChecking(true);
      const current = VersionCheck.getCurrentVersion();
      const latest = await VersionCheck.getLatestVersion();

      setCurrentVersion(current);
      setLatestVersion(latest);

      const updateNeeded = await VersionCheck.needUpdate();

      if (updateNeeded.isNeeded) {
        console.log("isVisible Update needed");
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  useEffect(() => {
    // Only check once per app session
    if (autoCheck && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkForUpdates();
    }
  }, [autoCheck, checkForUpdates]);

  const showModal = useCallback(() => setShowUpdateModal(true), []);
  const hideModal = useCallback(() => setShowUpdateModal(false), []);

  return {
    showUpdateModal,
    currentVersion,
    latestVersion,
    showModal,
    hideModal,
    checkForUpdates,
    isChecking,
  };
}

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
  const { autoCheck = false } = options;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [latestVersion, setLatestVersion] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);

  const hasCheckedRef = useRef(false);

  const checkForUpdates = useCallback(async () => {
    if (isChecking) return;

    try {
      setIsChecking(true);
      const current = VersionCheck.getCurrentVersion();
      const latest = await VersionCheck.getLatestVersion({
        packageName: "com.samuelprasad.happy",
        ignoreErrors: true,
      });

      setCurrentVersion(current);
      setLatestVersion(latest);

      const updateNeeded = await VersionCheck.needUpdate({
        currentVersion: current,
        latestVersion: latest,
      });

      if (updateNeeded?.isNeeded) {
        setShowUpdateModal(true);
      }
      // If we are in dev and want to force test it, we could do something here, but let's stick to the real logic.
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  useEffect(() => {
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

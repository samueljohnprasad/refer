// ponytail: native version check using expo-application and iTunes lookup
import { useState, useEffect, useCallback, useRef } from "react";
import * as Application from "expo-application";
import Constants from "expo-constants";

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

// ponytail: minimal semver comparison without external dependencies
function isNewerVersion(latest: string, current: string): boolean {
  if (typeof latest !== "string" || typeof current !== "string") return false;
  const l = latest.split(".").map((n) => parseInt(n, 10) || 0);
  const c = current.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(l.length, c.length); i++) {
    const lNum = l[i] ?? 0;
    const cNum = c[i] ?? 0;
    if (lNum > cNum) return true;
    if (lNum < cNum) return false;
  }
  return false;
}

function resolveCurrentAppVersion(): string {
  return (
    Application.nativeApplicationVersion ??
    Constants.expoConfig?.version ??
    "1.0.0"
  );
}

async function fetchLatestAppStoreVersion(bundleId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?bundleId=${bundleId}&date=${Date.now()}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.version ?? null;
  } catch {
    return null;
  }
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
      const current = resolveCurrentAppVersion();
      setCurrentVersion(current);

      const latest = await fetchLatestAppStoreVersion("com.samuelprasad.happy");
      if (!latest) return;

      setLatestVersion(latest);
      if (isNewerVersion(latest, current)) {
        setShowUpdateModal(true);
      }
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

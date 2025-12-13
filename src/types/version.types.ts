export interface VersionInfo {
  currentVersion: string;
  latestVersion: string;
  needsUpdate: boolean;
}

export interface VersionCheckService {
  getCurrentVersion: () => string;
  getLatestVersion: () => Promise<string>;
  needUpdate: (params: {
    currentVersion: string;
    latestVersion: string;
  }) => boolean;
}

export interface UpdateModalConfig {
  autoCheck?: boolean;
  checkInterval?: number;
  autoShow?: boolean;
  appStoreUrl?: string;
}

export type ReactNativeVersionCheck = {
  getCurrentVersion: () => string;
  getLatestVersion: (options?: {
    provider?: "appStore" | "playStore";
    packageName?: string;
    ignoreErrors?: boolean;
  }) => Promise<string>;
  needUpdate: (options?: {
    currentVersion?: string;
    latestVersion?: string;
    depth?: number;
  }) => Promise<{
    isNeeded: boolean;
    currentVersion: string;
    latestVersion: string;
  }>;
};

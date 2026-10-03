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

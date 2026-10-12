import { Session, User } from "@supabase/supabase-js";

import type { AccountConflict } from "@/context/AuthContext";

export type IdentityLinkResultV1 =
  | {
      status: "linked";
      operationId: string;
      anonymousUserId: string;
      effectiveUserId: string;
      retryable: false;
      session: Session;
      user: User;
    }
  | {
      status: "recovery_required";
      operationId: string;
      anonymousUserId: string;
      effectiveUserId: string;
      retryable: false;
      conflict: AccountConflict;
    }
  | {
      status: "cancelled";
      operationId: string;
      anonymousUserId: string;
      effectiveUserId: string;
      retryable: false;
    }
  | {
      status: "retryable_failure";
      operationId: string;
      anonymousUserId: string;
      effectiveUserId: string;
      retryable: true;
      error: unknown;
    }
  | {
      status: "failed";
      operationId: string;
      anonymousUserId: string;
      effectiveUserId: string;
      retryable: false;
      error: unknown;
    };

export const createIdentityLinkOperationId = (): string =>
  `identity-link-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const isRetryableIdentityLinkError = (error: unknown): boolean => {
  const value = error as { code?: string; name?: string; message?: string };
  const text = [value?.code, value?.name, value?.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return ["network", "timeout", "temporarily", "fetch", "503", "502", "504"].some(
    (marker) => text.includes(marker),
  );
};


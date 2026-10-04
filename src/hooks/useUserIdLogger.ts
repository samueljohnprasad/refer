// ponytail: logs active user ID on startup and auth changes
import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("Auth");

export function useUserIdLogger(): void {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (user?.id) {
      const isAnon = Boolean(user.is_anonymous);
      const text = `User ID: ${user.id} (anonymous: ${isAnon})`;
      log.info(`[Auth] ${text}`);
      console.log(`🔑 [Auth] ${text}`);
    } else {
      log.info("[Auth] No active user session");
      console.log("🔑 [Auth] No active user session");
    }
  }, [user?.id, user?.is_anonymous, loading]);
}

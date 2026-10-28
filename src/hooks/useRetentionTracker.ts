// ponytail: lightweight D0-D7 cohort and retention lifecycle tracker
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePostHog } from "posthog-react-native";
import * as Application from "expo-application";
import { posthog } from "@/src/config/posthog";

const STORAGE_FIRST_LAUNCH = "@happy:retention_first_launch_date";
const STORAGE_FLAGS = "@happy:retention_milestone_flags";

interface RetentionFlags {
  d0?: boolean;
  d1?: boolean;
  d3?: boolean;
  d7?: boolean;
}

export async function trackD0Milestone(
  milestone: "first_exercise" | "first_journal" | "onboarding",
): Promise<void> {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const firstLaunch = await AsyncStorage.getItem(STORAGE_FIRST_LAUNCH);
    if (!firstLaunch) return;

    const firstDate = new Date(firstLaunch).getTime();
    const currentDate = new Date(todayStr).getTime();
    const diffDays = Math.max(0, Math.floor((currentDate - firstDate) / 86400000));

    if (diffDays === 0) {
      posthog?.capture("d0_core_action_completed", {
        milestone,
        days_since_install: 0,
      });
      posthog?.capture("$set", {
        $set: {
          d0_activated: true,
          [`d0_${milestone}_completed`]: true,
        },
      });
    }
  } catch (err) {
    console.warn("[RetentionTracker] Failed to track D0 milestone:", err);
  }
}

export function useRetentionTracker(): void {
  const client = usePostHog();
  const isEvaluatingRef = useRef(false);

  useEffect(() => {
    if (!client) return;

    const evaluateCohort = async (): Promise<void> => {
      if (isEvaluatingRef.current) return;
      isEvaluatingRef.current = true;
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        let firstLaunch = await AsyncStorage.getItem(STORAGE_FIRST_LAUNCH);
        if (!firstLaunch) {
          firstLaunch = todayStr;
          await AsyncStorage.setItem(STORAGE_FIRST_LAUNCH, todayStr);
        }

        const firstDate = new Date(firstLaunch).getTime();
        const currentDate = new Date(todayStr).getTime();
        const diffDays = Math.max(0, Math.floor((currentDate - firstDate) / 86400000));

        const flagsRaw = await AsyncStorage.getItem(STORAGE_FLAGS);
        const flags: RetentionFlags = flagsRaw
          ? (JSON.parse(flagsRaw) as RetentionFlags)
          : {};

        // Update PostHog person properties
        client.capture("$set", {
          $set: {
            days_since_install: diffDays,
            day_cohort: `D${diffDays}`,
            is_d0: diffDays === 0,
            is_d3: diffDays === 3,
            last_active_date: todayStr,
          },
          $set_once: {
            first_launch_date: firstLaunch,
            initial_app_version:
              Application.nativeApplicationVersion || "unknown",
          },
        });

        // App session started with cohort metadata
        client.capture("app_session_started", {
          days_since_install: diffDays,
          day_cohort: `D${diffDays}`,
          is_d0: diffDays === 0,
          is_d1: diffDays === 1,
          is_d3: diffDays === 3,
          is_d7: diffDays === 7,
        });

        let updatedFlags = false;
        if (diffDays === 0 && !flags.d0) {
          client.capture("retention_d0_active", {
            first_launch_date: firstLaunch,
          });
          flags.d0 = true;
          updatedFlags = true;
        } else if (diffDays === 1 && !flags.d1) {
          client.capture("retention_d1_active", {
            first_launch_date: firstLaunch,
          });
          flags.d1 = true;
          updatedFlags = true;
        } else if (diffDays === 3 && !flags.d3) {
          client.capture("retention_d3_active", {
            first_launch_date: firstLaunch,
          });
          flags.d3 = true;
          updatedFlags = true;
        } else if (diffDays === 7 && !flags.d7) {
          client.capture("retention_d7_active", {
            first_launch_date: firstLaunch,
          });
          flags.d7 = true;
          updatedFlags = true;
        }

        if (updatedFlags) {
          await AsyncStorage.setItem(STORAGE_FLAGS, JSON.stringify(flags));
        }
      } catch (err) {
        console.warn("[RetentionTracker] Failed to evaluate cohort:", err);
      } finally {
        isEvaluatingRef.current = false;
      }
    };

    void evaluateCohort();

    const sub = AppState.addEventListener("change", (status: AppStateStatus) => {
      if (status === "active") {
        void evaluateCohort();
      }
    });

    return () => {
      sub.remove();
    };
  }, [client]);
}

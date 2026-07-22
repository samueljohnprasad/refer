import React, { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams, Link } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { startTransitionAtom, lastTransitionInfoAtom } from "@/src/store/transitionStore";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import { optimisticSetNodeStatus, setCourseProgress } from "@/src/domains/journey/state/journeySlice";
import { selectNode, selectExercisesForNode } from "@/src/domains/journey/state/journeySelectors";
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";
import { NodeEngine } from "@/src/components/node/NodeEngine";

export default function JourneyFlowRoute() {
  const { courseId, nodeId } = useLocalSearchParams<{ courseId: string; nodeId: string }>();
  const dispatch = useAppDispatch();
  const startTransition = useSetAtom(startTransitionAtom);

  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const node = useAppSelector((state) => selectNode(state, nodeId || ""));
  const exercises = useAppSelector((state) => selectExercisesForNode(state, nodeId || ""));
  const isLoading = !node;

  const lastTransitionInfo = useAtomValue(lastTransitionInfoAtom);

  const handleDismiss = useCallback(() => {
    if (lastTransitionInfo) {
      startTransition({
        isReversing: true,
        cx: lastTransitionInfo.cx,
        cy: lastTransitionInfo.cy,
        color: lastTransitionInfo.color,
      });
    }
    router.back();
  }, [lastTransitionInfo, startTransition]);

  const handleComplete = useCallback(
    async (responses: Record<string, any>) => {
      if (!nodeId || !courseId) return;
      
      try {
        await completeNode({ nodeId, courseId }).unwrap();
        dispatch(
          optimisticSetNodeStatus({
            nodeId,
            status: "completed",
          })
        );

        const progressResult = await dispatch(
          journeyApi.endpoints.getCourseProgress.initiate(courseId, {
            forceRefetch: true,
          })
        );
        if ("data" in progressResult && progressResult.data) {
          dispatch(setCourseProgress(progressResult.data));
        }

      } catch (e) {
        console.error("Failed to complete node:", e);
      } finally {
        handleDismiss();
      }
    },
    [nodeId, courseId, completeNode, dispatch, handleDismiss]
  );

  if (isLoading) {
    return (
      <View className="happy-brand-screen flex-1">
        <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
          <View className="flex-1">
            <View className="flex-row items-center justify-between px-5 pb-4 pt-4 mt-8">
              <Skeleton width={40} height={40} radius={20} />
              <View className="flex-1 mx-3 items-center">
                <Skeleton width={120} height={12} radius={6} />
              </View>
              <Skeleton width={60} height={24} radius={12} />
            </View>
            <View className="px-8 pb-4 pt-4 items-center">
              <Skeleton width={80} height={12} radius={6} className="mb-4" />
              <Skeleton width="80%" height={28} radius={8} className="mb-2" />
              <Skeleton width="60%" height={28} radius={8} className="mb-6" />
            </View>
            <View className="flex-1 px-7 mt-6 gap-4">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={2} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!nodeId) return null;

  return (
    <>
      <Stack.Screen options={{ presentation: 'fullScreenModal', headerShown: false, animation: 'fade' }} />
      <NodeEngine
        nodeId={nodeId}
        exercises={exercises}
        onNodeComplete={handleComplete}
        onClose={handleDismiss}
      />
    </>
  );
}

import React, { useCallback } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import {
  optimisticSetNodeStatus,
  setCourseProgress,
} from "@/src/domains/journey/state/journeySlice";
import {
  selectNode,
  selectExercisesForNode,
} from "@/src/domains/journey/state/journeySelectors";
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";
import { NodeEngineRouter } from "@/src/components/node/NodeEngineRouter";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { Text } from "@/src/components/ui/Text";
import { updateUserStreak } from "@/src/lib/api/mentalHealthJourneyApi";
import { useQueryClient } from "@tanstack/react-query";

export default function JourneyFlowRoute() {
  const { courseId, nodeId } = useLocalSearchParams<{
    courseId: string;
    nodeId: string;
  }>();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const node = useAppSelector((state) => selectNode(state, nodeId || ""));
  const exercises = useAppSelector((state) =>
    selectExercisesForNode(state, nodeId || ""),
  );
  const isLoading = !node;
  const learningSession = journeyApi.useStartLearningSessionQuery(
    { courseId: courseId || "", nodeId: nodeId || "" },
    { skip: !courseId || !nodeId || isLoading },
  );

  const handleDismiss = useCallback(() => {
    router.back();
  }, []);

  const handleComplete = useCallback(
    async (responses: Record<string, unknown>) => {
      if (!nodeId || !courseId) return;

      try {
        await completeNode({ nodeId, courseId, responses }).unwrap();
        await updateUserStreak();
        await queryClient.invalidateQueries({ queryKey: ["streak"] });
        dispatch(
          optimisticSetNodeStatus({
            nodeId,
            status: "completed",
          }),
        );

        const progressResult = await dispatch(
          journeyApi.endpoints.getCourseProgress.initiate(courseId, {
            forceRefetch: true,
          }),
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
    [
      nodeId,
      courseId,
      completeNode,
      dispatch,
      handleDismiss,
      queryClient,
    ],
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
  const sessionResult = learningSession.data;
  const routedExercises = sessionResult
    ? sessionResult.exerciseIds
        .map((exerciseId) =>
          exercises.find((exercise) => exercise.id === exerciseId),
        )
        .filter((exercise): exercise is NonNullable<typeof exercise> =>
          Boolean(exercise),
        )
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "fade",
        }}
      />
      {learningSession.isLoading ? (
        <LessonScreen
          progress={0}
          onClose={handleDismiss}
          primaryLabel="Check"
          primaryDisabled
          onPrimaryPress={() => undefined}
        >
          <View className="flex-1 justify-center px-8">
            <Text variant="body" color="soft">
              Loading practice…
            </Text>
          </View>
        </LessonScreen>
      ) : learningSession.isError || !sessionResult ? (
        <LessonScreen
          progress={0}
          onClose={handleDismiss}
          primaryLabel="Close"
          onPrimaryPress={handleDismiss}
        >
          <View className="flex-1 justify-center px-8">
            <Text variant="h2" color="ink" className="mb-3">
              Practice data needs v1 content.
            </Text>
            <Text variant="body" color="soft">
              This node must be migrated before it can run.
            </Text>
          </View>
        </LessonScreen>
      ) : (
        <NodeEngineRouter
          nodeId={nodeId}
          exercises={routedExercises}
          onNodeComplete={handleComplete}
          onClose={handleDismiss}
        />
      )}
    </>
  );
}

// screens/JourneyMapScreen/NodeContentModal.tsx
// Full-screen modal shown when a node is tapped on the map.
// Fetches content on-demand from the content table, then routes to the correct renderer.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import {
  optimisticSetNodeStatus,
  setActiveNodeModal,
  setCourseProgress,
} from "@/src/features/journey/journeySlice";
import {
  selectActiveNodeModalIdForCourse,
  selectNode,
} from "@/src/features/journey/journeySelectors";
import { journeyApi } from "@/src/features/journey/journeyApi";
import NodeRenderer from "@/src/components/journey/renderers/NodeRenderer";
import type { NodeResponseData } from "@/src/types/journey/mentalHealth";
import { SAGE } from "@/lib/tokens";
import {
  adaptNodeContent,
  fetchNodeContent,
  mapNodeTypeToRendererType,
} from "./nodeContentAdapter";

interface NodeContentModalProps {
  courseId: string;
}

function NodeModalShell({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <View className="happy-brand-screen flex-1">
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </View>
  );
}

// ── Modal component ─────────────────────────────────────────────────────────

export function NodeContentModal({
  courseId,
}: NodeContentModalProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeNodeId = useAppSelector((state) =>
    selectActiveNodeModalIdForCourse(state, courseId),
  );
  const node = useAppSelector((state) =>
    activeNodeId ? selectNode(state, activeNodeId) : undefined,
  );

  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const [isCompleting, setIsCompleting] = useState(false);
  const [rawContent, setRawContent] = useState<unknown | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Fetch content on-demand when node changes
  useEffect(() => {
    if (!activeNodeId || !node) {
      setRawContent(null);
      setIsLoadingContent(false);
      return;
    }

    let cancelled = false;
    setIsLoadingContent(true);
    setRawContent(null);

    fetchNodeContent(activeNodeId, node.type)
      .then((data) => {
        if (!cancelled) {
          setRawContent(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRawContent(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingContent(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeNodeId, node?.type]);

  const adaptedContent = useMemo(() => {
    if (!node || !rawContent) return null;
    return adaptNodeContent(node.type, rawContent);
  }, [node, rawContent]);

  const handleDismiss = useCallback(() => {
    dispatch(setActiveNodeModal({ courseId, nodeId: null }));
  }, [courseId, dispatch]);

  const handleComplete = useCallback(
    async (_responseData: NodeResponseData) => {
      if (!activeNodeId || isCompleting) return;
      setIsCompleting(true);
      try {
        await completeNode({ nodeId: activeNodeId, courseId }).unwrap();
        dispatch(
          optimisticSetNodeStatus({
            nodeId: activeNodeId,
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

        dispatch(setActiveNodeModal({ courseId, nodeId: null }));
      } catch {
        // Keep modal open on error
      } finally {
        setIsCompleting(false);
      }
    },
    [activeNodeId, courseId, completeNode, dispatch, isCompleting],
  );

  const visible = activeNodeId !== null;
  if (!visible) return <Modal visible={false} />;

  // Loading state
  if (isLoadingContent || !node) {
    return (
      <Modal
        visible
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleDismiss}
      >
        <NodeModalShell>
          <View className="flex-1 items-center justify-center px-8">
            <ActivityIndicator size="large" color={SAGE[600]} />
            <Text className="happy-font-body-medium mt-4 text-base text-ink-muted">
              Loading your next step...
            </Text>
          </View>
        </NodeModalShell>
      </Modal>
    );
  }

  // AI insight or missing content fallback
  if (!adaptedContent) {
    return (
      <Modal
        visible
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleDismiss}
      >
        <NodeModalShell>
          <View className="flex-1 items-center justify-center px-8">
            <Text className="mb-4 text-5xl">
              {node.type === "ai_insight" ? "🤖" : "📄"}
            </Text>
            <Text className="happy-font-heading-bold text-center text-[34px] leading-10 text-ink">
              {node.title}
            </Text>
            <Text className="happy-font-body-medium mt-3 text-center text-base leading-6 text-ink-muted">
              {node.type === "ai_insight"
                ? "AI Insights will be available soon."
                : "Content not available."}
            </Text>
            <TouchableOpacity
              className="happy-brand-primary-cta mt-10 rounded-[22px] px-12 py-4 active:opacity-80"
              onPress={
                node.type === "ai_insight"
                  ? () => handleComplete({})
                  : handleDismiss
              }
            >
              <Text className="happy-font-body-bold text-[17px] text-brand-surface">
                {node.type === "ai_insight" ? "Continue" : "Close"}
              </Text>
            </TouchableOpacity>
          </View>
        </NodeModalShell>
      </Modal>
    );
  }

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleDismiss}
    >
      <NodeRenderer
        nodeType={mapNodeTypeToRendererType(node.type)}
        content={adaptedContent}
        title={node.title}
        estimatedMinutes={node.estimatedMins}
        xpReward={0}
        onComplete={handleComplete}
        onClose={handleDismiss}
      />
    </Modal>
  );
}

// screens/JourneyMapScreen/NodeContentModal.tsx
// Full-screen modal shown when a node is tapped on the map.
// Fetches content on-demand from the content table, then routes to the correct renderer.

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { AiGenerativeIcon, File01Icon } from "@hugeicons/core-free-icons";

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
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";

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

  // Cache node and content so the exit animation can play when activeNodeId becomes null
  const cachedNodeRef = useRef(node);
  const cachedContentRef = useRef(adaptedContent);

  useEffect(() => {
    if (node && activeNodeId) cachedNodeRef.current = node;
  }, [node, activeNodeId]);

  useEffect(() => {
    if (adaptedContent && activeNodeId) cachedContentRef.current = adaptedContent;
  }, [adaptedContent, activeNodeId]);

  const isClosing = activeNodeId === null;
  const displayNode = isClosing ? cachedNodeRef.current : node;
  const displayContent = isClosing ? cachedContentRef.current : adaptedContent;

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleDismiss}
    >
      {!displayNode || isLoadingContent ? (
        <NodeModalShell>
          <View className="flex-1">
            {/* Header Skeleton */}
            <View className="flex-row items-center justify-between px-5 pb-4 pt-4 mt-8">
              <Skeleton width={40} height={40} radius={20} />
              <View className="flex-1 mx-3 items-center">
                <Skeleton width={120} height={12} radius={6} />
              </View>
              <Skeleton width={60} height={24} radius={12} />
            </View>

            {/* Title Block Skeleton */}
            <View className="px-8 pb-4 pt-4 items-center">
              <Skeleton width={80} height={12} radius={6} className="mb-4" />
              <Skeleton width="80%" height={28} radius={8} className="mb-2" />
              <Skeleton width="60%" height={28} radius={8} className="mb-6" />
              <Skeleton width="90%" height={16} radius={6} className="mb-2" />
              <Skeleton width="70%" height={16} radius={6} />
            </View>

            {/* Content Area Skeleton */}
            <View className="flex-1 px-7 mt-6 gap-4">
              <SkeletonCard lines={4} />
              <SkeletonCard lines={2} />
            </View>

            {/* Bottom CTA Skeleton */}
            <View className="px-7 pb-4 pt-2 mb-2">
              <Skeleton width="100%" height={56} radius={22} />
            </View>
          </View>
        </NodeModalShell>
      ) : !displayContent ? (
        <NodeModalShell>
          <View className="flex-1 items-center justify-center px-8">
            <View className="mb-4 w-16 h-16 rounded-2xl bg-sage-50 items-center justify-center">
              <HugeiconsIcon
                icon={displayNode.type === "ai_insight" ? AiGenerativeIcon : File01Icon}
                size={32}
                color="#5F7F58"
                strokeWidth={1.5}
              />
            </View>
            <Text className="happy-font-heading-bold text-center text-[34px] leading-10 text-ink">
              {displayNode.title}
            </Text>
            <Text className="happy-font-body-medium mt-3 text-center text-base leading-6 text-ink-muted">
              {displayNode.type === "ai_insight"
                ? "AI Insights will be available soon."
                : "Content not available."}
            </Text>
            <TouchableOpacity
              className="happy-brand-primary-cta mt-10 rounded-[22px] px-12 py-4 active:opacity-80"
              onPress={
                displayNode.type === "ai_insight"
                  ? () => handleComplete({} as any)
                  : handleDismiss
              }
            >
              <Text className="happy-font-body-bold text-[17px] text-brand-surface">
                {displayNode.type === "ai_insight" ? "Continue" : "Close"}
              </Text>
            </TouchableOpacity>
          </View>
        </NodeModalShell>
      ) : (
        <NodeRenderer
          nodeType={mapNodeTypeToRendererType(displayNode.type)}
          content={displayContent}
          title={displayNode.title}
          estimatedMinutes={displayNode.estimatedMins}
          xpReward={0}
          onComplete={handleComplete}
          onClose={handleDismiss}
        />
      )}
    </Modal>
  );
}

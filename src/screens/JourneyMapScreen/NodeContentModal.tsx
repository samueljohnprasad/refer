// screens/JourneyMapScreen/NodeContentModal.tsx
// Full-screen modal shown when a node is tapped on the map.
// Done button marks the node complete, unlocks the next node, and closes.

import React, { useCallback, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import {
  setActiveNodeModal,
  setCourseProgress,
} from "@/src/features/journey/journeySlice";
import { selectActiveNodeModalId } from "@/src/features/journey/journeySelectors";
import { journeyApi } from "@/src/features/journey/journeyApi";

interface NodeContentModalProps {
  /** Active course id — required for completeNode and progress refetch. */
  courseId: string;
}

/**
 * Full-screen modal shown when a node is tapped.
 * Displays the node title and type, then marks it complete on Done.
 */
export function NodeContentModal({
  courseId,
}: NodeContentModalProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const activeNodeId = useAppSelector(selectActiveNodeModalId);
  const node = useAppSelector((state) =>
    activeNodeId ? state.journey.nodes.entities[activeNodeId] : undefined,
  );

  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDismiss = useCallback(() => {
    dispatch(setActiveNodeModal(null));
  }, [dispatch]);

  const handleDone = useCallback(async () => {
    if (!activeNodeId || isCompleting) return;
    setIsCompleting(true);
    try {
      await completeNode({ nodeId: activeNodeId, courseId }).unwrap();

      const progressResult = await dispatch(
        journeyApi.endpoints.getCourseProgress.initiate(courseId, {
          forceRefetch: true,
        }),
      );
      if ("data" in progressResult && progressResult.data) {
        dispatch(setCourseProgress(progressResult.data));
      }

      dispatch(setActiveNodeModal(null));
    } catch {
      // Keep modal open on error so user can retry
    } finally {
      setIsCompleting(false);
    }
  }, [activeNodeId, courseId, completeNode, dispatch, isCompleting]);

  const visible = activeNodeId !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleDismiss}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{node?.title ?? ""}</Text>
        <Text style={styles.type}>{node?.type ?? ""}</Text>

        <TouchableOpacity
          style={[styles.doneButton, isCompleting && styles.doneButtonLoading]}
          onPress={handleDone}
          disabled={isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          disabled={isCompleting}
        >
          <Text style={styles.dismissButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    textTransform: "capitalize",
  },
  doneButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 12,
    minWidth: 160,
    alignItems: "center",
  },
  doneButtonLoading: { backgroundColor: "#818CF8" },
  doneButtonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  dismissButton: { paddingVertical: 12, paddingHorizontal: 32 },
  dismissButtonText: { color: "#6B7280", fontSize: 15 },
});

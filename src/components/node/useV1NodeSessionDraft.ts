import { useEffect } from "react";
import type { useAppDispatch } from "@/src/store/hooks";
import {
  loadV1SessionDraft,
  saveV1SessionDraft,
} from "@/src/domains/journey/learning/sessionDraftStore";
import {
  ensureV1LearningSession,
  hydrateV1LearningSession,
  type V1LearningNodeSession,
} from "@/src/domains/journey/learning/v1LearningSessionSlice";

type AppDispatch = ReturnType<typeof useAppDispatch>;

export function useV1NodeSessionDraft({
  dispatch,
  exerciseCount,
  exerciseIds,
  initialSavedResponses,
  nodeId,
  session,
}: {
  dispatch: AppDispatch;
  exerciseCount: number;
  exerciseIds: string[];
  initialSavedResponses: Record<string, unknown>;
  nodeId: string;
  session?: V1LearningNodeSession;
}) {
  const exerciseSignature = exerciseIds.join("|");

  useEffect(() => {
    let mounted = true;

    loadV1SessionDraft(nodeId, exerciseSignature)
      .then((draft) => {
        if (!mounted) {
          return;
        }

        dispatch(
          hydrateV1LearningSession({
            nodeId,
            initialSavedResponses,
            session: draft,
            exerciseCount,
          }),
        );
      })
      .catch((error: unknown) => {
        console.warn("Failed to load v1 learning session draft", error);
        if (!mounted) {
          return;
        }

        dispatch(
          ensureV1LearningSession({
            nodeId,
            initialSavedResponses,
          }),
        );
      });

    return () => {
      mounted = false;
    };
  }, [dispatch, exerciseCount, exerciseSignature, initialSavedResponses, nodeId]);

  useEffect(() => {
    if (!session?.hydrated) {
      return;
    }

    saveV1SessionDraft({ nodeId, exerciseSignature, ...session }).catch((error: unknown) => {
      console.warn("Failed to save v1 learning session draft", error);
    });
  }, [exerciseSignature, nodeId, session]);
}

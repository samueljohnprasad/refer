import { evaluateV1LearningResponse } from "@/src/domains/journey/learning/evaluateLearningResponse";
import {
  V1ActivityResolutionEnum,
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";
import type {
  V1LearningItem,
  V1LearningResponse,
  V1SessionActivityState,
} from "@/src/types/journeyLearning";

export type V1LearningSessionAction =
  | { type: "answer"; response: V1LearningResponse }
  | { type: "check" }
  | { type: "show_clue" }
  | { type: "make_easier" }
  | { type: "show_worked_answer" }
  | { type: "skip" }
  | { type: "close" }
  | { type: "load_changed_variant"; item: V1LearningItem };

export function createV1SessionActivityState(
  item: V1LearningItem,
): V1SessionActivityState {
  return {
    item,
    response: null,
    supportLevel: V1SupportLevelEnum.None,
    missCount: 0,
    resolution: V1ActivityResolutionEnum.Unresolved,
    lastEvaluation: null,
  };
}

export function reduceV1LearningSession(
  state: V1SessionActivityState,
  action: V1LearningSessionAction,
): V1SessionActivityState {
  switch (action.type) {
    case "answer":
      return {
        ...state,
        response: {
          ...action.response,
          supportLevel: state.supportLevel,
        } as V1LearningResponse,
      };
    case "check": {
      if (
        !state.response ||
        state.resolution !== V1ActivityResolutionEnum.Unresolved
      ) {
        return state;
      }

      const lastEvaluation = evaluateV1LearningResponse(
        state.item,
        state.response,
      );

      if (lastEvaluation.isCorrect) {
        return {
          ...state,
          lastEvaluation,
          resolution:
            state.supportLevel === V1SupportLevelEnum.None
              ? V1ActivityResolutionEnum.IndependentComplete
              : V1ActivityResolutionEnum.SupportedComplete,
        };
      }

      const missCount = state.missCount + 1;

      return {
        ...state,
        missCount,
        lastEvaluation,
        supportLevel: nextSupportLevel(state.supportLevel, missCount),
        resolution:
          missCount >= 3
            ? V1ActivityResolutionEnum.SupportedComplete
            : V1ActivityResolutionEnum.Unresolved,
      };
    }
    case "show_clue":
      return withSupport(state, V1SupportLevelEnum.Clue);
    case "make_easier":
      return withSupport(state, V1SupportLevelEnum.Easier);
    case "show_worked_answer":
      return {
        ...withSupport(state, V1SupportLevelEnum.Worked),
        resolution: V1ActivityResolutionEnum.SupportedComplete,
      };
    case "skip":
      return {
        ...state,
        resolution: V1ActivityResolutionEnum.Skipped,
      };
    case "close":
      return state;
    case "load_changed_variant":
      return {
        ...createV1SessionActivityState(action.item),
        supportLevel: state.supportLevel,
        missCount: state.missCount,
      };
  }
}

function withSupport(
  state: V1SessionActivityState,
  supportLevel: V1SessionActivityState["supportLevel"],
): V1SessionActivityState {
  return {
    ...state,
    supportLevel,
    response: state.response
      ? ({ ...state.response, supportLevel } as V1LearningResponse)
      : state.response,
  };
}

function nextSupportLevel(
  current: V1SessionActivityState["supportLevel"],
  missCount: number,
): V1SessionActivityState["supportLevel"] {
  if (missCount >= 3) {
    return V1SupportLevelEnum.Worked;
  }

  if (missCount === 2) {
    return V1SupportLevelEnum.Easier;
  }

  return current === V1SupportLevelEnum.None ? V1SupportLevelEnum.Clue : current;
}

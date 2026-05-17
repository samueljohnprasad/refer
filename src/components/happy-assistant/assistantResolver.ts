import {
  ASSISTANT_ACTION_REGISTRY,
  ASSISTANT_CONTEXT_CONFIG,
  ASSISTANT_COPY_CONFIG,
} from "./actionCatalog";
import {
  HappyAssistantActionIdEnum,
  HappyAssistantContextEnum,
  type AssistantResolverInput,
  type AssistantResolverResult,
  type HappyAssistantActionDescriptor,
  type HappyAssistantActionId,
  type HappyAssistantContext,
  type ResolvedHappyAssistantActionId,
} from "./types";

const MAX_VISIBLE_ACTIONS = 3;
type SaveProfileActionId = Extract<
  ResolvedHappyAssistantActionId,
  | `${HappyAssistantActionIdEnum.SaveProgress}`
  | `${HappyAssistantActionIdEnum.SavePremiumProfile}`
>;

const SAVE_ACTION_IDS: readonly SaveProfileActionId[] = [
  HappyAssistantActionIdEnum.SaveProgress,
  HappyAssistantActionIdEnum.SavePremiumProfile,
];

enum AssistantPathSegment {
  Exercises = "/exercises",
  Journal = "/journal",
  Record = "/record",
  Journeys = "/journeys",
  Journey = "/journey",
  Settings = "/settings",
}

const CONTEXT_MATCHERS: readonly {
  context: Exclude<
    HappyAssistantContext,
    `${HappyAssistantContextEnum.Default}`
  >;
  pathIncludes: readonly string[];
}[] = [
  {
    context: HappyAssistantContextEnum.Exercises,
    pathIncludes: [AssistantPathSegment.Exercises],
  },
  {
    context: HappyAssistantContextEnum.Journal,
    pathIncludes: [AssistantPathSegment.Journal],
  },
  {
    context: HappyAssistantContextEnum.Record,
    pathIncludes: [AssistantPathSegment.Record],
  },
  {
    context: HappyAssistantContextEnum.Journeys,
    pathIncludes: [
      AssistantPathSegment.Journeys,
      AssistantPathSegment.Journey,
    ],
  },
  {
    context: HappyAssistantContextEnum.Settings,
    pathIncludes: [AssistantPathSegment.Settings],
  },
];

export function resolveAssistantContext(
  pathname: string | null,
): HappyAssistantContext {
  const path = pathname ?? "";
  const matchedContext = CONTEXT_MATCHERS.find(({ pathIncludes }) =>
    pathIncludes.some((segment) => path.includes(segment)),
  );

  return matchedContext?.context ?? HappyAssistantContextEnum.Default;
}

export function resolveHappyAssistantActions(
  input: AssistantResolverInput,
): AssistantResolverResult {
  const context = resolveAssistantContext(input.pathname);
  const contextConfig = ASSISTANT_CONTEXT_CONFIG[context];
  const copy = ASSISTANT_COPY_CONFIG[context];
  const actionIds = resolveVisibleActionIds(contextConfig.actionIds, input);

  return {
    title: copy.title,
    subtitle: copy.subtitle,
    actions: resolveActionDescriptors(actionIds, input),
  };
}

function resolveVisibleActionIds(
  actionIds: readonly HappyAssistantActionId[],
  input: AssistantResolverInput,
): ResolvedHappyAssistantActionId[] {
  const resolvedActionIds = resolveDynamicActionIds(actionIds, input);

  if (!shouldInjectSaveProfile(input)) {
    return limitActionIds(resolvedActionIds);
  }

  return prependSaveProfileAction(
    resolvedActionIds,
    resolveSaveProfileActionId(input),
  );
}

function shouldInjectSaveProfile(input: AssistantResolverInput): boolean {
  return (
    input.isAnonymous &&
    (input.hasPro || input.shouldPromptAccountClaim || input.hasProgress)
  );
}

function resolveSaveProfileActionId(
  input: AssistantResolverInput,
): SaveProfileActionId {
  return input.hasPro
    ? HappyAssistantActionIdEnum.SavePremiumProfile
    : HappyAssistantActionIdEnum.SaveProgress;
}

function prependSaveProfileAction(
  actionIds: readonly ResolvedHappyAssistantActionId[],
  saveActionId: SaveProfileActionId,
): ResolvedHappyAssistantActionId[] {
  const nonSaveActionIds = actionIds.filter(
    (actionId) => !isSaveActionId(actionId),
  );

  return [
    saveActionId,
    ...nonSaveActionIds.slice(0, MAX_VISIBLE_ACTIONS - 1),
  ];
}

function isSaveActionId(
  actionId: ResolvedHappyAssistantActionId,
): actionId is SaveProfileActionId {
  return SAVE_ACTION_IDS.includes(actionId as SaveProfileActionId);
}

function limitActionIds(
  actionIds: readonly ResolvedHappyAssistantActionId[],
): ResolvedHappyAssistantActionId[] {
  return actionIds.slice(0, MAX_VISIBLE_ACTIONS);
}

function resolveDynamicActionIds(
  actionIds: readonly HappyAssistantActionId[],
  input: AssistantResolverInput,
): ResolvedHappyAssistantActionId[] {
  return actionIds.map((actionId) => resolveDynamicActionId(actionId, input));
}

function resolveDynamicActionId(
  actionId: HappyAssistantActionId,
  input: AssistantResolverInput,
): ResolvedHappyAssistantActionId {
  if (actionId === HappyAssistantActionIdEnum.ResumeOrBreathing) {
    return input.latestIncompleteExerciseTitle
      ? HappyAssistantActionIdEnum.ResumeExercise
      : HappyAssistantActionIdEnum.TryOneMinuteBreathing;
  }

  return actionId;
}

function resolveActionDescriptors(
  actionIds: readonly ResolvedHappyAssistantActionId[],
  input: AssistantResolverInput,
): HappyAssistantActionDescriptor[] {
  return actionIds.map((actionId) => resolveActionDescriptor(actionId, input));
}

function resolveActionDescriptor(
  actionId: ResolvedHappyAssistantActionId,
  input: AssistantResolverInput,
): HappyAssistantActionDescriptor {
  const config = ASSISTANT_ACTION_REGISTRY[actionId];

  if (shouldUseResumeDescription(actionId, input)) {
    return {
      ...config,
      description: input.latestIncompleteExerciseTitle ?? config.description,
    };
  }

  return config;
}

function shouldUseResumeDescription(
  actionId: ResolvedHappyAssistantActionId,
  input: AssistantResolverInput,
): boolean {
  return (
    actionId === HappyAssistantActionIdEnum.ResumeExercise &&
    Boolean(input.latestIncompleteExerciseTitle)
  );
}

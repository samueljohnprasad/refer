import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface DialogueOption {
  label: string;
  next: string;
  lead?: string;
}

interface DialogueNode {
  message: string;
  options: DialogueOption[];
  done: boolean;
  support: boolean;
  supportive: boolean;
}

interface TranscriptMessage {
  text: string;
  role: "coach" | "user";
  supportive: boolean;
}

export function SocraticDialogueCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const nodes = readNodes(content.nodes);
  const currentNodeId = readString(saved?.currentNodeId) ?? "start";
  const currentNode = nodes[currentNodeId];
  const transcript = readTranscript(saved?.transcript);
  const done = saved?.done === true;
  const supportOpen = saved?.supportOpen === true;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const updateSupport = (open: boolean) => {
    Haptics.selectionAsync();
    onInteraction(createResponse({ ...saved, supportOpen: open }), done);
  };

  const choose = (option: DialogueOption) => {
    if (locked || !currentNode) return;
    Haptics.selectionAsync();
    const destination = nodes[option.next];
    if (!destination) return;

    const nextTranscript: TranscriptMessage[] = [
      ...transcript,
      {
        text: currentNode.message,
        role: "coach",
        supportive: currentNode.supportive,
      },
      { text: option.label, role: "user", supportive: false },
    ];
    if (option.lead) {
      nextTranscript.push({
        text: option.lead,
        role: "coach",
        supportive: destination.supportive,
      });
    }

    onInteraction(
      createResponse({
        ...saved,
        currentNodeId: option.next,
        transcript: nextTranscript,
        done: destination.done,
        supportOpen: destination.support,
      }),
      destination.done,
    );
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <CourseExerciseHeading
            title={readString(content.title) ?? "A 2am conversation"}
            instruction={
              readString(content.instruction) ?? "Choose the honest answer."
            }
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: supportOpen }}
          onPress={() => updateSupport(!supportOpen)}
          className="mt-0.5 min-h-10 flex-row items-center gap-1.5 rounded-full border border-[#ABC0A2] bg-[#F2F8EF] px-3 active:translate-y-0.5"
        >
          <HugeiconsIcon icon={FavouriteIcon} size={15} color="#29452A" />
          <Text className="happy-font-body-bold text-xs text-[#29452A]">
            Support
          </Text>
        </Pressable>
      </View>

      {supportOpen ? (
        <View className="mb-3 rounded-[22px] border-[1.5px] border-[#ABC0A2] bg-[#F2F8EF] p-4">
          <Text className="happy-font-heading-bold text-lg leading-[22px] text-[#3F4A31]">
            {readString(content.supportTitle)}
          </Text>
          <Text className="happy-font-body mt-1.5 text-[13.5px] leading-5 text-[#3F4A31]">
            {readString(content.supportBody)}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => updateSupport(false)}
            className="mt-3 min-h-11 items-center justify-center rounded-full border-[1.5px] border-[#7E9874] bg-[#F9F4ED] px-4 active:translate-y-0.5"
          >
            <Text className="happy-font-body-bold text-[13px] text-[#29452A]">
              Back to the conversation
            </Text>
          </Pressable>
        </View>
      ) : null}

      {!supportOpen ? (
        <>
          <View className="gap-2.5">
            {transcript.map((message, index) => (
              <ConversationBubble
                key={`${index}-${message.text}`}
                {...message}
              />
            ))}
            {currentNode ? (
              <ConversationBubble
                text={currentNode.message}
                role="coach"
                supportive={currentNode.supportive}
              />
            ) : null}
          </View>

          {!done && currentNode?.options.length ? (
            <View className="mt-3 gap-2">
              {currentNode.options.map((option) => (
                <Pressable
                  key={`${option.label}-${option.next}`}
                  accessibilityRole="button"
                  disabled={locked}
                  onPress={() => choose(option)}
                  className="min-h-[52px] justify-center rounded-[21px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-3 active:translate-y-0.5 active:border-b-[1.5px]"
                >
                  <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#201E1D]">
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {done ? (
            <Text className="happy-font-body mt-3 text-center text-xs leading-[18px] text-[#82796A]">
              {readString(content.terminalNote)}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function ConversationBubble({ text, role, supportive }: TranscriptMessage) {
  const className = supportive
    ? "max-w-[91%] self-start rounded-[20px] rounded-bl-md border border-[#ABC0A2] bg-[#F2F8EF] px-4 py-3"
    : role === "user"
      ? "max-w-[86%] self-end rounded-[20px] rounded-br-md bg-[#5F7F58] px-4 py-3"
      : "max-w-[91%] self-start rounded-[20px] rounded-bl-md border border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3";
  return (
    <View className={className}>
      <Text
        className={
          role === "user"
            ? "happy-font-body text-[13.5px] leading-5 text-white"
            : "happy-font-body text-[13.5px] leading-5 text-[#201E1D]"
        }
      >
        {text}
      </Text>
    </View>
  );
}

function readNodes(value: unknown): Record<string, DialogueNode> {
  const source = readRecord(value);
  if (!source) return {};
  return Object.fromEntries(
    Object.entries(source).flatMap(([id, value]) => {
      const node = readRecord(value);
      const message = readString(node?.message);
      return message
        ? [
            [
              id,
              {
                message,
                options: readOptions(node?.options),
                done: node?.done === true,
                support: node?.support === true,
                supportive: node?.supportive === true,
              },
            ],
          ]
        : [];
    }),
  );
}

function readOptions(value: unknown): DialogueOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const label = readString(option?.label);
    const next = readString(option?.next);
    return label && next
      ? [{ label, next, lead: readString(option?.lead) ?? undefined }]
      : [];
  });
}

function readTranscript(value: unknown): TranscriptMessage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const message = readRecord(item);
    const text = readString(message?.text);
    const role = message?.role === "user" ? "user" : "coach";
    return text
      ? [{ text, role, supportive: message?.supportive === true }]
      : [];
  });
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.SocraticDialogue,
    phase: "conversation",
    currentNodeId: "start",
    transcript: [],
    done: false,
    supportOpen: false,
    isCorrect: true,
    ...extra,
  };
}

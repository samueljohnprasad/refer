// ponytail: pure writing rules from .agents/thought-reframing.html — real-words check, starters, the
// starter situations with the thoughts and facts that belong to them. No UI, no hooks.
import { words } from "@/src/domains/thoughtCatcher/domain/words";
import { STARTERS } from "@/src/domains/thoughtCatcher/domain/scoring";
import { prependStarter, withoutStarter } from "@/src/domains/thoughtCatcher/domain/text";

export { STARTERS, prependStarter };

export const MIN_WORDS = 2;

/** `ownWordsOnly`: a tapped starter ("It's possible that") alone is not an answer yet. */
export const hasWords = (text: string, ownWordsOnly = false): boolean =>
  words(ownWordsOnly ? withoutStarter(text) : text) >= MIN_WORDS;

export const SOCRATIC = [
  "What would you tell a friend who thought this?",
  "Have you handled something like this before?",
  "What would someone who likes you say?",
  "Is there anything that doesn’t fit the thought?",
  "Will this matter in a year?",
  "Is this a fact, or how it feels?",
] as const;

interface Scene {
  situation?: string;
  thoughts: readonly string[];
  evFor: readonly string[];
  evAgainst: readonly string[];
}

export const SCENES: readonly (Scene & { situation: string })[] = [
  {
    situation: "My manager gave me feedback on my report this morning",
    thoughts: ["They think I can’t do my job.", "I’m going to get fired.", "I always get this wrong."],
    evFor: ["They pointed out two mistakes in the report.", "I rushed the last section."],
    evAgainst: ["They said the structure was clear.", "Feedback is part of every report here."],
  },
  {
    situation: "I messaged a friend yesterday and haven’t heard back",
    thoughts: ["They’re ignoring me on purpose.", "I must have said something wrong.", "Nobody really wants to hear from me."],
    evFor: ["They usually reply within a few hours.", "They were online last night."],
    evAgainst: ["They told me this week is busy.", "We had a good call last weekend."],
  },
];

const GENERAL: Scene = {
  thoughts: ["I always mess things up.", "Something bad is going to happen.", "They must think I’m useless."],
  evFor: ["It went wrong once before.", "Someone seemed annoyed."],
  evAgainst: ["It went fine the other times.", "Nobody actually said that."],
};

/** Starter situations carry thoughts and facts that belong to them; your own words get the general set. */
export const sceneFor = (situation: string): Scene =>
  SCENES.find((s) => s.situation === situation.trim()) ?? GENERAL;

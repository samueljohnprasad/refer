import { COMP } from "./config";

// ponytail: estimated timing until real narration (say/ffprobe) replaces this —
// char-weighted word duration + per-line pause, no whisper alignment needed.
// Swap WORDS_PER_SECOND_BASE tuning for real audio once narration.wav exists.

export interface Word {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface Line {
  words: Word[];
  keyword: string; // must match one word's text (case-insensitive) for the serif/red treatment
  startFrame: number;
  endFrame: number;
}

export interface Section {
  id: string;
  label: string; // "// 01 · catch"
  stat: { prefix: string; value: string }; // value rendered red bold
  title: [string, string]; // word1 ink, word2 red
  lines: Line[];
  startFrame: number;
  endFrame: number;
}

interface RawLine {
  text: string;
  keyword: string;
}

interface RawSection {
  id: string;
  label: string;
  stat: { prefix: string; value: string };
  title: [string, string];
  lines: RawLine[];
}

const RAW: RawSection[] = [
  {
    id: "hook",
    label: "// 00 · hook",
    stat: { prefix: "", value: "" },
    title: ["Thought", "Catcher"],
    lines: [
      { text: "Anxious thought hijacks your night", keyword: "hijacks" },
      { text: "Happy catches it in sixty seconds", keyword: "seconds" },
    ],
  },
  {
    id: "catch",
    label: "// 01 · catch",
    stat: { prefix: "logged", value: "3M+" },
    title: ["Catch", "Thought"],
    lines: [
      { text: "Tap the moment worry hits", keyword: "worry" },
      { text: "Thought Catcher opens no sign-up no wait", keyword: "Catcher" },
    ],
  },
  {
    id: "name",
    label: "// 02 · name",
    stat: { prefix: "patterns", value: "10" },
    title: ["Name", "Pattern"],
    lines: [
      { text: "Pick what kind of thought it is", keyword: "kind" },
      { text: "Catastrophizing mind-reading all-or-nothing one tap", keyword: "nothing" },
    ],
  },
  {
    id: "flip",
    label: "// 03 · flip",
    stat: { prefix: "feel calmer", value: "94%" },
    title: ["Flip", "Script"],
    lines: [
      { text: "CBT prompts flip it for you", keyword: "flip" },
      { text: "One sharp question and the thought gets smaller", keyword: "smaller" },
    ],
  },
  {
    id: "build",
    label: "// 04 · build",
    stat: { prefix: "day streak", value: "21" },
    title: ["Build", "Habit"],
    lines: [
      { text: "Do it once a day and it sticks", keyword: "sticks" },
      { text: "Streak journal insight all linked to this catch", keyword: "linked" },
    ],
  },
  {
    id: "close",
    label: "// 05 · close",
    stat: { prefix: "", value: "" },
    title: ["Same", "Thought"],
    lines: [
      { text: "Same anxious thought", keyword: "Same" },
      { text: "Now you're the one driving", keyword: "driving" },
    ],
  },
];

const SEC_TO_FRAMES = (sec: number) => Math.round(sec * COMP.fps);

/** ~150wpm spoken pace at 1.1x, char-weighted so short words don't all read identically. */
const wordDurationSec = (word: string) => Math.max(0.16, word.length * 0.045 + 0.09);
const LINE_PAUSE_SEC = 0.22;
const SECTION_PAUSE_SEC = 0.4;

function buildTimeline(raw: RawSection[]): Section[] {
  let cursorSec = 0;
  const sections: Section[] = raw.map((rawSection) => {
    const sectionStartSec = cursorSec;
    const lines: Line[] = rawSection.lines.map((rawLine) => {
      const tokens = rawLine.text.split(/\s+/);
      const words: Word[] = tokens.map((text) => {
        const startFrame = SEC_TO_FRAMES(cursorSec);
        cursorSec += wordDurationSec(text);
        const endFrame = SEC_TO_FRAMES(cursorSec);
        return { text, startFrame, endFrame };
      });
      const lineStart = words[0].startFrame;
      cursorSec += LINE_PAUSE_SEC;
      const lineEnd = SEC_TO_FRAMES(cursorSec);
      return { words, keyword: rawLine.keyword, startFrame: lineStart, endFrame: lineEnd };
    });
    cursorSec += SECTION_PAUSE_SEC;
    return {
      id: rawSection.id,
      label: rawSection.label,
      stat: rawSection.stat,
      title: rawSection.title,
      lines,
      startFrame: SEC_TO_FRAMES(sectionStartSec),
      endFrame: SEC_TO_FRAMES(cursorSec),
    };
  });
  return sections;
}

export const SECTIONS: Section[] = buildTimeline(RAW);
export const TOTAL_DURATION_FRAMES = SECTIONS[SECTIONS.length - 1].endFrame;

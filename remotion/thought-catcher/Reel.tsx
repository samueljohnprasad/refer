import React from "react";
import {
  AbsoluteFill,
  Easing,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { FONT_CSS_URL } from "./config";
import { SECTIONS, TOTAL_DURATION_FRAMES } from "./script";
import { Paper } from "./Paper";
import { Captions } from "./Captions";
import { Title } from "./Title";
import { Label } from "./Label";
import { Card } from "./Card";
import { Stamp } from "./Stamp";
import { HalftoneWipe } from "./HalftoneWipe";
import { Presenter } from "./Presenter";

const fontHandle = delayRender("Loading thought-catcher fonts");
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = FONT_CSS_URL;
fontLink.onload = () => document.fonts.ready.then(() => continueRender(fontHandle));
fontLink.onerror = () => continueRender(fontHandle);
document.head.appendChild(fontLink);

export const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

const CARD_RISE_DELAY = 9; // ~0.3s after title slam (underline delay + its own rise delay)
const CARD_RISE_FRAMES = 12; // 0.4s rise
const COUNTER_FRAMES = 34; // 1.15s count-up
const BADGE_DELAY = 18; // 0.6s

/** ponytail: skipped the per-point "exit upward + demo animation" beat (spec's
 * 0.3s-before-explanation exit + acted-out demo) — scaffold keeps card/title
 * visible through both lines of the point. Add once real narration timing
 * (not estimated) makes that extra beat worth the frame budget. */
export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const allLines = SECTIONS.flatMap((s) => s.lines);
  const activeSection = SECTIONS.reduce((acc, s) => (s.startFrame <= frame ? s : acc), SECTIONS[0]);
  const isPoint = activeSection.stat.value !== "";
  const pointIndex = SECTIONS.filter((s) => s.stat.value !== "").findIndex((s) => s.id === activeSection.id);

  const sectionLocal = frame - activeSection.startFrame;
  const cardOpacity = isPoint
    ? interpolate(sectionLocal, [CARD_RISE_DELAY, CARD_RISE_DELAY + CARD_RISE_FRAMES], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const cardY = isPoint
    ? interpolate(sectionLocal, [CARD_RISE_DELAY, CARD_RISE_DELAY + CARD_RISE_FRAMES], [70, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  const counterValue = Math.round(
    interpolate(
      sectionLocal,
      [CARD_RISE_DELAY, CARD_RISE_DELAY + COUNTER_FRAMES],
      [0, parseStatNumber(activeSection.stat.value)],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  );

  return (
    <AbsoluteFill>
      <Paper />

      <Label label={activeSection.label} stat={activeSection.stat} />

      <Title words={activeSection.title} startFrame={activeSection.startFrame} x={120} y={1360} />

      {isPoint ? (
        <div style={{ position: "absolute", left: 120, top: 700 + cardY, opacity: cardOpacity }}>
          <Card width={840} height={420}>
            <div style={{ padding: 40, fontFamily: "Anton, sans-serif", fontSize: 120, color: "#D7372C" }}>
              {counterValue}
              {activeSection.stat.value.replace(/[0-9]/g, "")}
            </div>
          </Card>
          <Stamp text={`#${pointIndex + 1}`} x={780} y={-30} startFrame={activeSection.startFrame + BADGE_DELAY} />
        </div>
      ) : null}

      <Presenter />
      <Captions lines={allLines} />

      {SECTIONS.map((s, i) =>
        i > 0 ? <HalftoneWipe key={s.id} startFrame={s.startFrame - 9} /> : null,
      )}
    </AbsoluteFill>
  );
};

function parseStatNumber(value: string): number {
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

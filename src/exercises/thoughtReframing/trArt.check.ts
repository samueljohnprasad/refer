// run: npx tsx src/exercises/thoughtReframing/trArt.check.ts — every distortion key has a scene, intro and glyphs build
import assert from "node:assert/strict";
import { PATTERN_KEYS, patternXml, introXml, glyphXml } from "./trArt";

const KEYS = ["all_or_nothing", "catastrophizing", "mind_reading", "overgeneralizing", "personalizing", "filtering", "should_statements", "fortune_telling", "emotional_reasoning", "labeling"];
assert.deepEqual([...PATTERN_KEYS].sort(), [...KEYS].sort());
for (const k of KEYS) assert.match(patternXml(k), /^<svg viewBox="0 0 56 56"/);
assert.match(introXml(), /^<svg viewBox="0 0 320 168"/);
for (const g of ["notice", "weigh", "reframe", "check"] as const) assert.match(glyphXml(g), /^<svg viewBox="0 0 48 48"/);
console.log("trArt ok");

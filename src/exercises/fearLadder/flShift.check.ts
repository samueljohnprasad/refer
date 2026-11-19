// ponytail: run with `npx tsx src/exercises/fearLadder/flShift.check.ts` — fails loudly if the wording rules drift.
import assert from "node:assert/strict";
import { nextLine, shiftCopy } from "./flShift";

assert.equal(shiftCopy(6, 2).verdict, "4 lower");
assert.match(shiftCopy(6, 2).note, /Much easier/);
assert.equal(shiftCopy(6, 5).verdict, "1 lower");
assert.equal(shiftCopy(4, 4).verdict, "No change");
assert.equal(shiftCopy(3, 5).verdict, "2 higher");
assert.match(nextLine(3, "Speak up"), /Speak up/);
assert.match(nextLine(4, "Speak up"), /Repeat this rung/);
assert.match(nextLine(2, undefined), /Repeat this rung/);
console.log("flShift ok");

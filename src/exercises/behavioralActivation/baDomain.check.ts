// ponytail: one runnable check for the pure rules — `npx tsx src/exercises/behavioralActivation/baDomain.check.ts`
import assert from "node:assert/strict";
import type { BehavioralActivationResponse as R } from "@/src/types/exerciseFlow";
import { feelComparison, moodComparison, moodVerdict, nextUp } from "./baDomain";

const base: R = {
  mood: 2, activities: ["walk", "call", "read"], sizes: {}, tryNow: "walk", didIt: true, moodAfter: 5,
  plans: { walk: { day: 1, time: 0 }, call: { day: 0, time: 2 }, read: { day: 0, time: 0 } },
  expectedEnjoyment: 5, expectedAccomplishment: 5, actualEnjoyment: 5, actualAccomplishment: 5,
};

assert.equal(moodVerdict(2, 5).title, "Your mood is higher now.");
assert.equal(moodVerdict(4, 4).title, "Your mood stayed about the same.");
assert.equal(moodComparison(5, 5), "Same as before: Okay.");
assert.equal(moodComparison(5, 7), "Higher than before: Okay to good.");
assert.equal(feelComparison(base), "About what you guessed.");
assert.ok(feelComparison({ ...base, actualEnjoyment: 8 }).endsWith("worth testing again."));
assert.equal(feelComparison({ ...base, actualEnjoyment: 8, actualAccomplishment: 2 }), "More enjoyable, less of a win than you guessed.");
assert.equal(nextUp(base, 0), "read"); // today Monday: read (Mon morning) before call (Mon evening)
assert.equal(nextUp(base, 3), "read"); // from Thursday, Monday is 4 days away; Tuesday is 5
console.log("baDomain ok");

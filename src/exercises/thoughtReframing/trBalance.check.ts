// ponytail: run with `npx tsx src/exercises/thoughtReframing/trBalance.check.ts` — fails loudly if the rules drift.
import assert from 'node:assert/strict';
import { trTilt, trPanAnchors, trStonePlan, trBeamMatrix } from './trBalance';

assert.equal(trTilt(0, 0), 0);
assert.equal(trTilt(3, 0), -14); // clamped
assert.equal(trTilt(0, 1), 5);
const [l, r] = trPanAnchors(0);
assert.deepEqual([l[0], l[1], r[0], r[1]], [56, 50, 264, 50]);
assert.equal(trStonePlan(9).slots.length, 6);
assert.equal(trStonePlan(9).overflow, 3);
assert.deepEqual(trBeamMatrix(0).map((n) => Math.round(n)), [1, 0, -0, 1, 0, 0]);
console.log('trBalance ok');

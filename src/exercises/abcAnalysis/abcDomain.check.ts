// ponytail: one runnable check for the pure rules — `npx tsx src/exercises/abcAnalysis/abcDomain.check.ts`
import assert from 'node:assert/strict';
import { abcChecksSummary, abcSentence, abcStrength, abcVerdict, applyStarter, ownWords } from './abcDomain';

assert.equal(abcStrength(0), 'None');
assert.equal(abcStrength(10), 'Very strong');
assert.equal(abcChecksSummary({ fact: 'A guess', help: 'No' }), 'You called it a guess and believing it doesn’t help.');
assert.equal(ownWords('It’s possible that '), '');
assert.equal(applyStarter('they hate me', 'What if ', ['What if ']), 'What if they hate me');
assert.equal(abcSentence({ event: 'My boss ignored me.', belief: '', feel: '' }).map((s) => s.text).join(''), 'When my boss ignored me, I thought B, and felt C.');
assert.equal(abcVerdict(7, 3).better, true);
console.log('abcDomain ok');

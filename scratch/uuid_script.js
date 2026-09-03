const crypto = require('crypto');

function seedUuid(seed) {
  const hash = crypto.createHash('md5').update(seed).digest('hex');
  return `${hash.slice(0,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}-${hash.slice(16,20)}-${hash.slice(20,32)}`;
}

console.log('COURSE:');
console.log(`"${seedUuid('sleep-reset')}": {`);
console.log(`  courseId: "${seedUuid('sleep-reset')}",`);
console.log(`  acknowledgement: "You've worked through the core science of sleep. These are skills you can return to any time.",`);
console.log(`  capabilitySummary: [`);
console.log(`    "Explain the two-process model of sleep regulation.",`);
console.log(`    "Identify common behaviours that interfere with sleep pressure.",`);
console.log(`    "Describe the role of light in setting your circadian rhythm.",`);
console.log(`    "Apply wind-down strategies based on what you've learned."`);
console.log(`  ]`);
console.log(`},`);

console.log('\nUNITS:');
console.log(`"${seedUuid('u1_1_sleep_mechanics')}": {`);
console.log(`  unitId: "${seedUuid('u1_1_sleep_mechanics')}",`);
console.log(`  capabilityStatement: "You can now explain how sleep pressure and the circadian clock work together.",`);
console.log(`  insightCard: { title: "Why sleep debt adds up", body: "Each hour of lost sleep is carried forward. Understanding this helps you plan recovery sleep without guilt." },`);
console.log(`},`);
console.log(`"${seedUuid('u1_2_sleep_disruptors')}": {`);
console.log(`  unitId: "${seedUuid('u1_2_sleep_disruptors')}",`);
console.log(`  capabilityStatement: "You can now identify and manage the common behaviours that interfere with sleep pressure.",`);
console.log(`  insightCard: { title: "The caffeine half-life", body: "Caffeine blocks sleep pressure receptors for up to 6 hours. Timing your last cup helps pressure build naturally." },`);
console.log(`},`);

console.log('\nLESSONS:');
for (const lesson of [
  'u1_1_sleep_mechanics-n1', 'u1_1_sleep_mechanics-n2', 'u1_1_sleep_mechanics-n3', 'u1_1_sleep_mechanics-n4',
  'u1_2_sleep_disruptors-n1', 'u1_2_sleep_disruptors-n2', 'u1_2_sleep_disruptors-n3', 'u1_2_sleep_disruptors-n4', 'u1_2_sleep_disruptors-n5', 'u1_2_sleep_disruptors-n6_experiment'
]) {
  console.log(`"${seedUuid(lesson)}": { nodeId: "${seedUuid(lesson)}", takeaway: "Takeaway for ${lesson}" },`);
}

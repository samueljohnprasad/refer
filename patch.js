const fs = require('fs');
const file = 'src/data/journey/nodeFactory.ts';
let content = fs.readFileSync(file, 'utf8');

const defaultMilestoneRewards = `
/** Default rewards for a milestone node */
const DEFAULT_MILESTONE_REWARDS: JourneyReward[] = [
  { type: JourneyRewardType.XP, amount: 100, icon: "⚡" },
  { type: JourneyRewardType.GEMS, amount: 50, icon: "💎" },
];
`;
content = content.replace('/** Default rewards for a chest node */', defaultMilestoneRewards + '\n/** Default rewards for a chest node */');

content = content.replace('[NodeType.CHEST]: NodeIcon.CHEST,', '[NodeType.CHEST]: NodeIcon.CHEST,\n  [NodeType.MILESTONE]: NodeIcon.STAR,');
content = content.replace('[NodeType.CHEST]: DEFAULT_CHEST_REWARDS,', '[NodeType.CHEST]: DEFAULT_CHEST_REWARDS,\n  [NodeType.MILESTONE]: DEFAULT_MILESTONE_REWARDS,');

fs.writeFileSync(file, content);

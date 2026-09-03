const fs = require('fs');
const file = 'src/components/exercise/courseExerciseFinalBatchRegistry.ts';
let code = fs.readFileSync(file, 'utf8');

// Fix the corrupted `getCheckpointTransition`
code = code.replace(/state_switch: StateSwitchConfig,\n};/, '};');

// Add to the actual FINAL_BATCH_CATEGORY_CONFIGS
code = code.replace(/\[CourseExerciseCategoryEnum\.SectionMilestone\]: SectionMilestoneConfig,\n};/, '[CourseExerciseCategoryEnum.SectionMilestone]: SectionMilestoneConfig,\n  [CourseExerciseCategoryEnum.StateSwitch]: StateSwitchConfig,\n};');

fs.writeFileSync(file, code);

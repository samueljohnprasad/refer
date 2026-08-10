import { anxietyHasAJob } from "./lessons/01-anxiety-has-a-job.js";
import { howTheBodyPrepares } from "./lessons/02-how-the-body-prepares.js";
import { howTheMindPredicts } from "./lessons/03-how-the-mind-predicts.js";
import { howUrgesProtect } from "./lessons/04-how-urges-protect.js";
import { fearAndAnxiety } from "./lessons/05-fear-and-anxiety.js";
import { intensityIsNotEvidence } from "./lessons/06-intensity-is-not-evidence.js";
import { alarmSystemCheckpoint } from "./lessons/07-alarm-system-checkpoint.js";
import { UNIT_1_LEARNING_PLAN } from "./unit-learning-plan.js";

export { EXERCISE_COMPATIBILITY, UNIT_1_CATEGORY_PLACEMENT } from "./exercise-compatibility.js";
export { UNIT_1_LESSON_SELECTION_RATIONALE } from "./lesson-rationale.js";
export { UNIT_1_LEARNING_PLAN } from "./unit-learning-plan.js";

export const anxietySection1Unit1 = {
  courseId: "anxiety",
  sectionId: "anxiety-s1-understand-the-alarm",
  sourceId: "anxiety-s1-u1-the-alarm-system",
  position: 1,
  title: "The Alarm System",
  objective:
    "Read anxiety as a protective alarm, connect body, prediction, and urge, and separate intensity from evidence of danger.",
  prerequisiteConcepts: [],
  concepts: [
    "protective_alarm",
    "body_alarm",
    "threat_prediction",
    "protective_urges",
    "fear_and_anxiety",
    "intensity_not_probability",
  ],
  learningPlan: UNIT_1_LEARNING_PLAN,
  lessons: [
    anxietyHasAJob,
    howTheBodyPrepares,
    howTheMindPredicts,
    howUrgesProtect,
    fearAndAnxiety,
    intensityIsNotEvidence,
    alarmSystemCheckpoint,
  ],
};

export default anxietySection1Unit1;

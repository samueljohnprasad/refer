import { theNinetyMinuteSwitch } from "./lessons/01-the-90-minute-switch.js";
import { lightIsInformation } from "./lessons/02-light-is-information.js";
import { sleepEnvironmentAudit } from "./lessons/03-sleep-environment-audit.js";
import { bedSleepConnection } from "./lessons/04-bed-sleep-connection.js";
import { worryDump } from "./lessons/05-worry-dump.js";
import { optionalPreSleepJournaling } from "./lessons/06-optional-pre-sleep-journaling.js";
import { testOneChangeAtATime } from "./lessons/07-test-one-change-at-a-time.js";
import { eveningArchitectureCheckpoint } from "./lessons/08-evening-architecture-checkpoint.js";
import { SECTION_3_LEARNING_PLAN } from "./section-learning-plan.js";

export {
  SECTION_3_CATEGORY_PLACEMENT,
  SECTION_3_EXERCISE_COMPATIBILITY,
} from "./exercise-compatibility.js";
export { SECTION_3_LESSON_SELECTION_RATIONALE } from "./lesson-rationale.js";
export { SECTION_3_LEARNING_PLAN } from "./section-learning-plan.js";

export const sleepResetSection3 = {
  courseId: "sleep-reset",
  sourceId: "s3_evening_architecture",
  position: 3,
  title: "Design Your Evening",
  badge: "Evening Architect",
  objective:
    "Build a flexible evening plan, test one practical change, and choose a fitting response when sleep does not arrive.",
  concepts: [
    "wind_down_window",
    "light_and_sleep",
    "sleep_environment",
    "stimulus_control",
    "sleep_window_clinician_guidance",
    "worry_dump",
    "pre_sleep_journaling",
    "evening_experiment",
  ],
  learningPlan: SECTION_3_LEARNING_PLAN,
  units: [
    {
      sourceId: "u3_1_wind_down",
      position: 1,
      title: "The Wind-Down Window",
      objective:
        "Shape a flexible transition from daytime activity to sleep-supporting conditions.",
      lessons: [
        theNinetyMinuteSwitch,
        lightIsInformation,
        sleepEnvironmentAudit,
      ],
    },
    {
      sourceId: "u3_2_pre_sleep_practices",
      position: 2,
      title: "Clearing the Mind Before Bed",
      objective:
        "Protect the bed-sleep association, move unfinished thinking outside bed, and evaluate one evening change.",
      lessons: [
        bedSleepConnection,
        worryDump,
        optionalPreSleepJournaling,
        testOneChangeAtATime,
        eveningArchitectureCheckpoint,
      ],
    },
  ],
};

export default sleepResetSection3;

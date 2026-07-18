import { getGratitudePromptLabel } from "./config";
import { getMoodShiftInterpretation } from "./GratitudeReframeSummary";

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
}));
jest.mock("@/src/components/exercise/ThoughtRecordRecap", () => ({
  ThoughtRecordRecap: () => null,
}));
jest.mock("@/src/components/ui/Text", () => ({
  Text: () => null,
}));
jest.mock("@/src/data/exerciseLinkingMap", () => ({
  EXERCISE_LINKING_MAP: {},
}));
jest.mock("@/src/hooks/useCopingCards", () => ({
  useCopingCards: () => ({ saveCard: jest.fn() }),
}));
jest.mock("@/src/components/exercise/steps/createStep", () => ({
  createStep: (component) => component,
}));
jest.mock("@/src/components/exercise/steps/IntroStep", () => ({
  IntroStep: () => null,
}));
jest.mock("@/src/components/exercise/steps/SliderStep", () => ({
  SliderStep: () => null,
}));
jest.mock("@/src/components/exercise/steps/ChoiceStep", () => ({
  ChoiceStep: () => null,
}));
jest.mock("@/src/components/exercise/steps/MultiTextInputStep", () => ({
  MultiTextInputStep: () => null,
}));

describe("GratitudeReframeSummary", () => {
  it("describes lower intensity as easing", () => {
    expect(getMoodShiftInterpretation(8, 4)).toContain("eased");
  });

  it("describes higher intensity as stronger", () => {
    expect(getMoodShiftInterpretation(4, 8)).toContain("stronger");
  });

  it("keeps unchanged intensity neutral", () => {
    expect(getMoodShiftInterpretation(5, 5)).toContain("did not move much");
  });

  it("uses the configured prompt label and preserves dynamic selections", () => {
    expect(getGratitudePromptLabel("people")).toBe(
      "A person who showed up for me",
    );
    expect(getGratitudePromptLabel("A kind text from my sister")).toBe(
      "A kind text from my sister",
    );
  });
});

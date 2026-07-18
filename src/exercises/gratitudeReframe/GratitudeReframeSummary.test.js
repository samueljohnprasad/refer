import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import * as Haptics from "expo-haptics";

import { getGratitudePromptLabel } from "./promptMetadata";
import {
  getMoodShiftInterpretation,
  GratitudeReframeSummary,
} from "./GratitudeReframeSummary";

const mockSaveCard = jest.fn();

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success" },
}));
jest.mock("@/src/components/exercise/ThoughtRecordRecap", () => ({
  ThoughtRecordRecap: ({ afterTimeline }) => afterTimeline,
}));
jest.mock("@/src/components/ui/Text", () => ({
  Text: () => null,
}));
jest.mock("@/src/data/exerciseLinkingMap", () => ({
  EXERCISE_LINKING_MAP: {},
}));
jest.mock("@/src/hooks/useCopingCards", () => ({
  useCopingCards: () => ({ saveCard: mockSaveCard }),
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
  beforeEach(() => {
    mockSaveCard.mockReset();
    Haptics.notificationAsync.mockReset();
  });

  it("describes lower intensity neutrally", () => {
    expect(getMoodShiftInterpretation(8, 4)).toContain("was lower");
  });

  it("describes higher intensity neutrally", () => {
    expect(getMoodShiftInterpretation(4, 8)).toContain("was higher");
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

  it("keeps a successful coping-card save saved when haptics fails", async () => {
    mockSaveCard.mockResolvedValue(undefined);
    Haptics.notificationAsync.mockRejectedValue(new Error("Haptics unavailable"));

    let renderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <GratitudeReframeSummary
          response={{
            currentMood: "sad",
            moodIntensity: 7,
            selectedPrompt: "people",
            gratitudeEntries: ["My sister called"],
            finalMoodIntensity: 4,
          }}
          onUpdate={jest.fn()}
          onNext={jest.fn()}
          onBack={jest.fn()}
          onClose={jest.fn()}
          canGoBack={false}
          isValid
          progress={1}
          stepIndex={1}
          totalSteps={1}
        />,
      );
    });

    const saveButton = renderer.root.findByProps({
      accessibilityLabel: "Save as coping card",
    });
    await act(async () => {
      await saveButton.props.onPress();
    });

    expect(mockSaveCard).toHaveBeenCalledTimes(1);
    expect(
      renderer.root.findByProps({
        accessibilityLabel: "Saved to coping cards",
      }).props.disabled,
    ).toBe(true);

    await act(async () => {
      await renderer.root
        .findByProps({ accessibilityLabel: "Saved to coping cards" })
        .props.onPress();
    });

    expect(mockSaveCard).toHaveBeenCalledTimes(1);
  });
});

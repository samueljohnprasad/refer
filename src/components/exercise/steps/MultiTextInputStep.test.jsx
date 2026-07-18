import React from "react";
import TestRenderer, { act } from "react-test-renderer";

let composerProps;

jest.mock("@/src/store/hooks", () => ({
  useAppDispatch: () => jest.fn(),
}));
jest.mock("@/src/store/slices/happyAssistantSlice", () => ({
  setAssistantMessage: jest.fn(),
}));
jest.mock("./StepLayout", () => ({
  StepLayout: ({ children }) => <>{children}</>,
}));
jest.mock("@/src/components/exercise/PsychoeducationCard", () => ({
  PsychoeducationCard: () => null,
}));
jest.mock("@/src/components/exercise/ReflectionStepSections", () => ({
  ReflectionDisclosure: ({ children }) => <>{children}</>,
}));
jest.mock("@/src/components/exercise/SuggestionCards", () => ({
  SuggestionCards: () => null,
}));
jest.mock("@/src/components/exercise/ExerciseTextComposer", () => ({
  ExerciseTextComposer: (props) => {
    composerProps = props;
    return null;
  },
}));

import { MultiTextInputStep } from "./MultiTextInputStep";

describe("MultiTextInputStep", () => {
  it("keeps list removal enabled at maxItems while the composer blocks additions", () => {
    act(() => {
      TestRenderer.create(
        <MultiTextInputStep
          response={{ gratitudeEntries: ["One", "Two"] }}
          onUpdate={jest.fn()}
          onNext={jest.fn()}
          onBack={jest.fn()}
          onClose={jest.fn()}
          canGoBack={false}
          isValid
          progress={1}
          stepIndex={1}
          totalSteps={1}
          title="Title"
          subtitle="Subtitle"
          fieldKey="gratitudeEntries"
          maxItems={2}
        />,
      );
    });

    expect(composerProps).toMatchObject({
      items: ["One", "Two"],
      maxItems: 2,
    });
    expect(composerProps.readOnly).toBeUndefined();
  });
});

import React from "react";
import { TextInput } from "react-native";
import TestRenderer, { act } from "react-test-renderer";

jest.mock("@shopify/react-native-skia", () => ({
  BlurMask: () => null,
  Canvas: ({ children }) => children,
  RoundedRect: ({ children }) => children,
  SweepGradient: () => null,
  vec: jest.fn(),
}));
jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: { View },
    Easing: { inOut: (value) => value, ease: "ease", linear: "linear" },
    useAnimatedStyle: () => ({}),
    useDerivedValue: () => ({ value: 0 }),
    useSharedValue: (value) => ({ value }),
    withDelay: (_delay, value) => value,
    withRepeat: (value) => value,
    withTiming: (value) => value,
  };
});
jest.mock("react-native-keyboard-controller", () => ({
  useReanimatedKeyboardAnimation: () => ({ progress: { value: 0 } }),
}));
jest.mock("@/hooks/useAudioRecording", () => () => ({
  recordingCurrentState: "idle",
  record: jest.fn(),
  stopRecording: jest.fn(),
}));
jest.mock("@/hooks/useTranscribeAudio", () => ({
  useTranscribeAudio: () => ({
    transcribeAudio: jest.fn(),
    isTranscribing: false,
  }),
}));

import { ExerciseTextComposer } from "./ExerciseTextComposer";

describe("ExerciseTextComposer", () => {
  it("hides entry controls at maxItems while leaving remove actions enabled", () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(
        <ExerciseTextComposer
          mode="list"
          items={["One", "Two"]}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          maxItems={2}
        />,
      );
    });

    expect(renderer.root.findAllByType(TextInput)).toHaveLength(0);
    expect(
      renderer.root.findAllByProps({ accessibilityLabel: "Start voice input" }),
    ).toHaveLength(0);
    expect(
      renderer.root.findAllByProps({ accessibilityLabel: "Add item" }),
    ).toHaveLength(0);

    const removeButton = renderer.root.findByProps({
      accessibilityLabel: "Remove item 1: One",
    });
    expect(typeof removeButton.props.onPress).toBe("function");
    expect(removeButton.props.disabled).not.toBe(true);
  });

  it("adds a list item on submit editing", () => {
    const onAdd = jest.fn();
    let renderer;

    act(() => {
      renderer = TestRenderer.create(
        <ExerciseTextComposer
          mode="list"
          items={[]}
          onAdd={onAdd}
          onRemove={jest.fn()}
        />,
      );
    });

    const input = renderer.root.findByType(TextInput);
    act(() => {
      input.props.onChangeText("Typed item");
    });
    act(() => {
      input.props.onSubmitEditing();
    });

    expect(onAdd).toHaveBeenCalledWith("Typed item");
  });

  it("enforces maxLength for list item input", () => {
    let renderer;

    act(() => {
      renderer = TestRenderer.create(
        <ExerciseTextComposer
          mode="list"
          items={[]}
          onAdd={jest.fn()}
          onRemove={jest.fn()}
          maxLength={5}
        />,
      );
    });

    const input = renderer.root.findByType(TextInput);
    act(() => {
      input.props.onChangeText("Hello");
    });
    expect(renderer.root.findByType(TextInput).props.value).toBe("Hello");

    act(() => {
      input.props.onChangeText("Hello!");
    });
    expect(renderer.root.findByType(TextInput).props.value).toBe("Hello");
  });
});

import { useCallback } from "react";
import { useColorScheme } from "react-native";
import { FeelingsType } from "@/src/network/genAi";
import { LIGHT_GRADIENT, DARK_GRADIENT, DEFAULT_NEW_TAG } from "../constants";

interface UseTagsProps {
  setTags: (tags: FeelingsType[] | ((prev: FeelingsType[]) => FeelingsType[])) => void;
}

interface UseTagsReturn {
  removeTag: (index: number) => void;
  addTag: () => void;
}

/**
 * Hook to manage tag operations (add, remove)
 * Handles tag color schemes based on theme
 */
export const useTags = ({ setTags }: UseTagsProps): UseTagsReturn => {
  const colorScheme = useColorScheme();

  const removeTag = useCallback(
    (index: number): void => {
      setTags((prevTags: FeelingsType[]) =>
        prevTags.filter((_: FeelingsType, i: number) => i !== index)
      );
    },
    [setTags]
  );

  const addTag = useCallback((): void => {
    setTags((prevTags: FeelingsType[]) => [
      ...prevTags,
      {
        name: DEFAULT_NEW_TAG.name,
        emoji: DEFAULT_NEW_TAG.emoji,
        colorsGradient:
          colorScheme === "dark" ? [...DARK_GRADIENT] : [...LIGHT_GRADIENT],
          intensity: 1,
      },
    ]);
  }, [colorScheme, setTags]);

  return {
    removeTag,
    addTag,
  };
};

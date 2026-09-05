import { ColorValue } from "react-native";
import { NodeType, NodeState } from "@/src/types/journey";
import { SAGE } from "@/src/theme/palette";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export interface NodeViewModel {
  faceColor: ColorValue;
  rimColor: ColorValue;
  iconColor: ColorValue;
  iconName: string | null;
  shapeKey: "circle" | "hexagon" | "chest" | "rosette";
  isInteractive: boolean;
  indicator: "none" | "lock" | "check" | "pulse" | "open-chest";
}

export function useNodeViewModel(
  type: NodeType,
  state: NodeState,
  baseIcon: string | null
): NodeViewModel {
  let faceColor: ColorValue = SAGE[300];
  let rimColor: ColorValue = SAGE[500];
  let iconColor: ColorValue = SAGE[700];
  let isInteractive = true;
  let indicator: NodeViewModel["indicator"] = "none";
  let iconName = baseIcon;
  let shapeKey: NodeViewModel["shapeKey"] = "circle";

  // 1. Determine shape
  switch (type) {
    case NodeType.LESSON:
      shapeKey = "circle";
      break;
    case NodeType.CHECKPOINT:
      shapeKey = "hexagon";
      iconName = "shield";
      break;
    case NodeType.CHEST:
      shapeKey = "chest";
      iconName = "gift";
      break;
    case NodeType.MILESTONE:
      shapeKey = "rosette";
      iconName = "award";
      break;
  }

  // 2. Determine state colors and indicator
  switch (state) {
    case NodeState.LOCKED:
      faceColor = SAGE[100];
      rimColor = SAGE[400];
      iconColor = SAGE[400];
      isInteractive = false;
      indicator = "lock";
      break;
    case NodeState.AVAILABLE:
      faceColor = SAGE[300];
      rimColor = SAGE[400];
      iconColor = SAGE[700];
      break;
    case NodeState.CURRENT:
      faceColor = SAGE[500];
      rimColor = SAGE[600];
      iconColor = "#FFFFFF";
      indicator = "pulse";
      break;
    case NodeState.COMPLETED:
      faceColor = SAGE[700];
      rimColor = SAGE[800];
      iconColor = "#FFFFFF";
      indicator = "check";
      break;
    case NodeState.CLAIMED:
      faceColor = SAGE[700];
      rimColor = SAGE[800];
      iconColor = "#FFFFFF";
      indicator = "open-chest";
      break;
  }

  return {
    faceColor,
    rimColor,
    iconColor,
    iconName,
    shapeKey,
    isInteractive,
    indicator,
  };
}

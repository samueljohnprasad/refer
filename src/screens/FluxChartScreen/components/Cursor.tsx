import { CHART_HEIGHT, CROSSHAIR_RADIUS } from "../constants/chart";
import { Circle, Path, Skia } from "@shopify/react-native-skia";
import type { Cursor as CursorType } from "../types";

type CursorProps = {
  cursor: CursorType;
};

function makeCrosshairLinePath(x: number) {
  // ponytail: Skia 2.x Line factory
  return Skia.Path.Line({ x, y: 0 }, { x, y: CHART_HEIGHT });
}

export const Cursor = ({ cursor }: CursorProps) => {
  const { x, y } = cursor;

  return (
    <>
      <Path
        path={makeCrosshairLinePath(x)}
        style="stroke"
        strokeWidth={1}
        color="rgba(0, 0, 0, 0.12)"
      />
      <Circle
        cx={x}
        cy={y}
        r={CROSSHAIR_RADIUS}
        color="#FFFFFF"
        style="stroke"
        strokeWidth={2}
      />
      <Circle cx={x} cy={y} r={CROSSHAIR_RADIUS - 1} color="#32C5FF" />
    </>
  );
};

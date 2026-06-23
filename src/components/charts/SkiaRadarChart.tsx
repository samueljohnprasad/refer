import React, { useMemo } from "react";
import { View } from "react-native";
import {
  Canvas,
  Path,
  Circle,
  LinearGradient,
  RadialGradient,
  vec,
  Skia,
  Blur,
  Paint,
  Group,
} from "@shopify/react-native-skia";
import { Text } from "@/src/components/ui/Text";

export interface RadarDataPoint {
  label: string;
  value: number; // 0-1
}

interface SkiaRadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  fillColor?: string;
  strokeColor?: string;
}

const RING_COUNT = 4;

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function buildPolygonPath(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  startAngle: number,
): string {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides;
    points.push(polarToCartesian(cx, cy, radius, angle));
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  d += " Z";
  return d;
}

function buildDataPath(
  cx: number,
  cy: number,
  maxRadius: number,
  data: RadarDataPoint[],
  startAngle: number,
): string {
  const sides = data.length;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides;
    const r = maxRadius * Math.max(0.05, data[i].value);
    points.push(polarToCartesian(cx, cy, r, angle));
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  d += " Z";
  return d;
}

export function SkiaRadarChart({
  data,
  size = 280,
  fillColor = "#6BA3FF",
  strokeColor = "#4A90E2",
}: SkiaRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.36;
  const sides = data.length;
  const startAngle = -Math.PI / 2; // Top

  const { ringPaths, spokePaths, dataPath, vertexPoints, labelPositions } =
    useMemo(() => {
      const rings: string[] = [];
      for (let ring = 1; ring <= RING_COUNT; ring++) {
        const r = (maxRadius / RING_COUNT) * ring;
        rings.push(buildPolygonPath(cx, cy, r, sides, startAngle));
      }

      const spokes: string[] = [];
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + (2 * Math.PI * i) / sides;
        const end = polarToCartesian(cx, cy, maxRadius, angle);
        spokes.push(`M ${cx} ${cy} L ${end.x} ${end.y}`);
      }

      const dPath = buildDataPath(cx, cy, maxRadius, data, startAngle);

      const vertices: { x: number; y: number }[] = [];
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + (2 * Math.PI * i) / sides;
        const r = maxRadius * Math.max(0.05, data[i].value);
        vertices.push(polarToCartesian(cx, cy, r, angle));
      }

      const labels: { x: number; y: number; angle: number }[] = [];
      for (let i = 0; i < sides; i++) {
        const angle = startAngle + (2 * Math.PI * i) / sides;
        const r = maxRadius + 28;
        const pos = polarToCartesian(cx, cy, r, angle);
        labels.push({ ...pos, angle });
      }

      return {
        ringPaths: rings,
        spokePaths: spokes,
        dataPath: dPath,
        vertexPoints: vertices,
        labelPositions: labels,
      };
    }, [cx, cy, maxRadius, sides, data, startAngle]);

  return (
    <View style={{ width: size, height: size, alignSelf: "center" }}>
      <Canvas style={{ width: size, height: size }}>
        {/* Grid rings — 3D-ish with slight shadow */}
        {ringPaths.map((d, i) => (
          <React.Fragment key={`ring-${i}`}>
            {/* Shadow ring offset */}
            <Path
              path={d}
              style="stroke"
              strokeWidth={1}
              color="rgba(255, 255, 255, 0.06)"
              strokeJoin="round"
            />
            {/* Main ring */}
            <Path
              path={d}
              style="stroke"
              strokeWidth={i === RING_COUNT - 1 ? 1.5 : 0.8}
              color={
                i === RING_COUNT - 1
                  ? "rgba(255, 255, 255, 0.35)"
                  : "rgba(255, 255, 255, 0.15)"
              }
              strokeJoin="round"
            />
          </React.Fragment>
        ))}

        {/* Spokes */}
        {spokePaths.map((d, i) => (
          <Path
            key={`spoke-${i}`}
            path={d}
            style="stroke"
            strokeWidth={0.6}
            color="rgba(255, 255, 255, 0.12)"
          />
        ))}

        {/* Data fill — gradient from center */}
        <Path path={dataPath} style="fill">
          <RadialGradient
            c={vec(cx, cy)}
            r={maxRadius}
            colors={[
              "rgba(255, 255, 255, 0.6)",
              `${fillColor}80`,
              `${fillColor}40`,
            ]}
          />
        </Path>

        {/* Data stroke */}
        <Path
          path={dataPath}
          style="stroke"
          strokeWidth={2}
          color={strokeColor}
          strokeJoin="round"
        />

        {/* Glow behind data shape */}
        <Group
          layer={
            <Paint>
              <Blur blur={12} />
            </Paint>
          }
        >
          <Path path={dataPath} style="fill" color={`${fillColor}30`} />
        </Group>

        {/* Center glow */}
        <Circle cx={cx} cy={cy} r={maxRadius * 0.25} opacity={0.3}>
          <RadialGradient
            c={vec(cx, cy)}
            r={maxRadius * 0.25}
            colors={["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
          />
        </Circle>

        {/* Vertex dots */}
        {vertexPoints.map((pt, i) => (
          <React.Fragment key={`vertex-${i}`}>
            <Circle cx={pt.x} cy={pt.y} r={4} color="#1A1A2E" />
            <Circle cx={pt.x} cy={pt.y} r={3} color={strokeColor} />
          </React.Fragment>
        ))}
      </Canvas>

      {/* Labels — rotated pills along spoke direction */}
      {labelPositions.map((pos, i) => {
        // Angle in degrees from center to this label
        const angleDeg = (pos.angle * 180) / Math.PI;
        // Rotate pill to align along the spoke; flip if on left side so text reads LTR
        const pillRotation =
          angleDeg > 90 || angleDeg < -90 ? angleDeg + 180 : angleDeg;
        return (
          <View
            key={`label-${i}`}
            style={{
              position: "absolute",
              left: pos.x - 32,
              top: pos.y - 12,
              width: 64,
              height: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(55, 55, 65, 0.9)",
              borderRadius: 12,
              transform: [{ rotate: `${pillRotation}deg` }],
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              {data[i].label.toLowerCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

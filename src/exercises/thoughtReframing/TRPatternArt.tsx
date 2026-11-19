// ponytail: pure JSX around trArt's SVG strings — the pattern pictures, the intro scene and the path glyphs.
import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { glyphXml, introXml, patternXml } from "./trArt";

export function TRPatternArt({ name, size = 64 }: { name: string; size?: number }): React.JSX.Element {
  return <SvgXml xml={patternXml(name)} width={size} height={size} />;
}

export function TRPathGlyph({ name }: { name: "notice" | "weigh" | "reframe" | "check" }): React.JSX.Element {
  return <SvgXml xml={glyphXml(name)} width={48} height={48} />;
}

export function TRIntroScene(): React.JSX.Element {
  return (
    <View className="overflow-hidden rounded-[20px]" style={{ aspectRatio: 320 / 168, backgroundColor: "#f6ecd8" }}>
      <SvgXml
        xml={introXml()}
        width="100%"
        height="100%"
        accessibilityLabel="A grey cloud drifting out of a crooked frame, and a straightened frame showing sun"
      />
    </View>
  );
}

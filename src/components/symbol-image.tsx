// ponytail: use expo-image sf: and expo-symbols without lucide dependency
import { Image as ExpoImage, type ImageProps, type ImageStyle } from "expo-image";
import { SymbolView } from "expo-symbols";
import { withUniwind } from "uniwind";

const Image = withUniwind(ExpoImage);

type SymbolImageProps = {
  /** SF Symbol name (e.g. "arrow.up", "chevron.down") */
  name: string;
  size?: number;
  tintColor?: string;
  style?: ImageStyle;
  className?: string;
  sfEffect?: ImageProps["sfEffect"];
  transition?: ImageProps["transition"];
};

export function SymbolImage({
  name,
  size = 24,
  tintColor,
  style,
  className,
  sfEffect,
  transition,
}: SymbolImageProps) {
  if (process.env.EXPO_OS === "ios") {
    return (
      <Image
        sfEffect={sfEffect}
        transition={transition}
        source={`sf:${name}`}
        style={[{ width: size, height: size }, style]}
        tintColor={tintColor}
        className={className}
      />
    );
  }

  return (
    <SymbolView
      name={name as any}
      size={size}
      tintColor={tintColor}
      style={[{ width: size, height: size }, style]}
      className={className}
    />
  );
}

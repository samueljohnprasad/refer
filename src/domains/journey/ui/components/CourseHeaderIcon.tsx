import { SymbolView } from "expo-symbols";

type CourseHeaderIconProps = {
  color?: string;
  height?: number;
  width?: number;
};

export function CourseHeaderIcon({
  color = "#243323",
  height = 24,
  width = 24,
}: CourseHeaderIconProps): React.JSX.Element {
  const size = Math.min(width, height);

  return (
    <SymbolView
      name="book.closed.fill"
      size={size}
      tintColor={color}
      weight="semibold"
      style={{ width, height }}
    />
  );
}

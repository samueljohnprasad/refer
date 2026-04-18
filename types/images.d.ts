declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  import type { SvgProps } from "react-native-svg";

  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpg" {
  import type { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.jpeg" {
  import type { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.gif" {
  import type { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.webp" {
  import type { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export default content;
}

declare module "*.lottie" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  import React from "react";
  import type { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// ponytail: remotion root entry registering WelcomeHero
import React from "react";
import { Composition } from "remotion";
import { WelcomeHero } from "./WelcomeHero";
import { COMP } from "./journey";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WelcomeHero"
    component={WelcomeHero}
    durationInFrames={COMP.durationInFrames}
    fps={COMP.fps}
    width={COMP.width}
    height={COMP.height}
  />
);

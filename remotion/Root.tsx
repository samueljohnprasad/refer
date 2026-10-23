// ponytail: remotion root entry registering WelcomeHero
import React from "react";
import { Composition } from "remotion";
import { WelcomeHero } from "./WelcomeHero";
import { COMP } from "./journey";
import { HappyScenePreview } from "./HappyScene";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="HappyMascot" component={HappyScenePreview} durationInFrames={600} fps={60} width={780} height={1688} />
  <Composition
    id="WelcomeHero"
    component={WelcomeHero}
    durationInFrames={COMP.durationInFrames}
    fps={COMP.fps}
    width={COMP.width}
    height={COMP.height}
  />
  </>
);

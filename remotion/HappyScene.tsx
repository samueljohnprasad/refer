import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { art, scenery } from "../src/components/ui/happy-scene/art";
import { HAPPY_LAYERS, type HappyLayer } from "../src/components/ui/happy-scene/layers";
import { getHappyPose, SCENE, type HappyPose } from "../src/components/ui/happy-scene/pose";

function Layer({ layer, pose }: { layer: HappyLayer; pose: HappyPose }): React.JSX.Element {
  return (
    <g transform={layer.pose ? `matrix(${pose[layer.pose].join(" ")})` : undefined}>
      {layer.art && <g dangerouslySetInnerHTML={{ __html: art[layer.art] }} />}
      {layer.children?.map((child, index) => <Layer key={index} layer={child} pose={pose} />)}
    </g>
  );
}

export function HappyScenePreview(): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = getHappyPose(frame / fps * 1000);
  return (
    <svg width="100%" height="100%" viewBox="0 0 390 844">
      <g dangerouslySetInnerHTML={{ __html: scenery.background }} />
      <g transform={`matrix(${pose.cloud.join(" ")})`} dangerouslySetInnerHTML={{ __html: scenery.cloud }} />
      <g transform={`matrix(${pose.plant.join(" ")})`} dangerouslySetInnerHTML={{ __html: scenery.plant }} />
      <g transform={`translate(195 ${SCENE.floor}) scale(${SCENE.scale}) translate(-120 -226)`}>
        {HAPPY_LAYERS.map((layer, index) => <Layer key={index} layer={layer} pose={pose} />)}
      </g>
    </svg>
  );
}

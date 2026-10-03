// ponytail: remotion welcome hero composition
import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  continueRender,
  delayRender,
} from "remotion";
import {
  BACKGROUND,
  BUTTON,
  COMP,
  COPY,
  NEUTRAL_RIM,
  NODE_SIZE,
  NODE_STATE,
  NODES,
  shade,
  TODAY_INDEX,
  TODAY_SIZE,
  type IconKind,
  smoothPath,
  starPath,
  trailPoints,
} from "./journey";

/* -------------------------------------------------------------------------- */
/* Fonts — Anton for the condensed bold headline, Caveat for the handwritten   */
/* node labels. The original PNG used exactly this pairing (verified by the   */
/* earlier design-tool exploration: "condensed sans" title, "handwriting"      */
/* labels) rather than the app's own Nunito.                                  */
/* -------------------------------------------------------------------------- */

const fontHandle = delayRender("Loading fonts");
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Caveat:wght@500;700&display=swap";
fontLink.onload = () => {
  document.fonts.ready.then(() => continueRender(fontHandle));
};
fontLink.onerror = () => continueRender(fontHandle);
document.head.appendChild(fontLink);

const HEADLINE_FONT = '"Nunito", ui-sans-serif, system-ui, sans-serif';
const HAND_FONT = '"Caveat", cursive';
const INK = "#1E2A33";
const INK_SOFT = "#6C7A85";

/* -------------------------------------------------------------------------- */
/* Timeline — 210f / 7s. One-shot reveal, then rest with ambient loops —       */
/* the Duolingo pattern the research called out, not infinite progress.       */
/* -------------------------------------------------------------------------- */

const NODE_STAGGER = 16;
const NODE_START = 58;
// Every node before Today completes live, in order — node 0 first, then 1,
// then 2 — each waiting until its own entrance has fully settled
// (NODE_STAGGER=16, entrance takes ~20f) before it completes.
const COMPLETE_START = 80;
const COMPLETE_STAGGER = 26;
// How long the path segment after a completing node takes to fill solid.
const SEGMENT_FILL_DURATION = 16;

const T = {
  headline: 4,
  pathStart: 34,
  pathEnd: 34 + 44,
  nodeAt: (index: number) => NODE_START + index * NODE_STAGGER,
  completeAt: (index: number) => COMPLETE_START + index * COMPLETE_STAGGER,
  // Today's arrow/panda wait until the LAST pre-Today node has finished
  // completing and its path segment has fully filled in, plus a short beat.
  arrowAt:
    COMPLETE_START + (TODAY_INDEX - 1) * COMPLETE_STAGGER + SEGMENT_FILL_DURATION + 14,
  pandaAt:
    COMPLETE_START + (TODAY_INDEX - 1) * COMPLETE_STAGGER + SEGMENT_FILL_DURATION + 26,
} as const;

const TODAY = NODES[TODAY_INDEX];
// Pushed from 26 to 60 — the earlier gap read as the panda crowding the
// node rather than standing beside it.
const PANDA = { width: 260, left: TODAY.x + TODAY_SIZE / 2 + 60, top: TODAY.y - 158 } as const;

/** Clears the last node's true visual footprint — including the tactile
 *  rim, which sits size*0.118 below the face ellipse (NodeShapes.tsx's
 *  ratio) — with room to spare before the canvas edge. Verified
 *  numerically, see check-button.mjs. */
const LAST_NODE_FACE_RY = (NODE_SIZE / 2) * (45 / 55);
const LAST_NODE_BOTTOM = NODES[NODES.length - 1].y + LAST_NODE_FACE_RY + NODE_SIZE * 0.118;
/** Every "illustration + bottom button" reference (Liven, Alan, Mimo) leaves
 *  real breathing room here rather than sitting the button flush against the
 *  last node — reduced from 270 now that node spacing above reclaims most
 *  of that width itself and the path fills this gap instead of it reading
 *  as an empty margin. */
const TRAIL_BOTTOM_BAND = LAST_NODE_BOTTOM + 190;

// The trail now runs all the way down to (just under) the button, so it
// visually touches it — the button, drawn after, covers the exact seam.
const TRAIL = trailPoints(TRAIL_BOTTOM_BAND + 40);
const PATH_D = smoothPath(TRAIL);
const TRAIL_TOP = NODES[0].y - 60;
const TRAIL_BOTTOM = TRAIL[TRAIL.length - 1].y;

/* -------------------------------------------------------------------------- */
/* Icon glyphs — simple authored shapes, not an icon library, matching the     */
/* soft rounded style of the reference badges.                                */
/* -------------------------------------------------------------------------- */

const IconGlyph: React.FC<{ icon: IconKind; color: string; size: number }> = ({
  icon,
  color,
  size: s,
}) => {
  switch (icon) {
    case "lock":
      return (
        <g>
          <rect x={-s * 0.26} y={-s * 0.02} width={s * 0.52} height={s * 0.42} rx={s * 0.08} fill={color} />
          <path
            d={`M ${-s * 0.16} ${-s * 0.02} v ${-s * 0.14} a ${s * 0.16} ${s * 0.16} 0 0 1 ${s * 0.32} 0 v ${s * 0.14}`}
            fill="none"
            stroke={color}
            strokeWidth={s * 0.08}
            strokeLinecap="round"
          />
          <circle cx={0} cy={s * 0.17} r={s * 0.05} fill="#ffffff" />
        </g>
      );
    case "star":
      return <path d={starPath(s * 0.32, s * 0.14)} fill={color} />;
    case "heart":
      return (
        <path
          d={`M 0 ${s * 0.26} C ${-s * 0.48} ${-s * 0.04} ${-s * 0.2} ${-s * 0.4} 0 ${-s * 0.08} C ${s * 0.2} ${-s * 0.4} ${s * 0.48} ${-s * 0.04} 0 ${s * 0.26} Z`}
          fill={color}
        />
      );
    case "pencil":
      // A monochrome silhouette using `color`, like every other icon here —
      // the earlier multi-part hardcoded-color version (thin white body,
      // yellow tip, brown band) collapsed into an unreadable smear at badge
      // scale.
      return (
        <g transform="rotate(-40)">
          <rect x={-s * 0.09} y={-s * 0.32} width={s * 0.18} height={s * 0.5} rx={s * 0.03} fill={color} />
          <path d={`M ${-s * 0.09} ${-s * 0.32} L 0 ${-s * 0.48} L ${s * 0.09} ${-s * 0.32} Z`} fill={color} />
        </g>
      );
    case "leaf":
      return (
        <path
          d={`M 0 ${s * 0.32} C ${-s * 0.34} ${s * 0.08} ${-s * 0.28} ${-s * 0.34} ${s * 0.02} ${-s * 0.34} C ${s * 0.32} ${-s * 0.32} ${s * 0.32} ${s * 0.14} 0 ${s * 0.32} Z`}
          fill={color}
        />
      );
    case "sun":
      return (
        <g>
          <circle r={s * 0.2} fill={color} />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * s * 0.28}
                y1={Math.sin(a) * s * 0.28}
                x2={Math.cos(a) * s * 0.4}
                y2={Math.sin(a) * s * 0.4}
                stroke={color}
                strokeWidth={s * 0.055}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );
  }
};

/* -------------------------------------------------------------------------- */
/* Node badge                                                                  */
/* -------------------------------------------------------------------------- */

const JourneyNode: React.FC<{ index: number; frame: number }> = ({ index, frame }) => {
  const node = NODES[index];
  const isToday = index === TODAY_INDEX;
  // Every node before Today starts "plain" (its own icon, no wash, no check)
  // and completes live, in order — 0, then 1, then 2 — rather than some of
  // them starting pre-completed. Nodes after Today are locked; Today itself
  // is neither (already distinct: blue fill + breathing glow).
  const nodeCompleteAt = T.completeAt(index);
  const isCompleted = index < TODAY_INDEX && frame >= nodeCompleteAt;
  const isLocked = index > TODAY_INDEX;
  const size = isToday ? TODAY_SIZE : NODE_SIZE;
  const startAt = T.nodeAt(index);

  const appear = interpolate(frame, [startAt, startAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  // Today's node breathes gently once settled — the "you are here" cue,
  // without the pulsing-ring language that implies a tap.
  const breathe = isToday ? 1 + Math.sin(frame / 22) * 0.03 : 1;
  // A little extra bounce the instant this node flips to completed.
  const completePop =
    index < TODAY_INDEX
      ? interpolate(frame, [nodeCompleteAt, nodeCompleteAt + 8, nodeCompleteAt + 20], [1, 1.16, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        })
      : 1;
  const scale = Math.max(appear, 0) * breathe * completePop;

  // The exact tactile badge built for the earlier Duolingo-style pass —
  // ellipse face+rim (the same 45/55 ratio and RIM_DY as NodeShapes.tsx),
  // reused as-is rather than the circle version this pass had drifted to.
  //
  // Completed nodes get a solid gold face (the app's own NODE_COLORS.completed)
  // with a checkmark as the MAIN glyph — replacing the node's own icon rather
  // than badging a checkmark onto it. A corner badge on top of node 0's
  // padlock icon literally said "this lock is done", which every reference
  // screen (Life Reset, Cleo AI, Lloyds) resolves by having the check REPLACE
  // the icon, not sit beside it.
  const faceColor = isToday
    ? node.iconColor
    : isCompleted
      ? NODE_STATE.completed
      : isLocked
        ? NODE_STATE.locked
        : "#ffffff";
  const rimColor = isToday
    ? shade(node.iconColor, 0.68)
    : isCompleted
      ? shade(NODE_STATE.completed, 0.72)
      : NEUTRAL_RIM;
  const faceRx = size / 2;
  const faceRy = faceRx * (45 / 55);
  const rimDy = size * 0.118;
  const glossId = `node-gloss-${index}`;
  const checkR = size * 0.62 * 0.5;
  // Every pre-Today node draws its checkmark on at the moment it completes.
  const checkDraw =
    index < TODAY_INDEX
      ? interpolate(frame, [nodeCompleteAt + 2, nodeCompleteAt + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 1;

  return (
    <g transform={`translate(${node.x} ${node.y}) scale(${scale})`} opacity={appear}>
      {isToday ? (
        <circle r={faceRx + 20} fill={node.iconColor} opacity={0.16 + Math.sin(frame / 22) * 0.05} />
      ) : null}
      <defs>
        <clipPath id={glossId}>
          <ellipse cy={0} rx={faceRx} ry={faceRy} />
        </clipPath>
        <filter id={`node-shadow-${index}`} x="-60%" y="-40%" width="220%" height="220%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={10} />
          <feOffset dy={14} />
          <feComponentTransfer>
            <feFuncA type="linear" slope={0.22} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
          </feMerge>
        </filter>
      </defs>
      {/* Soft lift shadow — the Liven/Bears Gratitude badge pattern, so the
          icon badge reads as sitting above the sky rather than flat on it. */}
      <ellipse cy={rimDy} rx={faceRx} ry={faceRy} fill="#142414" filter={`url(#node-shadow-${index})`} />
      {/* Rim */}
      <ellipse cy={rimDy} rx={faceRx} ry={faceRy} fill={rimColor} />
      {/* Face */}
      <ellipse rx={faceRx} ry={faceRy} fill={faceColor} />
      {/* Gloss — two diagonal highlight stripes, clipped to the face */}
      <g clipPath={`url(#${glossId})`} opacity={0.3}>
        <rect x={-faceRx - 20} y={-faceRy + 4} width={faceRx * 2 + 40} height={24} fill="#ffffff" transform="rotate(-45 0 0)" />
        <rect x={-faceRx - 20} y={16} width={faceRx * 2 + 40} height={18} fill="#ffffff" transform="rotate(-45 0 0)" />
      </g>
      {isCompleted ? (
        <path
          d={`M ${-checkR * 0.55} 0 L ${-checkR * 0.05} ${checkR * 0.5} L ${checkR * 0.6} ${-checkR * 0.5}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth={checkR * 0.34}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - checkDraw}
        />
      ) : isLocked ? (
        // A dedicated lock glyph, not a dimmed preview of the node's own
        // future icon — the pattern every locked-step reference converges on
        // (Life Reset, Duolingo ABC, Alan, Paired, Tripadvisor all swap in a
        // lock rather than fading the destination's own icon).
        <IconGlyph icon="lock" color="#B7C4CE" size={size * 0.56} />
      ) : (
        <IconGlyph icon={node.icon} color={isToday ? "#ffffff" : node.iconColor} size={size * 0.62} />
      )}

      {/* Locked ring — a dashed outline around the muted face, matching the
          same references' "not yet reached" treatment instead of a flat
          wash with no edge definition. */}
      {isLocked ? (
        <ellipse
          rx={faceRx + 9}
          ry={faceRy + 7}
          fill="none"
          stroke={NEUTRAL_RIM}
          strokeWidth={3}
          strokeDasharray="7 7"
        />
      ) : null}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/* Labels — handwritten, alternating sides exactly as authored per node        */
/* -------------------------------------------------------------------------- */

const NodeLabel: React.FC<{ index: number; frame: number }> = ({ index, frame }) => {
  const node = NODES[index];
  if (index === TODAY_INDEX) return null;

  const startAt = T.nodeAt(index) + 4;
  const appear = interpolate(frame, [startAt, startAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const gap = NODE_SIZE / 2 + 22;
  const width = 300;

  // Forest's step-indicator pattern: only the current step reads at full
  // weight, everything else rests quieter so the eye has one focal point
  // instead of six equally-loud labels. Locked (not-yet-reached) nodes dim
  // the most; completed ones dim slightly once the scene has moved past them.
  const isLocked = index > TODAY_INDEX;
  const isCompleted = index < TODAY_INDEX && frame >= T.completeAt(index);
  const restOpacity = isLocked ? 0.45 : isCompleted ? 0.72 : 1;

  return (
    <div
      style={{
        position: "absolute",
        top: node.y - 46,
        width,
        textAlign: node.side === "left" ? "right" : "left",
        ...(node.side === "left"
          ? { right: COMP.width - (node.x - gap) }
          : { left: node.x + gap }),
        fontFamily: HAND_FONT,
        fontWeight: 600,
        fontSize: 38,
        lineHeight: 1.1,
        color: INK_SOFT,
        opacity: appear * restOpacity,
        transform: `translateX(${(1 - appear) * (node.side === "left" ? 14 : -14)}px)`,
      }}
    >
      {node.label.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
};

/** "Today / Start here" plus a hand-drawn arrow pointing at the current node —
 *  the one callout that gets special treatment, matching the reference. */
const TodayCallout: React.FC<{ frame: number }> = ({ frame }) => {
  const startAt = T.nodeAt(TODAY_INDEX) + 4;
  const appear = interpolate(frame, [startAt, startAt + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrowDraw = interpolate(frame, [T.arrowAt, T.arrowAt + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const gap = TODAY_SIZE / 2 + 30;
  const boxWidth = 260;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: TODAY.y - 74,
          right: COMP.width - (TODAY.x - gap),
          width: boxWidth,
          textAlign: "right",
          fontFamily: HAND_FONT,
          opacity: appear,
          transform: `translateX(${(1 - appear) * 14}px)`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 52, color: "#2F7FE0", lineHeight: 1.05 }}>Today</div>
        <div style={{ fontWeight: 600, fontSize: 34, color: INK_SOFT, marginTop: 2 }}>Start here</div>
      </div>
      <svg
        width={90}
        height={60}
        viewBox="0 0 90 60"
        style={{
          position: "absolute",
          left: TODAY.x - gap - 78,
          // Clears the "Today / Start here" text block beneath it — an earlier
          // pass had the arrow start overlapping the second text line.
          top: TODAY.y + 52,
          opacity: appear,
        }}
      >
        <path
          d="M 4 4 C 30 4 40 30 82 40"
          fill="none"
          stroke={INK_SOFT}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - arrowDraw}
        />
        <path
          d="M 68 32 L 84 41 L 70 50"
          fill="none"
          stroke={INK_SOFT}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrowDraw}
        />
      </svg>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* Composition                                                                 */
/* -------------------------------------------------------------------------- */

export const WelcomeHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = COMP;

  const pathReveal = interpolate(frame, [T.pathStart, T.pathEnd], [TRAIL_TOP, TRAIL_BOTTOM], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const drift = Math.sin(frame / 90) * 8;

  // No back-ease overshoot here — every node already pops with that curve,
  // and reusing it on the mascot makes it read as another UI element rather
  // than a character. The landing itself (squash below) sells the arrival.
  const pandaIn = interpolate(frame, [T.pandaAt, T.pandaAt + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // A real idle breathing loop pairs vertical motion with squash-stretch and
  // runs slow (~2s) — the previous 11-frame pure-sine bob was a fast
  // symmetric twitch with no volume change, the single most common "AI
  // motion" tell. Phase-shifted stretch (squash at the low point, stretch at
  // the high point) plus a slower, differently-timed tilt breaks the
  // perfect mirror-symmetry a single sine wave always has.
  const phase = frame / 50;
  const pandaBob = Math.sin(phase) * 9;
  const stretch = Math.cos(phase) * 0.025;
  const pandaTilt = Math.sin(phase * 0.47 + 1.3) * 1.6;
  // A quick extra squash right on landing, independent of the idle loop.
  const landSquash = interpolate(
    frame,
    [T.pandaAt, T.pandaAt + 7, T.pandaAt + 16],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) },
  );
  const scaleY = Math.max(pandaIn, 0) * (1 + stretch - landSquash * 0.1);
  const scaleX = Math.max(pandaIn, 0) * (1 - stretch * 0.6 + landSquash * 0.14);

  const headlineLine = (i: number) =>
    interpolate(frame, [T.headline + i * 6, T.headline + i * 6 + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  const subhead = interpolate(frame, [T.headline + 16, T.headline + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BACKGROUND.top} 0%, ${BACKGROUND.mid} 46%, ${BACKGROUND.bottom} 82%)`,
      }}
    >
      {/* Blurred botanical corners, slowly drifting — the mymind/Headspace
          calm-premium pattern: a background blur orb that never sits still,
          not a static blob. */}
      <div
        style={{
          ...blob("#8C7FD6", -140, height - 420, 560),
          transform: `translate(${Math.sin(frame / 110) * 22}px, ${Math.cos(frame / 130) * 16}px)`,
        }}
      />
      <div
        style={{
          ...blob("#3FC7A6", width - 380, height - 340, 520),
          transform: `translate(${Math.sin(frame / 95 + 2) * -18}px, ${Math.cos(frame / 120 + 2) * 20}px)`,
        }}
      />

      <div style={{ position: "absolute", top: 176, left: 72, right: 72 }}>
        {COPY.headline.map((line, i) => (
          <div
            key={line}
            style={{
              fontFamily: HEADLINE_FONT,
              fontWeight: 800,
              fontSize: 92,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: INK,
              opacity: headlineLine(i),
              transform: `translateY(${(1 - headlineLine(i)) * 26}px)`,
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            marginTop: 20,
            fontFamily: HAND_FONT,
            fontWeight: 600,
            fontSize: 44,
            color: INK_SOFT,
            opacity: subhead,
            transform: `translateY(${(1 - subhead) * 16}px)`,
          }}
        >
          {COPY.subhead}
        </div>
      </div>

      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <clipPath id="trail-clip">
              <rect x={0} y={0} width={width} height={pathReveal} />
            </clipPath>
          </defs>
          <g clipPath="url(#trail-clip)">
            <path
              d={PATH_D}
              fill="none"
              stroke="#A9D4EF"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray="1 20"
            />

            {/* Shares this same reveal clip so the already-completed 0→2
                stretch draws in as solid gold alongside the dotted path,
                rather than popping in fully-formed a beat later. */}
            <ProgressFill frame={frame} />
          </g>

          {NODES.map((_, i) => (
            <JourneyNode key={i} index={i} frame={frame} />
          ))}
        </svg>

        {NODES.map((_, i) => (
          <NodeLabel key={i} index={i} frame={frame} />
        ))}
        <TodayCallout frame={frame} />
        {NODES.slice(0, TODAY_INDEX).map((_, i) => (
          <XpFloat key={i} frame={frame} index={i} />
        ))}

        {/* Ground shadow — pinned to the floor, not inside the character's
            transform. A shadow that rigidly floats and squashes WITH the
            character (as a child of its transform) instead of staying put
            and pulsing inversely is one of the clearest "this wasn't
            animated by hand" tells. */}
        <div
          style={{
            position: "absolute",
            left: PANDA.left + PANDA.width * 0.18,
            top: PANDA.top + PANDA.width * 0.87,
            width: PANDA.width * 0.64,
            height: 30,
            borderRadius: "50%",
            background: "rgba(20, 50, 70, 0.14)",
            filter: "blur(12px)",
            opacity: Math.max(pandaIn, 0) * (1 - pandaBob / 9 * 0.35),
            transform: `scale(${1 - pandaBob / 9 * 0.12})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: PANDA.left,
            top: PANDA.top,
            width: PANDA.width,
            opacity: pandaIn,
            transformOrigin: "bottom center",
            transform: `translateY(${(1 - pandaIn) * 46 + pandaBob}px) rotate(${pandaTilt}deg) scale(${scaleX}, ${scaleY})`,
          }}
        >
          <Img src={staticFile("images/panda/panda-happy.png")} style={{ width: "100%" }} />
          <FloatingHeart frame={frame} at={T.pandaAt + 14} left={PANDA.width * 0.78} top={-24} />
        </div>
      </AbsoluteFill>

      {/* Outside the drifting layer — a real button doesn't parallax with
          the background. */}
      <BeginButtonMock frame={frame} />
    </AbsoluteFill>
  );
};

/** "+15 XP" rising off a node the instant IT completes. One instance per
 *  pre-Today node, each keyed to that node's own completeAt — one-shot, not
 *  looping (unlike FloatingHeart), since each node only completes once. */
const XpFloat: React.FC<{ frame: number; index: number }> = ({ frame, index }) => {
  const at = T.completeAt(index);
  const duration = 40;
  if (frame < at || frame > at + duration) return null;
  const t = (frame - at) / duration;
  const node = NODES[index];
  const rise = interpolate(t, [0, 1], [0, -90], { easing: Easing.out(Easing.cubic) });
  const opacity = interpolate(t, [0, 0.12, 0.72, 1], [0, 1, 1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: node.x - 90,
        top: node.y - 130 + rise,
        width: 180,
        textAlign: "center",
        fontFamily: HAND_FONT,
        fontWeight: 700,
        fontSize: 46,
        color: "#C79A00",
        opacity,
      }}
    >
      +15 XP
    </div>
  );
};

/**
 * Each segment lights up solid (not dotted) as the node before it completes
 * — "the progress advances to the next node," one segment at a time from
 * node 0 through to Today. Same y-band clip technique as the base trail
 * reveal; see segmentFillY above for the per-segment math.
 *
 * Renders as a fragment MEANT TO SIT INSIDE the main <svg>, sandwiched
 * between the base path and the node circles — not as its own top-level
 * <svg>. A separate later <svg> would paint on top of every node it passes
 * through (the trick that hides the base path's center under each node's
 * opaque face only works within one shared stacking context).
 */
/**
 * One path segment lights up solid right after the node BEFORE it
 * completes — segment i→i+1 fills over [completeAt(i), completeAt(i)+
 * SEGMENT_FILL_DURATION]. The overall fill boundary is the furthest any
 * segment has reached so far, so each segment's fill starts exactly where
 * the previous one left off — a continuous line, not independent ones that
 * might visually overlap or leave a gap.
 */
const segmentFillY = (frame: number): number => {
  let y = NODES[0].y - 40;
  for (let i = 0; i < TODAY_INDEX; i++) {
    const from = NODES[i].y;
    const to = i + 1 < NODES.length ? NODES[i + 1].y : TODAY.y;
    const segFillY = interpolate(
      frame,
      [T.completeAt(i), T.completeAt(i) + SEGMENT_FILL_DURATION],
      [from, to],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
    );
    y = Math.max(y, segFillY);
  }
  return y;
};

const ProgressFill: React.FC<{ frame: number }> = ({ frame }) => {
  const pathStartY = NODES[0].y - 40;
  const fillY = segmentFillY(frame);
  return (
    <>
      <clipPath id="progress-fill-clip">
        <rect x={0} y={pathStartY} width={COMP.width} height={Math.max(0, fillY - pathStartY)} />
      </clipPath>
      <g clipPath="url(#progress-fill-clip)">
        <path d={PATH_D} fill="none" stroke={NODE_STATE.completed} strokeWidth={9} strokeLinecap="round" />
      </g>
    </>
  );
};

const FloatingHeart: React.FC<{ frame: number; at: number; left: number; top: number }> = ({
  frame,
  at,
  left,
  top,
}) => {
  if (frame < at) return null;
  const cycle = ((frame - at) % 70) / 70;
  const rise = interpolate(cycle, [0, 1], [0, -46]);
  const opacity = interpolate(cycle, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
  return (
    <div style={{ position: "absolute", left, top: top + rise, fontSize: 34, opacity }}>
      <svg width={30} height={26} viewBox="-15 -13 30 26">
        <path
          d="M 0 8 C -15 -1 -6.5 -13 0 -3 C 6.5 -13 15 -1 0 8 Z"
          fill="#F25C68"
        />
      </svg>
    </div>
  );
};

/**
 * Space reservation only — the real Begin button ships in the app itself
 * (src/components/BeginButton.tsx / app/index.tsx), not baked into this
 * video. Rendered here as the app's actual tactile button system
 * (src/components/ui/Button.tsx, variant "primary", size "xl": a rim
 * offset behind the face, face presses down onto it and springs back) so
 * the composition reads as the finished screen, not an empty gap.
 */
const BeginButtonMock: React.FC<{ frame: number }> = ({ frame }) => {
  const pressAt = COMP.durationInFrames - 26;
  const press = interpolate(
    frame,
    [pressAt, pressAt + 5, pressAt + 22],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );
  const faceY = press * BUTTON.pressDepth;
  const width = COMP.width - BUTTON.marginX * 2;
  const top = TRAIL_BOTTOM_BAND;
  // Faint idle breathe before the press beat — Noom/Finch's CTAs never sit
  // perfectly dead; a near-imperceptible scale keeps it reading as tappable.
  const idleBreathe = frame < pressAt ? 1 + Math.sin(frame / 34) * 0.012 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: BUTTON.marginX,
        top,
        width,
        height: BUTTON.height,
        transform: `scale(${idleBreathe})`,
      }}
    >
      {/* Rim */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: BUTTON.pressDepth,
          height: BUTTON.height,
          background: BUTTON.rim,
          borderRadius: BUTTON.height / 2,
        }}
      />
      {/* Face */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: faceY,
          height: BUTTON.height,
          background: BUTTON.face,
          borderRadius: BUTTON.height / 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: 40, color: BUTTON.label }}>
          Begin
        </span>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h13M13 6l6 6-6 6"
            stroke={BUTTON.label}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const blob = (color: string, left: number, top: number, size: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top,
  width: size,
  height: size,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 68%)`,
  opacity: 0.16,
});

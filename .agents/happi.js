/* Happi pose set for the prototypes.
   Rig geometry is copied from src/components/ui/happy-scene/art.ts (keep in sync); motion follows
   .agents/skills/rossark-motion-skill: flow between poses, moving holds, follow-through by delay,
   one clock per figure, still final frame for reduced motion, paused when off screen.
   Usage: <div class="happi" data-pose="cheer"></div>  ·  Happi.set(el, "proud")  ·  Happi.replay(el) */
(() => {
  const INK = "#252525", WHITE = "#fff", HEART = "#D3CDEB", SHADOW = "#BCD0AF";
  const P = { floor: [130, 244], body: [130, 227], heart: [130, 201], neck: [131, 152], earL: [80, 72], earR: [178, 76],
    eyes: [132, 109], shoulderL: [91, 158], elbowL: [91, 180], shoulderR: [169, 158], elbowR: [169, 180], pawL: [91, 204], pawR: [169, 204] };
  const D = {
    legL: "M96 211 L96.6 219.6 C97.2 225 98.5 231 100.5 235 C102.3 239 105.5 242.5 112 242.5 L117 242.5 C122.5 242.5 126.5 239.5 126.5 235 L126.5 211 Z",
    legR: "M164 211 L163.4 219.6 C162.8 225 161.5 231 159.5 235 C157.7 239 154.5 242.5 148 242.5 L143 242.5 C137.5 242.5 133.5 239.5 133.5 235 L133.5 211 Z",
    torso: "M95 152 C94 170 94.2 200.16 95 212 C95.5 217 96 220 97.5 222 C104 225.5 118 225.8 130 225.8 C142 225.8 156 225.5 162.5 222 C164 220 164.5 217 165 212 C165.8 200.16 166 170 165 152 Z",
    belly: "M98.5 206 C97.8 194.32 99.5 185.56 106 182.64 C113 180.77 122 180.53 130 180.53 C138 180.53 147 180.77 154 182.64 C160.5 185.56 162.2 194.32 161.5 206 L161.5 212 C161 216 159.5 218.5 156 220 C150 223.5 140 224.8 130 224.8 C120 224.8 110 223.5 104 220 C100.5 218.5 99 216 98.5 212 Z",
    bellyFold: "M117 220.6 C120 221.4 123.5 223.6 130 223.6 C136.5 223.6 140 221.4 143 220.6",
    heart: "M130 196.5 C125.83 188.5 116.56 190.5 117.95 199.5 C118.88 205.5 124.9 209.5 130 213 C135.1 209.5 141.12 205.5 142.05 199.5 C143.44 190.5 134.17 188.5 130 196.5 Z",
    upperArmL: "M81 158 A10 10 0 0 1 101 158 L101 180 A10 10 0 0 1 81 180 Z",
    forearmL: "M81 180 A10 10 0 0 1 101 180 L99.5 204 A8.5 8.5 0 0 1 82.5 204 Z",
    upperArmR: "M159 158 A10 10 0 0 1 179 158 L179 180 A10 10 0 0 1 159 180 Z",
    forearmR: "M159 180 A10 10 0 0 1 179 180 L177.5 204 A8.5 8.5 0 0 1 160.5 204 Z",
    earL: "M55.2 50.5 A24.5 23.5 0 1 1 104.2 50.5 A24.5 23.5 0 1 1 55.2 50.5 Z",
    earR: "M160.1 59.8 A24 23.5 0 1 1 208.1 59.8 A24 23.5 0 1 1 160.1 59.8 Z",
    head: "M98.9 51 C111.4 46.8 113.4 47.3 117.5 46.4 C121.8 45.4 127.3 40.4 131.4 40.4 C135.5 40.4 137.8 46.7 137.9 46.7 C177 49.7 210.2 84.8 210.7 122.1 C211.7 142.3 204.6 156.9 185.5 164.5 C170.3 171.3 150.2 170 131 170 C129.8 169.8 126.5 169.4 124 169.1 C121.5 168.8 118.7 168.4 116 168 C113.3 167.6 110.7 167 108 166.4 C105.3 165.8 103 165.2 100 164.3 C97 163.4 93.3 162.4 90 161.2 C86.7 160 83.3 158.8 80 157.3 C76.7 155.8 72.9 153.9 70 152 C67.1 150.1 64.5 148.1 62.4 146 C60.3 143.9 58.9 141.5 57.6 139.2 C56.3 136.9 55.4 134.2 54.5 132 C53.6 129.8 53 128.2 52.5 126 C52 123.8 51.8 121.3 51.6 119 C51.4 116.7 51.3 113.2 51.3 112.1 C51.3 88.2 69.8 61.1 98.9 51 Z",
    tufts: "M135.5 41.6 Q138.6 46 136.6 52 Q135.2 56.5 132.6 56.2 M140.5 47 Q147 52 144.5 62",
    mouth: "M124.22 132.15 Q125.97 136 128.43 134.95 Q130.53 134.25 131.93 132.5 Q133.32 134.6 135.43 134.95 Q137.88 136 139.28 132.5",
    mouthOpen: "M122.5 132.2 Q131.75 135.5 141 132.2 C141.3 141 137 145 131.75 145 C126.5 145 122.2 141 122.5 132.2 Z",
  };
  const EYES = [
    { patch: [97.5, 107, 25.5, 25, -8], white: [99, 107, 18.5, 17.5], pupil: [100.5, 109, 14], glints: [[95.5, 101.5, 3.3], [91.5, 107.5, 2]] },
    { patch: [166, 110.5, 25.5, 25.5, 6], white: [165.5, 110.75, 18, 17.75], pupil: [164.5, 113, 14], glints: [[159.5, 105, 3], [155.5, 111, 2]] },
  ];
  // pupil+glints shrink toward their own eye's pupil centre (never the other eye's) — the "pup" channel,
  // used for alarmed/narrowed looks. DOM order matches build()'s `data-pupils` markup: pupil, glint, glint per eye.
  const PUPIL_SHAPES = EYES.flatMap(e => [
    { x: e.pupil[0], y: e.pupil[1], r: e.pupil[2], ax: e.pupil[0], ay: e.pupil[1] },
    ...e.glints.map(g => ({ x: g[0], y: g[1], r: g[2], ax: e.pupil[0], ay: e.pupil[1] })),
  ]);
  const sizePupils = (circles, k) => circles.forEach((c, i) => {
    const s = PUPIL_SHAPES[i];
    c.setAttribute("cx", (s.ax + (s.x - s.ax) * k).toFixed(2));
    c.setAttribute("cy", (s.ay + (s.y - s.ay) * k).toFixed(2));
    c.setAttribute("r", (s.r * k).toFixed(2));
  });

  // Props, drawn upright with the grip at (0,0). The paw is drawn over them, so it reads as holding.
  const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
  const PROPS = {
    jar: `<g data-sway="jar"><rect x="-13" y="-31" width="26" height="31" rx="8" fill="#EEF6F2" ${S}/>
      <rect x="-14.5" y="-37" width="29" height="8" rx="3.5" fill="${INK}"/>
      <g data-bob><path d="M-7 -12a4.5 4.5 0 0 1 0-9a5.5 5.5 0 0 1 10-1.5a4.5 4.5 0 0 1 5 5.5a3.5 3.5 0 0 1-1 5z" fill="${HEART}"/></g>
      <path d="M-7.5 -25v7" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>`,
    frame: `<g data-sway="frame"><rect x="-19" y="-44" width="38" height="32" rx="5" fill="#fff" ${S}/>
      <circle cx="7" cy="-34" r="4" fill="#F6C453"/><path d="M-14 -16Q-6 -27 2 -20T15 -18V-16Z" fill="#A8C392"/></g>`,
    lens: `<g data-sway="lens"><path d="M0 0L9 -13" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="17" cy="-25" r="12" fill="#E2EEF8" fill-opacity=".7" stroke="${INK}" stroke-width="4"/>
      <path d="M11 -30a7 7 0 0 1 6-3" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>`,
    lantern: `<g data-sway="lantern"><circle data-glow cx="0" cy="25" r="24" fill="#FFE29A" fill-opacity=".35"/>
      <path d="M-6 8Q0 -6 6 8" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <rect x="-8" y="7" width="16" height="5" rx="2" fill="${INK}"/>
      <rect x="-10" y="11" width="20" height="24" rx="6" fill="#FFF0BF" ${S}/>
      <ellipse data-flame cx="0" cy="24" rx="3.5" ry="5.5" fill="#F4A94A"/>
      <rect x="-8" y="34" width="16" height="4" rx="2" fill="${INK}"/></g>`,
    can: `<g data-sway="can"><path d="M-12 -8Q-26 -14 -30 -4" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-30 -4l-4 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <rect x="-12" y="-14" width="24" height="20" rx="5" fill="#A8C392" ${S}/>
      <path d="M12 -10q9 0 9 8t-9 6" fill="none" stroke="${INK}" stroke-width="3"/></g>
      <g data-drops>${[0, 1, 2].map(() => `<ellipse cx="-36" cy="-6" rx="1.8" ry="3" fill="#8EC5E8"/>`).join("")}</g>`,
    flag: `<g data-sway="flag"><path d="M0 10V-52" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <g data-cloth><path d="M-1 -52L-30 -44L-1 -35Z" fill="#F6C453" ${S}/></g></g>`,
  };
  const GROUND = {
    sprout: `<g data-sprout transform="translate(40 244)"><path d="M0 0Q-2 -12 1 -20" fill="none" stroke="#7C9C6B" stroke-width="3" stroke-linecap="round"/>
      <path d="M1 -14Q-12 -16 -12 -26Q0 -26 1 -14M1 -18Q12 -22 13 -31Q2 -31 1 -18" fill="#A8C392"/></g>`,
    step: `<rect x="40" y="235" width="44" height="13" rx="5" fill="#D9CFF0"/><rect x="72" y="220" width="116" height="28" rx="6" fill="#D9CFF0"/>
      <path d="M78 221H182" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  };

  // Poses as data. Arm angles: a = shoulder, e = elbow bend, both + outward for either arm (0 hangs down).
  // hold = ms the entry takes; hop = little jump on entry; palm = show paw pads; propL/R = held prop.
  const NEUTRAL = { aL: 12, eL: 6, aR: 16, eR: -8, head: 0, lean: 0, shift: 0, stage: 0, gx: 0, gy: 0, lid: 0, cheek: 0, mouth: 0, sink: 0, sy: 1, pup: 1, f: .35 };
  const POSES = {
    wave:    { use: "Home, first visit", aL: 50, eL: 125, head: 3, gx: 1, palmL: 1, accent: "wave", hold: 1150 },
    welcome: { use: "Home, back after a gap", aL: 62, eL: 34, aR: 58, eR: 26, head: -3, cheek: .7, mouth: .6, palmL: 1, palmR: 1, hop: 1, hold: 1300 },
    content: { use: "Home, after a session", aL: -32, eL: -38, aR: -30, eR: -40, head: 5, cheek: 1, gy: -1, hold: 1200 },
    evening: { use: "Home, evening", aL: 30, eL: 20, aR: 12, eR: -6, head: 4, gx: -3.5, gy: 3, lid: .38, propL: "lantern", breath: 4600, hold: 1400 },
    catch:   { use: "Thought Catcher", aL: 46, eL: 90, head: 5, gx: -3, gy: -1.5, propL: "jar", hold: 1250 },
    reframe: { use: "Reframing", aL: 50, eL: 92, aR: 22, eR: -10, head: 6, gx: -3.5, gy: -2, cheek: .3, propL: "frame", hold: 1250 },
    abc:     { use: "ABC Analysis", aL: 60, eL: 82, head: 4, gx: -2.5, gy: -1, propL: "lens", hold: 1250 },
    act:     { use: "Behavioral Activation", aL: 48, eL: 42, head: 7, gx: -4, gy: 3, lean: -2, propL: "can", ground: "sprout", accent: "pour", hold: 1100 },
    ladder:  { use: "Fear Ladder", aL: 82, eL: 92, aR: 22, eR: -12, head: -3, gx: 1.5, gy: -1.5, cheek: .4, stage: -18, propL: "flag", ground: "step", hold: 1300 },
    cheer:   { use: "Completion", aL: 58, eL: -24, aR: 60, eR: -26, head: -2, cheek: 1, mouth: 1, palmL: 1, palmR: 1, hop: 1, hold: 1100 },
    proud:   { use: "Completion, quiet", aL: 18, eL: 4, aR: -50, eR: 24, head: 7, cheek: 1, gy: -1, hold: 1300 },
    // Onboarding's CBT acting poses (ported from the former onboarding.html fork, kept in sync here now).
    // aR/eR are stored already negated (this file negates the right arm at use-site; see `set("armR", ...)` below).
    // No `mouth:` on any of these — this rig's `mouth` is a binary open-mouth-grin toggle (>.03), not onboarding's
    // old continuous smile-curve scale; Happi's face stays the same calm closed smile through every mood on purpose.
    rest:     { use: "Onboarding, idle/base", aL: 12, eL: 6, aR: 16, eR: -8, head: 0, hold: 600 },
    worry:    { use: "Onboarding, goal: Worry", aL: -6, eL: -78, aR: -6, eR: -78, head: 7, gx: 3.5, gy: -1.5, sink: 1, pup: .9, hold: 600 },
    mood:     { use: "Onboarding, goal: Low mood", aL: 2, eL: 0, aR: 2, eR: 0, head: -6, gy: 3, lid: .15, sink: 2, sy: .99, hold: 600 },
    stress:   { use: "Onboarding, goal: Stress", aL: 26, eL: 34, aR: 26, eR: 34, head: -2, gx: -2.5, gy: -.5, sink: 1, sy: .95, pup: .9, hold: 600 },
    self:     { use: "Onboarding, goal: Self-talk", aL: -8, eL: -82, aR: 6, eR: -2, head: -8, gx: -2.5, gy: 3, lid: .2, sink: 1, sy: .985, pup: .9, hold: 600 },
    sleep:    { use: "Onboarding, goal: Sleep", aL: 10, eL: 4, aR: -4, eR: -96, head: 8, gy: 1.5, lid: .65, sink: 3, sy: .985, hold: 600 },
    heavy:    { use: "Onboarding, a thought believed a lot", aL: 4, eL: 0, aR: 4, eR: 0, head: -4, gy: 2.5, lid: .25, sink: 2, sy: .97, pup: .9, hold: 600 },
    listen:   { use: "Onboarding, personal practice starts", aL: 12, eL: 6, aR: -8, eR: -92, head: -6, gx: -2, gy: 2.5, pup: 1.05, hold: 600 },
    gentle:   { use: "Onboarding, wrong trap pick / chat entry", aL: 34, eL: 30, aR: 34, eR: 30, head: 8, gy: .5, lid: .15, pup: 1.08, hold: 600 },
    relieved: { use: "Onboarding, reframe lands", aL: 24, eL: 20, aR: 24, eR: 20, head: -2, gx: 3, gy: -3, cheek: .6, sy: 1.01, hold: 1600 },
    pride:    { use: "Onboarding, saved", aL: -4, eL: -70, aR: 16, eR: -8, head: 5, cheek: .6, sy: 1.02, hold: 1300 },
  };
  const CHANNELS = Object.keys(NEUTRAL);

  // engine: same math as src/components/ui/motion
  const flow = (t, k) => {
    const n = k.length - 1;
    if (t <= k[0][0]) return k[0][1];
    if (t >= k[n][0]) return k[n][1];
    let i = 0; while (k[i + 1][0] < t) i++;
    const slope = j => (k[j + 1][1] - k[j][1]) / (k[j + 1][0] - k[j][0]);
    const tan = j => {
      if (j === 0 || j === n) return 0;
      const b = slope(j - 1), a = slope(j);
      if (b * a <= 0) return 0;
      const ps = k[j][0] - k[j - 1][0], ns = k[j + 1][0] - k[j][0], w1 = 2 * ns + ps, w2 = ns + 2 * ps;
      return (w1 + w2) / (w1 / b + w2 / a);
    };
    const s = k[i + 1][0] - k[i][0], p = (t - k[i][0]) / s, p2 = p * p, p3 = p2 * p;
    return (2 * p3 - 3 * p2 + 1) * k[i][1] + (p3 - 2 * p2 + p) * s * tan(i) + (-2 * p3 + 3 * p2) * k[i + 1][1] + (p3 - p2) * s * tan(i + 1);
  };
  const wave = (t, period, phase = 0) => Math.sin((t / period + phase) * Math.PI * 2);
  const clamp01 = v => Math.min(1, Math.max(0, v));
  const easeOut = p => 1 - Math.pow(1 - p, 3);
  const seeded = (i, s = 0) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
  // thought-cloud colour: clear (#e4eee0) to heavy (#a9bfa0), by weather `f`
  const mix = (a, b, p) => { const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16)), A = h(a), B = h(b);
    return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * clamp01(p))).join(",")})`; };
  const mat = (x = 0, y = 0, deg = 0, px = 0, py = 0, sx = 1, sy = 1) => {
    const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    return `matrix(${c * sx} ${s * sx} ${-s * sy} ${c * sy} ${x + px - c * sx * px + s * sy * py} ${y + py - s * sx * px - c * sy * py})`;
  };
  // blink every ~3.7 s: close 110 ms, hold 40, reopen 190 ease-out
  const blink = t => {
    const p = t % 3700;
    return p < 110 ? p / 110 : p < 150 ? 1 : p < 340 ? 1 - easeOut((p - 150) / 190) : 0;
  };

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const live = new Set();
  let uid = 0;

  function build(el) {
    const id = `happi${uid++}`;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "20 4 220 246");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%");
    const ink = `fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;
    const line = w => `fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
    const pad = (c, k) => `<circle data-pad="${k}" cx="${c[0]}" cy="${c[1] + 4}" r="3" fill="#fff" stroke="${INK}" stroke-width="1.5" opacity="0"/>`;
    svg.innerHTML = `<defs><clipPath id="${id}">${EYES.map(e => `<ellipse cx="${e.white[0]}" cy="${e.white[1]}" rx="${e.white[2]}" ry="${e.white[3]}"/>`).join("")}</clipPath></defs>
      <g data-sun><g data-rays stroke="#F5B942" stroke-width="3" stroke-linecap="round">${[...Array(8)].map((_, i) => { const a = i * Math.PI / 4;
        return `<line x1="${(Math.cos(a) * 14).toFixed(1)}" y1="${(Math.sin(a) * 14).toFixed(1)}" x2="${(Math.cos(a) * 18).toFixed(1)}" y2="${(Math.sin(a) * 18).toFixed(1)}"/>`; }).join("")}</g><circle r="10" fill="#F5B942"/></g>
      <g data-cloud><rect data-c3 x="220" y="29" width="50" height="12" rx="6"/><circle data-c0 cx="229" cy="30" r="11"/><circle data-c1 cx="245" cy="22" r="14"/><circle data-c2 cx="260" cy="31" r="10"/></g>
      <g data-ground></g>
      <g data-stage>
        <g data-shadow><ellipse cx="130" cy="244" rx="44" ry="5" fill="${SHADOW}"/></g>
        <g data-root>
          <path d="${D.legL}" ${ink}/><path d="${D.legR}" ${ink}/>
          <g data-body><path d="${D.torso}" ${ink}/><path d="${D.belly}" fill="${WHITE}"/><path d="${D.bellyFold}" ${line(3)}/>
            <g data-heart><path d="${D.heart}" fill="${HEART}"/></g></g>
          <g data-armR><path d="${D.upperArmR}" ${ink}/><g data-foreR><g data-prop="R"></g><path d="${D.forearmR}" ${ink}/>${pad(P.pawR, "R")}</g></g>
          <g data-armL><path d="${D.upperArmL}" ${ink}/></g>
          <g data-head>
            <g data-earL><path d="${D.earL}" ${ink}/></g><g data-earR><path d="${D.earR}" ${ink}/></g>
            <path d="${D.head}" fill="${WHITE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="${D.tufts}" ${line(3)}/>
            ${EYES.map(e => `<ellipse cx="${e.patch[0]}" cy="${e.patch[1]}" rx="${e.patch[2]}" ry="${e.patch[3]}" fill="${INK}" transform="rotate(${e.patch[4]} ${e.patch[0]} ${e.patch[1]})"/>`).join("")}
            <g data-cheek><g data-lid>${EYES.map(e => `<ellipse cx="${e.white[0]}" cy="${e.white[1]}" rx="${e.white[2]}" ry="${e.white[3]}" fill="${WHITE}"/>`).join("")}
              <g clip-path="url(#${id})"><g data-pupils>${EYES.map(e => `<circle cx="${e.pupil[0]}" cy="${e.pupil[1]}" r="${e.pupil[2]}" fill="${INK}"/>${e.glints.map(g => `<circle cx="${g[0]}" cy="${g[1]}" r="${g[2]}" fill="#fff"/>`).join("")}`).join("")}</g></g></g></g>
            <g data-happy opacity="0">${EYES.map(e => `<path d="M${e.patch[0] - 12.5} ${e.patch[1] + 4} C${e.patch[0] - 9} ${e.patch[1] - 7} ${e.patch[0] + 9} ${e.patch[1] - 7} ${e.patch[0] + 12.5} ${e.patch[1] + 4}" ${line(4.8).replace(INK, WHITE)}/>`).join("")}</g>
            <g data-face><ellipse cx="131.75" cy="123.75" rx="6" ry="4.2" fill="${INK}"/><path data-smile d="${D.mouth}" ${line(2.5)}/>
              <g data-mouth opacity="0"><path d="${D.mouthOpen}" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><ellipse cx="131.75" cy="141.4" rx="4.7" ry="2.9" fill="#F2A7A0"/></g></g>
          </g>
          <g data-armLFront><g data-foreL><g data-prop="L"></g><path d="${D.forearmL}" ${ink}/>${pad(P.pawL, "L")}</g></g>
        </g>
      </g>`;
    el.replaceChildren(svg);
    const q = s => svg.querySelector(`[data-${s}]`);
    const parts = {};
    for (const k of ["ground", "stage", "shadow", "root", "body", "heart", "armR", "foreR", "armL", "head", "earL", "earR", "cheek", "happy", "lid", "pupils", "face", "smile", "mouth", "armLFront", "foreL", "sun", "rays", "cloud", "c0", "c1", "c2", "c3"]) parts[k] = q(k);
    parts.propL = svg.querySelector('[data-prop="L"]');
    parts.propR = svg.querySelector('[data-prop="R"]');
    parts.padL = svg.querySelector('[data-pad="L"]');
    parts.padR = svg.querySelector('[data-pad="R"]');
    parts.pupilCircles = [...q("pupils").querySelectorAll("circle")];
    return parts;
  }

  // Keys for one entry: from the current value to the pose, arms with a small anticipation dip.
  function keysFor(from, pose) {
    const to = { ...NEUTRAL, ...pose }, h = pose.hold, keys = {};
    for (const c of CHANNELS) {
      const a = from[c];
      // weather (`f`) is independent of pose: a pose change never resets it unless the pose names its own `f`.
      const b = c === "f" ? (pose.f !== undefined ? pose.f : a) : to[c];
      keys[c] = c[0] === "a" && Math.abs(b - a) > 20
        ? [[0, a], [h * .25, a - Math.sign(b - a) * 6], [h, b]]
        : [[0, a], [h * .2, a], [h, b]];
    }
    keys.lift = pose.hop ? [[0, 0], [260, 0], [520, 13], [780, 0], [h, 0]] : [[0, 0], [h, 0]];
    keys.sy = pose.hop ? [[0, 1], [260, .93], [470, 1.06], [780, .88], [960, 1.03], [1150, 1]] : [[0, 1], [1, 1]];
    return keys;
  }

  // one-shot keyframes added on top of a channel (a nod, a growth pulse) — independent of the current pose's
  // own transition, never retargets it. Reuses `flow` for the easing.
  function shotValue(st, channel, t) {
    const s = st.shots && st.shots[channel];
    if (!s) return 0;
    const d = t - s.t0, end = s.keys[s.keys.length - 1][0];
    if (d >= end) { delete st.shots[channel]; return 0; }
    return flow(d, s.keys);
  }

  function pose(st, t, idle) {
    const v = {};
    for (const c of CHANNELS) v[c] = flow(t, st.keys[c]);
    const lag = c => flow(Math.max(0, t - 90), st.keys[c]) - v[c];
    const on = idle === null ? 0 : 1, it = idle || 0, ph = st.phase;
    const lift = flow(t, st.keys.lift), sy = flow(t, st.keys.sy);

    // moving holds: every channel keeps a small life of its own, left and right out of phase
    const aL = v.aL + on * (2 * wave(it, 3000, ph) + 1 * wave(it, 1800, ph + .3));
    let eL = v.eL + .45 * lag("aL") + on * 2.5 * wave(it, 2200, ph + .6);
    const aR = v.aR + on * (2 * wave(it, 4000, ph + .35) + 1 * wave(it, 2600, ph + .1));
    const eR = v.eR + .45 * lag("aR") + on * 2.5 * wave(it, 2800, ph + .9);
    if (st.pose.accent === "wave") eL += 13 * wave(t - 1150, 680) * clamp01((t - 1150) / 300) * clamp01((4300 - t) / 300);
    const lean = v.lean + on * .8 * wave(it, 5200, ph + .2);
    const shift = v.shift + on * 1.2 * wave(it, 4800, ph + .5);
    const head = v.head - .45 * (flow(Math.max(0, t - 110), st.keys.lean) - 0) + on * 1.5 * wave(it, 4400, ph) + shotValue(st, "head", t);
    const ear = .5 * (head - v.head) + on * 1.2 * wave(it, 4400, ph + .15);
    const breath = 1 + on * .014 * wave(it, st.pose.breath || 3200, ph);
    const sx = 1 / Math.pow(sy, .6);
    const gx = v.gx + on * .6 * wave(it, 4800, ph + .4), gy = v.gy + on * .4 * wave(it, 3600, ph + .2);
    const blinkLid = on ? blink(it + ph * 3700) : 0;
    const lid = v.lid + (1 - v.lid) * blinkLid;
    const heartBeat = (it % 1600) / 1600, hs = 1 + on * (heartBeat < .15 ? Math.sin(heartBeat / .15 * Math.PI) * .08 : 0);

    const [fx, fy] = P.floor, p = st.parts, set = (n, m) => p[n].setAttribute("transform", m);
    set("stage", `translate(0 ${v.stage})`);
    set("shadow", mat(shift, 0, 0, fx, fy, (1 - lift / 220) * sx, 1));
    set("root", mat(shift, -lift, lean, fx, fy, sx, sy));
    const bodySquash = breath * (v.sy + shotValue(st, "sy", t)), bodySx = 1 / Math.pow(bodySquash, .6);
    set("body", mat(0, 0, 0, P.body[0], P.body[1], bodySx, bodySquash));
    set("heart", mat(0, 0, 0, P.heart[0], P.heart[1], hs, hs));
    set("armL", mat(0, 0, aL, ...P.shoulderL)); set("armLFront", mat(0, 0, aL, ...P.shoulderL));
    set("foreL", mat(0, 0, eL, ...P.elbowL));
    set("armR", mat(0, 0, -aR, ...P.shoulderR)); set("foreR", mat(0, 0, -eR, ...P.elbowR));
    set("head", mat(0, v.sink + shotValue(st, "sink", t), head, ...P.neck));
    set("earL", mat(0, 0, -ear, ...P.earL)); set("earR", mat(0, 0, ear, ...P.earR));
    set("face", `translate(${gx * .35} ${gy * .25})`);
    set("pupils", `translate(${gx} ${gy})`);
    sizePupils(p.pupilCircles, v.pup);
    const joy = clamp01((v.cheek - .6) / .1);
    p.cheek.setAttribute("opacity", 1 - joy); p.happy.setAttribute("opacity", joy);
    set("lid", mat(0, 0, 0, ...P.eyes, 1, Math.max(.06, 1 - lid)));
    set("mouth", mat(0, 0, 0, 131.75, 134.5, 1, Math.max(.01, v.mouth)));
    p.mouth.setAttribute("opacity", v.mouth > .03 ? 1 : 0); p.smile.setAttribute("opacity", v.mouth > .03 ? 0 : 1);
    const palm = s => clamp01((t - st.pose.hold * .5) / 250) * (st.pose[`palm${s}`] ? 1 : 0);
    p.padL.setAttribute("opacity", palm("L")); p.padR.setAttribute("opacity", palm("R"));

    // thought-cloud prop: how heavy the thought feels (v.f, 0 clear..1 heavy). Sits past this rig's default
    // viewBox (20 4 220 246), so it's invisible unless the host widens the viewBox to include it (onboarding.html does).
    const clear = 1 - v.f, part = clamp01((clear - .6) / .35);
    p.sun.setAttribute("transform", `translate(${(240 + 30 * Math.cos((-10 + 80 * clear) * Math.PI / 180)).toFixed(2)} ${(44 - 30 * Math.sin((-10 + 80 * clear) * Math.PI / 180)).toFixed(2)})`);
    p.sun.setAttribute("opacity", clamp01(1.15 - v.f * 1.4).toFixed(3));
    p.rays.setAttribute("transform", `rotate(${(t / 40000 * 360 % 360).toFixed(2)})`);
    p.cloud.setAttribute("fill", mix("#e4eee0", "#a9bfa0", v.f));
    p.cloud.setAttribute("transform", `translate(${(1.5 * wave(it, 7000)).toFixed(2)} 0)`);
    [["c0", -12, 2, 229, 30], ["c1", 0, -7, 245, 22], ["c2", 12, 3, 260, 31]].forEach(([k, dx, dy, cx, cy]) => {
      p[k].setAttribute("transform", mat(dx * part, dy * part, 0, cx, cy, 1 - .3 * part, 1 - .3 * part));
      p[k].setAttribute("opacity", (1 - .6 * part).toFixed(3));
    });
    p.c3.setAttribute("opacity", (1 - part).toFixed(3));

    // props stay upright in the paw (counter-rotate the arm), and appear once the paw arrives
    const grow = clamp01((t - st.pose.hold * .45) / 260);
    const placeProp = (g, paw, world, s) => {
      if (!g.firstChild) return;
      g.setAttribute("transform", `rotate(${-world} ${paw[0]} ${paw[1]}) translate(${paw[0]} ${paw[1]}) scale(${.92 + .08 * easeOut(grow)})`);
      g.setAttribute("opacity", grow > 0 ? easeOut(grow) : 0);
      const sway = g.querySelector("[data-sway]");
      if (sway) sway.setAttribute("transform", `rotate(${propSway(sway.dataset.sway, it, t, s)})`);
    };
    placeProp(p.propL, P.pawL, lean + aL + eL, "L");
    placeProp(p.propR, P.pawR, lean - aR - eR, "R");
    detail(st, t, it, on);
  }

  function propSway(kind, it, t) {
    switch (kind) {
      case "lantern": return 4 * wave(it, 2600) + 1.5 * wave(it, 1500, .3);
      case "frame": return 3 * wave(it, 3400, .1);
      case "lens": return 2.5 * wave(it, 2400, .4);
      case "can": return -24 * clamp01((t - 900) / 400) + 2 * wave(it, 2000);
      case "jar": return 2 * wave(it, 3000, .2);
      case "flag": return 2 * wave(it, 3600, .5);
      default: return 0;
    }
  }

  // small idle loops inside props and ground: jar thought bob, lantern glow, flag cloth, water, sprout
  function detail(st, t, it, on) {
    const q = s => st.el.querySelector(`[data-${s}]`);
    const bob = q("bob"); if (bob) bob.setAttribute("transform", `translate(${1.2 * wave(it, 2600)} ${-2 * (wave(it, 1900) + 1) / 2})`);
    const glow = q("glow"); if (glow) glow.setAttribute("transform", mat(0, 0, 0, 0, 25, 1 + on * .04 * wave(it, 3200), 1 + on * .04 * wave(it, 3200)));
    const flame = q("flame"); if (flame) flame.setAttribute("transform", mat(0, 0, 3 * wave(it, 700) * on, 0, 29, 1, 1 + on * .05 * wave(it, 1100)));
    const cloth = q("cloth"); if (cloth) cloth.setAttribute("transform", mat(0, 0, 4 * wave(it, 900) * on, 1, -44, 1 + .06 * wave(it, 1300, .3) * on, 1));
    const drops = q("drops");
    if (drops) [...drops.children].forEach((d, i) => {
      const p = ((it + seeded(i) * 700) % 700) / 700, pour = clamp01((t - 1200) / 200) * on;
      d.setAttribute("transform", `translate(${-2 * p} ${4 + 42 * p * p})`);
      d.setAttribute("opacity", pour * Math.sin(Math.PI * p));
    });
    const sprout = q("sprout");
    if (sprout) {
      const g = .7 + .3 * easeOut(clamp01((t - 1400) / 1800));
      sprout.setAttribute("transform", `translate(40 244) rotate(${on * 2.5 * wave(it, 3600, .2)}) scale(${g})`);
    }
  }

  function set(el, name) {
    const p = POSES[name];
    if (!p) return console.warn(`Happi: unknown pose "${name}"`);
    const st = el._happi || (el._happi = { el, parts: build(el), phase: seeded(uid, 3), cur: { ...NEUTRAL } });
    // continue from where the figure is now, never restart from neutral
    if (st.keys) for (const c of CHANNELS) st.cur[c] = flow(st.t, st.keys[c]);
    st.pose = p; st.keys = keysFor(st.cur, p); st.t = 0;
    // a long pose (a story beat) owns the gaze until it lands; conversational glances (`look`) wait
    st.holdUntil = p.hold >= 1000 ? p.hold + 200 : 0;
    for (const s of ["L", "R"]) {
      const g = st.parts[`prop${s}`], want = p[`prop${s}`] || "";
      if (g.dataset.kind !== want) { g.dataset.kind = want; g.innerHTML = want ? PROPS[want] : ""; }
    }
    st.parts.ground.innerHTML = GROUND[p.ground] || "";
    el.dataset.pose = name;
    draw(st);
  }

  function draw(st) {
    if (reduced.matches) return pose(st, st.pose.hold + 4000, null);
    pose(st, st.t, st.idle || 0);
  }

  // one clock for every figure; only figures on screen advance
  let last = 0;
  function tick(now) {
    const dt = Math.min(64, last ? now - last : 16); last = now;
    if (!document.hidden && !reduced.matches) for (const st of live) { st.t += dt; st.idle = (st.idle || 0) + dt; draw(st); }
    requestAnimationFrame(tick);
  }
  const seen = new IntersectionObserver(es => es.forEach(e => e.target._happi && (e.isIntersecting ? live.add(e.target._happi) : live.delete(e.target._happi))));

  function mount(el) { set(el, el.dataset.pose || "wave"); seen.observe(el); }
  function replay(el) { const st = el._happi; if (!st) return; st.cur = { ...NEUTRAL }; st.keys = null; set(el, el.dataset.pose); }
  reduced.addEventListener("change", () => document.querySelectorAll(".happi").forEach(el => el._happi && draw(el._happi)));

  // deterministic frame at ms, for offline review (remotion/HappiPoses.tsx)
  function at(el, name, ms) {
    if (!el._happi || el.dataset.pose !== name) set(el, name);
    live.delete(el._happi);
    pose(el._happi, ms, ms);
  }

  // eases one channel toward a new target without disturbing any other channel's own transition in progress,
  // or resetting on the next pose change (unless that pose names the channel itself — see keysFor's `f` case).
  function splice(st, channel, value, dur) {
    const from = flow(st.t, st.keys[channel]);
    st.keys[channel] = [[st.t, from], [st.t + dur, value]];
  }
  function nudge(el, channel, value, dur = 400) {
    const st = el._happi; if (!st) return;
    splice(st, channel, value, dur);
  }
  // weather prop (onboarding's thought cloud): eases the `f` channel independently of the current pose.
  function weather(el, f, slow = false) { nudge(el, "f", f, slow ? 1600 : 600); }
  // a conversational glance (typing, a bubble lands, a reply shows): a long pose (a story beat) owns the
  // gaze until it lands, so this waits rather than interrupting it. Deliberate gaze beats inside a pose
  // (e.g. "pride" settling onto the card) use `nudge` directly instead, which never waits.
  function look(el, gx, gy, dur = 400) {
    const st = el._happi; if (!st || st.t < (st.holdUntil || 0)) return;
    splice(st, "gx", gx, dur); splice(st, "gy", gy, dur);
  }
  // one-shot head bump (a correct answer), independent of whatever the current pose's own head angle is doing
  function nod(el) {
    const st = el._happi; if (!st) return;
    st.shots = st.shots || {}; st.shots.head = { t0: st.t, keys: [[0, 0], [160, 5], [460, 0]] };
  }
  // one-shot "grows" pulse on pose entry: a small body-squash + head-lift bump, independent of the pose
  function stretch(el) {
    const st = el._happi; if (!st) return;
    st.shots = st.shots || {};
    st.shots.sy = { t0: st.t, keys: [[0, 0], [260, .025], [700, 0]] };
    st.shots.sink = { t0: st.t, keys: [[0, 0], [260, -3], [700, 0]] };
  }

  window.Happi = { POSES, set, replay, mount, at, weather, look, nudge, nod, stretch };
  const start = () => { document.querySelectorAll(".happi").forEach(mount); requestAnimationFrame(tick); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
})();

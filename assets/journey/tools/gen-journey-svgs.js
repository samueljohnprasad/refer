// Generates the journey node, keepsake and badge SVGs from one set of tokens.
// Usage: node assets/journey/tools/gen-journey-svgs.js   (writes into assets/journey)
const fs = require("fs"), path = require("path");
const out = process.argv[2] || path.resolve(__dirname, "..");

// src/theme/palette.ts + the Happi art kit colours in .agents/happi.js
const SAGE = { 50: "#f8fbf6", 100: "#e5ede1", 200: "#d3e0cd", 300: "#abc0a2", 400: "#7e9874", 500: "#5f7f58", 600: "#44633f", 700: "#29452a", 800: "#152714" };
const LOCK = { face: "#e5e5e5", rim: "#d4d4d4", glyph: "#6b6b6b" };   // glyph = NEUTRAL.inkSoft, 4.2:1 on the face
const KIT = { honey: "#F6C453", honeyDeep: "#D9A23A", leaf: "#A8C392", heart: "#C8BEE6", paper: "#FFFFFF", ink: "#252525" };
const STATES = {
  locked: { face: LOCK.face, rim: LOCK.rim, glyph: LOCK.glyph },
  current: { face: SAGE[500], rim: SAGE[600], glyph: "#ffffff" },
  completed: { face: SAGE[400], rim: SAGE[500], glyph: "#ffffff" },   // lighter than current so the eye goes to the one actionable node
};

// glyphs on a 24-unit grid, centred on the node face
const G = {
  sprout: c => `<path d="M12 21V12" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
    <path d="M12 14C6.5 14 4 10.5 4 6c5 0 8 3 8 8z" fill="${c}"/><path d="M12 11.5C12 6.5 15 3.5 20 3.5c0 5-3 8-8 8z" fill="${c}"/>`,
  loop: c => `<g fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12a8 8 0 1 1-2.6-5.9L20 8.5"/><path d="M20 3.5v5h-5"/></g>`,
  flag: c => `<g fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 21V4"/><path d="M5 4.5c4-2.5 7 2.5 14 0V14c-7 2.5-10-2.5-14 0" fill="${c}"/></g>`,
  star: c => `<path d="M12 2.8l2.6 5.3 5.8.85-4.2 4.1 1 5.8L12 16.1l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z" fill="${c}" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/>`,
};
const glyph = (name, c, cx = 36, cy = 29, s = 1) => `<g transform="translate(${cx - 12 * s} ${cy - 12 * s}) scale(${s})">${G[name](c)}</g>`;

// face shapes, 72 wide, face centre (36,29), rim 6 below
const SHAPE = {
  ellipse: (f, dy = 0) => `<ellipse cx="36" cy="${29 + dy}" rx="35" ry="28" fill="${f}"/>`,
  hexagon: (f, dy = 0) => `<path d="M36 ${4 + dy}L64 ${17 + dy}V${41 + dy}L36 ${54 + dy}L8 ${41 + dy}V${17 + dy}Z" fill="${f}" stroke="${f}" stroke-width="7" stroke-linejoin="round"/>`,
  rosette: (f, dy = 0) => [`<circle cx="36" cy="${29 + dy}" r="24" fill="${f}"/>`,
    ...Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${(36 + 22 * Math.cos(a)).toFixed(2)}" cy="${(29 + dy + 22 * Math.sin(a)).toFixed(2)}" r="7" fill="${f}"/>`; })].join(""),
};
const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true"><!-- ${title} -->\n${body}\n</svg>\n`;

const files = {};
const NODES = { exercise: ["ellipse", "sprout"], practice: ["ellipse", "loop"], checkpoint: ["hexagon", "flag"], milestone: ["rosette", "star"] };
for (const [type, [shape, g]] of Object.entries(NODES))
  for (const [state, c] of Object.entries(STATES))
    files[`nodes/${type}-${state}.svg`] = svg(72, 64, `${SHAPE[shape](c.rim, 6)}\n${SHAPE[shape](c.face)}\n${glyph(g, c.glyph, 36, 29, 1.35)}`, `${type} node, ${state}`);

// keepsake box (claim node): lid, body, ribbon, bow; rim 6 below like every node
const box = ({ body, side, ribbon, ribbonDeep }, open) => {
  const bodyG = `<rect x="11" y="30" width="50" height="28" rx="7" fill="${side}"/>
    <rect x="11" y="24" width="50" height="28" rx="7" fill="${body}"/>
    <rect x="32" y="24" width="8" height="28" fill="${ribbon}"/>`;
  const lid = `<rect x="7" y="16" width="58" height="14" rx="6" fill="${side}"/><rect x="7" y="14" width="58" height="14" rx="6" fill="${body}"/>
    <rect x="32" y="14" width="8" height="14" fill="${ribbonDeep}"/>`;
  if (!open) return `${bodyG}
    ${lid}`;
  return `<g transform="rotate(-10 36 20)">${lid.replace(/y="14"/g, 'y="6"').replace(/y="16"/g, 'y="8"')}</g>
    <rect x="15" y="22" width="42" height="9" rx="3" fill="${side}"/>
    <g transform="rotate(-6 36 30)"><rect x="22" y="10" width="28" height="24" rx="3" fill="${KIT.paper}" stroke="${SAGE[200]}" stroke-width="2"/>
    <path d="M28 17h16M28 22h16M28 27h10" stroke="${SAGE[300]}" stroke-width="2.4" stroke-linecap="round"/></g>
    ${bodyG}`;
};
const BOX = {
  locked: { body: LOCK.face, side: LOCK.rim, ribbon: "#cfcfcf", ribbonDeep: LOCK.glyph },
  current: { body: SAGE[500], side: SAGE[600], ribbon: SAGE[300], ribbonDeep: SAGE[200] },   // path: sage only, one accent
  completed: { body: SAGE[400], side: SAGE[500], ribbon: SAGE[300], ribbonDeep: SAGE[200] },
  ceremony: { body: SAGE[500], side: SAGE[600], ribbon: KIT.honey, ribbonDeep: KIT.honeyDeep },
};
for (const s of ["locked", "current", "completed"]) files[`nodes/keepsake-${s}.svg`] = svg(72, 64, box(BOX[s], s === "completed"), `keepsake ${s === "completed" ? "opened" : s}`);

// rings that sit around the current node (centre on the node face centre)
files["nodes/ring-track.svg"] = svg(96, 96, `<circle cx="48" cy="48" r="44" stroke="${SAGE[100]}" stroke-width="6"/>`, "current node ring");
const C = 2 * Math.PI * 44;
files["nodes/ring-progress-example.svg"] = svg(96, 96, `<circle cx="48" cy="48" r="44" stroke="${SAGE[100]}" stroke-width="6"/>
<circle cx="48" cy="48" r="44" stroke="${SAGE[500]}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(C / 3).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 48 48)"/>`, "current node ring, one of three steps done");

// ceremony art, 200 x 200
const rosetteBig = (f, cx, cy, r, scallop) => [`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`,
  ...Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<circle cx="${(cx + (r - 2) * Math.cos(a)).toFixed(2)}" cy="${(cy + (r - 2) * Math.sin(a)).toFixed(2)}" r="${scallop}" fill="${f}"/>`; })].join("");
const tails = (a, b) => `<path d="M76 118L60 176l18-10 10 18 14-56z" fill="${a}"/><path d="M124 118l16 58-18-10-10 18-14-56z" fill="${b}"/>`;
const laurel = (side, cy) => {   // sprig on an arc of r 70 around the medal face centred at (100, cy), left (side -1) or right (side 1)
  const pt = deg => { const th = deg * Math.PI / 180, lx = 100 + 70 * Math.cos(th); return [side < 0 ? lx : 200 - lx, cy + 70 * Math.sin(th)]; };
  const [sx, sy] = pt(128), [ex, ey] = pt(212);
  const stem = `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}A70 70 0 0 ${side < 0 ? 1 : 0} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${KIT.leaf}" stroke-width="3" stroke-linecap="round"/>`;
  return stem + [0, 1, 2, 3, 4].map(i => { const deg = 136 + i * 18, [x, y] = pt(deg), rot = side < 0 ? deg : -deg;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="11" fill="${KIT.leaf}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join("");
};
files["badges/unit-complete.svg"] = svg(200, 200, `${tails(SAGE[400], SAGE[600])}
${rosetteBig(SAGE[600], 100, 92, 58, 11)}
${rosetteBig(SAGE[500], 100, 86, 58, 11)}
<circle cx="100" cy="86" r="40" fill="${SAGE[100]}"/>
${glyph("star", SAGE[500], 100, 86, 2.6)}`, "unit complete badge");
files["badges/section-complete.svg"] = svg(200, 200, `${laurel(-1, 86)}${laurel(1, 86)}
${rosetteBig(SAGE[700], 100, 92, 54, 10)}
${rosetteBig(SAGE[600], 100, 86, 54, 10)}
<circle cx="100" cy="86" r="37" fill="${SAGE[100]}"/>
<circle cx="100" cy="80" r="15" fill="${KIT.honey}"/>
<path d="M64 102c12-14 22-14 36 0 12-12 24-12 36 0v8H64z" fill="${SAGE[400]}"/>`, "section complete badge");
files["badges/course-complete.svg"] = svg(200, 200, `${tails(SAGE[500], SAGE[700])}
${laurel(-1, 88)}${laurel(1, 88)}
<circle cx="100" cy="94" r="60" fill="${SAGE[700]}"/>
<circle cx="100" cy="88" r="60" fill="${SAGE[600]}"/>
<circle cx="100" cy="88" r="48" fill="${SAGE[50]}"/>
<g clip-path="url(#course-medal)"><circle cx="100" cy="76" r="14" fill="${KIT.honey}"/>
<path d="M52 106c16-20 30-20 48-4 14-14 30-14 48 4v40H52z" fill="${SAGE[300]}"/>
<path d="M52 120c22-14 44-14 96 0v40H52z" fill="${SAGE[400]}"/></g>
<defs><clipPath id="course-medal"><circle cx="100" cy="88" r="48"/></clipPath></defs>`, "course complete medal");
const ring = (r, f) => `<circle cx="100" cy="104" r="${r}" fill="${f}"/>`;
files["badges/keepsake-reveal.svg"] = svg(200, 200, `${ring(92, SAGE[50])}${ring(70, SAGE[100])}${ring(48, SAGE[200])}
<ellipse cx="100" cy="176" rx="46" ry="6" fill="${SAGE[200]}"/>
<g transform="translate(46 64) scale(1.5)">${box(BOX.ceremony, true)}</g>`, "keepsake opened with a note inside");

for (const [f, s] of Object.entries(files)) { fs.mkdirSync(path.join(out, path.dirname(f)), { recursive: true }); fs.writeFileSync(path.join(out, f), s); }
console.log(Object.keys(files).length, "files ->", out);

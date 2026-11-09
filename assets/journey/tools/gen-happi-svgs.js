// Renders Happi's expression set to static SVGs from the real rig in .agents/happi.js.
// Each file is the pose's still frame (the reduced-motion frame), so art and motion share one source.
// Usage: node assets/journey/tools/gen-happi-svgs.js   (writes into assets/images/panda/expressions)
const { JSDOM } = require("jsdom");
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "../../..");
const out = process.argv[2] || path.join(root, "assets/images/panda/expressions");
const src = fs.readFileSync(path.join(root, ".agents/happi.js"), "utf8").replace("[data-${s}]`);\n    const parts", "[data-${s.toLowerCase()}]`);\n    const parts"); // jsdom matches lowercased attribute names

// docs/research/soul/03-character.md "Expression set" still column; channels as in happi.js NEUTRAL
const EXPRESSIONS = {
  "neutral":        { hold: 1 },
  "listening":      { head: 4, lean: 2, shift: 2, gx: -2.5, gy: 2, lid: .1, hold: 1 },
  "quiet-pride":    { head: 3, cheek: .3, mouth: .3, hold: 1 },
  "gentle-concern": { head: 6, lean: 3, lid: .15, hold: 1 },
  "resting":        { head: -5, lid: 1, cheek: .2, aL: 18, eL: 20, aR: 18, eR: -20, hold: 1 },
  "welcome-back":   { head: 3, cheek: .4, mouth: .2, hold: 1 },
  "celebrating":    { gy: -1, cheek: .6, mouth: .4, hold: 1 },   // still: arms down, on the floor
  "thinking":       { head: -3, gx: -1.5, gy: 2.2, lid: .2, mouth: .05, hold: 1 },
};

const dom = new JSDOM(`<!doctype html><body></body>`, { runScripts: "outside-only", pretendToBeVisual: true });
const w = dom.window;
w.matchMedia = () => ({ matches: true, addEventListener() {} });           // reduced motion: draw the still frame
w.IntersectionObserver = class { observe() {} };
w.requestAnimationFrame = () => 0;
w.eval(src);
fs.mkdirSync(out, { recursive: true });
for (const [name, pose] of Object.entries(EXPRESSIONS)) {
  w.Happi.POSES[name] = pose;
  const el = w.document.createElement("div");
  w.document.body.append(el);
  w.Happi.set(el, name);
  const s = el.querySelector("svg");
  s.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  s.setAttribute("width", "220"); s.setAttribute("height", "246");
  s.querySelector("clipPath").id = `happi-${name}-eyes`;
  s.querySelector("[clip-path]").setAttribute("clip-path", `url(#happi-${name}-eyes)`);
  s.querySelectorAll("[opacity='0']").forEach(n => n.remove());                // hidden pads/mouth add nothing to a still
  fs.writeFileSync(path.join(out, `${name}.svg`), s.outerHTML.replace(/ data-[a-z]+(="[^"]*")?/g, "") + "\n");
}
console.log(Object.keys(EXPRESSIONS).length, "expressions ->", out);

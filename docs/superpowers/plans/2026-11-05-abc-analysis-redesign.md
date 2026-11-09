# ABC Analysis Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `.agents/abc-analysis.html` so it has the soul and quality of the redesigned `thought-reframing.html` and `onboarding.html`: Happi asks one short question per screen, the user's answers return as one sentence with a gap in the middle ("When [A], I thought [B], and felt [C]"), feelings are rated in words, a crisis path is on every step, and the ending is honest.

**Architecture:** One static HTML prototype, rewritten in place. The shell (header, 4-segment stage bar, footer, step engine, toast) and shared step builders are copied from `.agents/thought-reframing.html` ("TR") and adjusted; the crisis sheet and phrase regex are copied from `.agents/onboarding.html` ("ONB"). Happi comes from `.agents/happi.js` (pose `abc`, holds a lens), the intro scene from `.agents/exercise-art.js` (`window.ART.abc_analysis()`). `.agents/happy-ui.css` loads last and wins on shared names.

**Tech Stack:** Plain HTML/CSS/JS, no build. Verification: `node --check` on the extracted script and a throwaway jsdom walk (repo `node_modules/jsdom`).

**Spec:** `docs/research/soul/_work/abc-analysis-soul-spec.md` (soul-design-researcher, pass 2, all checklists PASS). Every copy string and contrast value below is taken from it; when this plan and the spec disagree, the spec wins.

## Global Constraints

- Never commit or push (AGENTS.md STRICT). No `git add`, no `git commit` steps.
- Do not write committed test files (AGENTS.md "dont write the test cases"). Verification scripts live only in `$TMPDIR` (on this machine `/tmp/claude-503/`).
- Font weights 700 / 600 / 500 only. `grep -c "font-weight:\(800\|900\)" .agents/abc-analysis.html` must print `0`.
- Fredoka (display) on exactly one element per screen: the bubble `h1` on steps; the keepsake `.rf` on the summary.
- No focus styling on text fields (L11). Buttons keep `:focus-visible`.
- No helper text, no eyebrow labels above fields, no bordered/rimmed cards, no tag pills (L9).
- Happi bubble: one question sentence, ≤12 words, ≤60 characters, ≤1 bubble per screen. Instruction goes in one app `.sub` line outside the bubble.
- Feeling strength shown in words only: `STRENGTH = v => v===0?'None':v<=3?'Mild':v<=6?'Medium':v<=9?'Strong':'Very strong'`. The numeral appears only in `aria-valuetext`.
- Direction is never coloured good/bad (L6). Re-rate starts at the before value.
- Crisis phrase list is ONB's `CRISIS` regex, verbatim. The crisis sheet never blocks Continue and never discards text.
- Mobbin evidence lives in the spec (§ Sources). Layouts are unrendered until the user sends screenshots; say so.
- After the build, spawn an Opus reviewer (L13) and fix what it finds before reporting.

## Review Focus

1. **Back navigation keeps everything.** Going back from any step (and back within the 3 checks) shows the earlier answers, the filled gaps and the selected tiles; nothing resets. Pinned in Task 4 and Task 6 walks.
2. **Key-mash and whitespace never enable Continue.** "sdfsdf", "   ", or a tapped starter alone ("It’s possible that ") keep Continue disabled (`words(own(x)) >= 2`). Pinned in Task 4.
3. **Untouched re-rate reads as "same".** Leaving the second slider alone gives "Same as before: Medium." and the "about the same" verdict, never an invented improvement. Pinned in Task 5 and Task 8.
4. **Long text without spaces does not break layout.** A 300-character unbroken string in A/B/fairer wraps inside the sentence bubble and the keepsake (`overflow-wrap:anywhere`), no horizontal scroll. Pinned in Task 3.
5. **Crisis match fires once and never traps.** "I want to end it all" in B opens the sheet once, keeps the text, removes Happi from later steps for the session (even after "Edit answers" or restart), and the next Continue advances. Pinned in Task 7.

---

## File Structure

- Modify (rewrite in place): `.agents/abc-analysis.html`, the only file that changes.
- Read-only sources: `.agents/thought-reframing.html`, `.agents/onboarding.html`, `.agents/happi.js`, `.agents/exercise-art.js`, `.agents/happy-ui.css`.
- Throwaway verification: `/tmp/claude-503/abcwalk.js` (created in Task 1, extended per task).

Before starting: `cp .agents/abc-analysis.html /tmp/claude-503/abc-before.html`.

---

### Task 1: Shell, stage bar, engine

**Files:**
- Modify: `.agents/abc-analysis.html` (head, `<style>` base blocks, body markup, engine)

**Interfaces:**
- Produces: `STAGES`, `steps[]` entries shaped `{stage, valid(), render(), bind?(), next?, noProgress?, noBack?, secondary?}`, `show()`, `restart()`, `toast(m)`, `$`, `esc`, `buzz`, `IC`, `focusField`, `words`, `own`, `R`, `fresh()`.

- [ ] **Step 1: Replace the `<head>` font link and base CSS**

Delete line 8 (the Google Fonts `<link>`; `happy-ui.css` imports Nunito and Fredoka). Replace the CSS from `/* ===== base ===== */` through `/* ===== footer ===== */` block end with TR's equivalents (TR lines 29–76: base, nav, content, footer), then change every `font-weight:800` to `700`. Keep the `:root` tokens and add TR's exercise tokens to `:root`:

```css
    --cloud-lo:#e4eee0;--cloud-hi:#a9bfa0;--wash:#f6ecd8;--warm:#eef3ea;--sun:#f5b942;--sun2:#e09a24;--r-l:24px;
```

Delete these current blocks entirely: `/* ===== inputs ===== */` (focus rules violate L11), `/* ===== conversation ===== */`, `/* ===== list ===== */`, `/* ===== slider ===== */`, `/* ===== intro ===== */`, `/* ===== summary ===== */`, `/* ===== abc analysis ===== */`. Later tasks add their replacements.

- [ ] **Step 2: Replace the body markup**

```html
<div id="app">
  <header><button class="icon-btn" id="back" aria-label="Back"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><div class="bar" role="progressbar" aria-label="Progress" aria-valuemin="0" aria-valuemax="100"><span><i></i></span><span><i></i></span><span><i></i></span><span><i></i></span></div><button class="sos" id="sos">Get help</button><button class="icon-btn" id="close" aria-label="Exit exercise"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
  <main id="main"></main>
  <footer><button class="btn ghost" id="secondary" hidden></button><button class="btn" id="next"></button></footer>
  <div id="toast" role="status" aria-live="polite"></div>
  <div class="scrim" id="scrim" hidden></div>
  <section class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t" hidden></section>
</div>
<script src="happi.js"></script>
<script src="exercise-art.js"></script>
```

CSS for the header button (spec: 13 px 600, `#4B4B4B` on white 8.72:1, ≥44 px):

```css
  .sos{flex:none;min-height:var(--tap);padding:0 var(--sp-2);border:0;background:none;font-size:var(--t-foot);font-weight:600;color:var(--label-2)}
```

Copy TR's `.bar` span CSS (TR lines 46–51) and TR's `#toast` CSS (TR lines 273–276, weight 700) into the style block.

- [ ] **Step 3: Replace helpers, state and engine**

Copy verbatim from TR into the `<script>`: `$`, `esc`, `buzz`, `focusField`, `IC` and the `CHECK`, `ARROW` icons (TR lines 319–325), `words` and `own` (TR lines 328–329). Then:

```js
const STAGES = ['Event', 'Feeling', 'Thought', 'Rethink'];
const fresh = () => ({a:'', feel:[], c:5, b:'', test:{}, alt:'', c2:null, helpShown:false});
let R = fresh(), idx = 0, qi = 0;
let crisis = false; // session-long: restart() never resets it (03 absence zone 2)
```

Engine: copy TR `show()` (TR lines 715–732), `#next`/`#back`/`#secondary`/`#close` handlers, `toast`, and `restart()` (TR lines 733–738), with `restart()` reduced to `function restart() { R = fresh(); idx = 0; qi = 0; show(); }`. The `aria-valuetext` line keeps TR's form `` `${STAGES[s.stage]}, part ${s.stage + 1} of 4` ``.

Temporary `steps` so the shell runs: one intro step `{id:'intro', noProgress:true, noBack:true, next:'Begin', valid:()=>true, render:()=>'<h1>ABC</h1>'}` and one summary `{id:'summary', noProgress:true, next:'Save and finish', valid:()=>true, render:()=>'<h1>Done</h1>'}`.

- [ ] **Step 4: Create the walk script**

Create `/tmp/claude-503/abcwalk.js`:

```js
const {JSDOM}=require('/Users/samuel.prasad/Desktop/sam/refer/node_modules/jsdom');const fs=require('fs');
const html=fs.readFileSync('abc-analysis.html','utf8');
const open=(still=true)=>{const d=new JSDOM(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,url:'file://'+process.cwd()+'/abc-analysis.html',beforeParse(w){
  w.matchMedia=q=>({matches:still&&/reduce/.test(q),addEventListener(){},addListener(){}});w.IntersectionObserver=class{observe(){}disconnect(){}unobserve(){}};
  w.ResizeObserver=class{observe(){}};w.HTMLElement.prototype.scrollTo=function(){};w.Element.prototype.animate=()=>({});w.navigator.vibrate=()=>{};w.confirm=()=>true;}});
  const errs=[];d.window.addEventListener('error',e=>errs.push(e.message));return {d,w:d.window,doc:d.window.document,errs}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
module.exports={open,sleep};
if(require.main===module)(async()=>{const {doc,errs}=open();await sleep(300);
  const next=()=>doc.querySelector('#next').click();
  console.log('bar:',doc.querySelector('.bar').getAttribute('aria-valuetext'),'| next:',doc.querySelector('#next').textContent);
  next();await sleep(50);console.log('after Begin:',doc.querySelector('.bar').getAttribute('aria-valuetext'));
  console.log('errors:',errs);})();
```

- [ ] **Step 5: Verify**

Run from `.agents/`:
```bash
sed -n '/<script>/,/<\/script>/p' abc-analysis.html | sed '1d;$d' > /tmp/claude-503/abc.js && node --check /tmp/claude-503/abc.js && echo SYNTAX_OK
node /tmp/claude-503/abcwalk.js
grep -c "font-weight:\(800\|900\)" abc-analysis.html
```
Expected: `SYNTAX_OK`; `bar: Not started | next: Begin`; `after Begin: Done`; `errors: []`; `0`.

---

### Task 2: Happi asks (`head()`), keyboard aside, sentence (`line()`)

**Files:**
- Modify: `.agents/abc-analysis.html` (style + script)

**Interfaces:**
- Consumes: `R`, `esc`, `crisis` from Task 1.
- Produces: `head(q, sub='', pose='abc')` → HTML string; `line(b, verb='thought', withC=true)` → HTML string of `.me > p.line#line`; `feelText()` → lower-case "anxious and sad"; `liveGap(k, text)` updates a gap in place; `happiOn()` → boolean.

- [ ] **Step 1: CSS**

Copy TR lines 64–67 (`.me`) and 93–99 (`.ask`, `.ask .happi`, `.say`), then add:

```css
  .say h1{font-family:var(--display);font-size:var(--t-h);font-weight:600;line-height:1.15}
  .ask.solo .say::before{display:none}
  .ask+.sub{margin:calc(-1*var(--sp-3)) 0 var(--sp-4)}
  .sub{font-size:var(--t-sub);line-height:1.45;font-weight:500;color:var(--label-2);max-width:40ch}
  .note{font-size:var(--t-foot);font-weight:600;color:var(--label-2);margin-top:var(--sp-2);min-height:1.35em}
  /* the signature: the user's answers as one sentence, the missing part a dashed gap */
  .line{font-weight:500;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .gap{font-weight:700}
  .gap.empty{display:inline-block;min-width:3.5em;text-align:center;border-bottom:2px dashed currentColor;font-size:var(--t-foot)}
  .line.map{display:block;font-size:var(--t-lead);color:var(--label-2);-webkit-line-clamp:unset}
  .line.map .gap.empty{color:var(--label-3)}
  .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
  /* Happi steps aside while the keyboard is open (03 F7) and keeps its box so the question does not jump */
  .ask .happi{transition:opacity .25s ease-out,transform .25s ease-out}
  .typing .ask .happi{opacity:0;transform:scale(.96);transition:opacity .2s ease-in,transform .2s ease-in}
```

- [ ] **Step 2: JS**

```js
const happiOn = () => { if (crisis) return false; try { return localStorage.getItem('happi') !== 'off'; } catch { return true; } };
const head = (q, sub = '', pose = 'abc') => `<div class="ask${happiOn() ? '' : ' solo'}">${happiOn() ? `<div class="happi" data-pose="${pose}"></div>` : ''}<div class="say" aria-live="polite"><h1>${q}</h1></div></div>${sub ? `<p class="sub">${sub}</p>` : ''}`;
const FEEL_LABEL = n => EMOTIONS.find(e => e.name === n).label;
const feelText = () => { const f = R.feel.map(n => FEEL_LABEL(n).toLowerCase()); return f.length < 2 ? (f[0] || '') : f.slice(0, -1).join(', ') + ' and ' + f.at(-1); };
// ponytail: keeps names capitalised, misses rare openers
const lc = s => /^(My|A|An|The|We|They|He|She|It|Our|Someone|This|That|Today|Yesterday|At|In|On|After|Before|During)\b/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
const gap = (t, k) => t ? `<span class="gap" data-k="${k}">${esc(t)}</span>` : `<span class="gap empty" data-k="${k}"><span aria-hidden="true">${k}</span><span class="vh">not written yet</span></span>`;
const line = (b, verb = 'thought', withC = true) => `<div class="me"><p class="line" id="line">When ${gap(lc(R.a.trim().replace(/[.!]+$/, '')), 'A')}, I ${verb} ${b.trim() ? `“${gap(b.trim(), 'B')}”` : gap('', 'B')}${withC ? `, and felt ${gap(feelText(), 'C')}` : ''}.</p></div>`;
// re-render the whole sentence: simpler than patching one gap and its quotes
const liveLine = (b, verb, withC) => { const p = $('#line'); if (p) p.outerHTML = line(b, verb, withC).replace(/^<div class="me">|<\/div>$/g, ''); };
document.addEventListener('focusin', e => { if (e.target.matches('textarea') && matchMedia('(pointer: coarse)').matches) $('#main').classList.add('typing'); });
document.addEventListener('focusout', e => { if (e.target.matches('textarea')) $('#main').classList.remove('typing'); });
```

`EMOTIONS` is defined in Task 5; until then add the TR `EMOTIONS` const (TR lines 293–294) now so `feelText` resolves. In `show()` after rendering, mount Happi as TR does: `document.querySelectorAll('.happi').forEach(h => { if (window.Happi && !h._happi) Happi.mount(h); });` (TR line 728).

Tasks 4 and 5 call `liveLine`.

- [ ] **Step 3: Verify the caps and the sentence**

Append to `abcwalk.js` (inside a new exported function `checkLine`):

```js
module.exports.checkLine=async()=>{const {w,errs}=open();await sleep(300);
  w.eval(`R.a='My manager ignored my email.';R.feel=['anxious','sad'];`);
  console.log('empty B:',w.eval(`line('')`).includes('not written yet'),'| filled:',/“<span class="gap" data-k="B">they hate me<\/span>”/.test(w.eval(`line('they hate me')`)));
  console.log('sentence text:',new w.DOMParser().parseFromString(w.eval(`line('they hate me')`),'text/html').body.textContent);
  console.log('errors:',errs);};
```

Run `node -e "require('/tmp/claude-503/abcwalk.js').checkLine()"` from `.agents/`.
Expected: `empty B: true | filled: true`; `sentence text: When my manager ignored my email, I thought “they hate me”, and felt anxious and sad.`; `errors: []`.

---

### Task 3: Intro and A · What happened

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `head`, `line`, `bindText` (copied here), `R`.
- Produces: `quick(items, attr='use')`, `bindText(key, need, hint)`, `SCENES`, `scene()`, `crisisCheck(text, el)` hook (stub here, real in Task 7).

- [ ] **Step 1: CSS**

Copy TR lines 78–84 (`.qrs`, `.qr`, weights 800→700), TR lines 109–114 (`.vf`), and add:

```css
  .meta{font-size:var(--t-foot);font-weight:600;color:var(--label-2);margin-bottom:var(--sp-3)}
  .scene{border-radius:var(--r-l);background:#e2eef8;overflow:hidden;margin-bottom:var(--sp-4)}
  .scene svg{display:block;width:100%;height:auto}
  .qr{min-height:var(--tap)}
  textarea::placeholder{color:#6b6b6b;font-weight:600}
  .vf textarea,.tb textarea,.frame textarea{overflow-wrap:anywhere}
```

- [ ] **Step 2: JS helpers**

```js
const quick = (items, attr = 'use') => `<div class="qrs">${items.map(t => `<button class="qr" data-${attr}="${esc(t)}">${esc(t)}</button>`).join('')}</div>`;
// scene chips carry their own thoughts (L2); typed situations get starters instead
const SCENES = [
  {a: 'My manager hasn’t replied to my email since this morning', ph: '“They’re annoyed with me.”', thoughts: ['They’re annoyed with me.', 'I always get this wrong.']},
  {a: 'A friend cancelled our plans an hour before', ph: '“They don’t really want to see me.”', thoughts: ['They don’t really want to see me.', 'I’m not a priority to anyone.']},
];
const B_STARTERS = ['They think I ', 'I always ', 'What if ', 'I should '];
const STARTERS = ['It’s possible that ', 'Even though ', 'I don’t know yet if ', 'A kinder way to see it: '];
const scene = () => SCENES.find(x => x.a === R.a.trim());
let crisisCheck = () => false; // replaced in Task 7
```

Update `own()` so a tapped starter alone is not counted: its strip list must include both `STARTERS` and `B_STARTERS`. Replace TR's `own` with:

```js
const own = t => [...STARTERS, ...B_STARTERS].reduce((x, p) => x.trim().startsWith(p.trim()) ? x.trim().slice(p.trim().length) : x, String(t));
```

Copy TR `bindText` (TR lines 506–514) and change it so (a) the success message is never shown, (b) a 1500 ms typing pause runs `crisisCheck`:

```js
function bindText(key, need, hint) {
  const ta = $('#ta'), st = $('#status'); let pause;
  const upd = () => { const good = words(own(R[key])) >= need;
    document.querySelectorAll('[data-use]').forEach(b => b.setAttribute('aria-pressed', b.dataset.use === R[key].trim()));
    const qs = $('.qrs'); if (qs && $('[data-use]')) qs.hidden = !!R[key].trim();
    st.textContent = good ? '' : hint; $('#next').disabled = !good; };
  ta.oninput = () => { R[key] = ta.value; upd(); clearTimeout(pause); pause = setTimeout(() => crisisCheck(R[key], ta), 1500); steps[idx].live?.(); };
  upd(); focusField(ta);
  document.querySelectorAll('[data-use]').forEach(b => b.onclick = () => { R[key] = b.dataset.use; ta.value = R[key]; upd(); buzz(); focusField(ta); steps[idx].live?.(); });
}
```

- [ ] **Step 3: Steps**

Replace the temporary intro with these two steps (spec § Screen: Intro, § Screen: A):

```js
  {id: 'intro', noProgress: true, noBack: true, next: 'Begin', valid: () => true,
    render: () => `<p class="meta">ABC Analysis · 7 to 10 min · private to you</p>
      <div class="scene">${window.ART ? ART.abc_analysis() : ''}</div>
      ${head('Did something upset you today?')}
      <p class="line map">When ${gap('', 'A')}, I thought ${gap('', 'B')}, and felt ${gap('', 'C')}.</p>`},

  {stage: 0, valid: () => words(R.a) >= 2,
    render: () => `${head('What happened?', 'Write what a camera could have seen or heard.')}
      <label class="vf"><textarea id="ta" rows="3" maxlength="400" placeholder="This morning, my manager…" aria-label="What happened">${esc(R.a)}</textarea></label>
      <p class="note" id="status" aria-live="polite"></p>${quick(SCENES.map(x => x.a))}`,
    bind() { bindText('a', 2, 'A few words is enough to start.'); }},
```

- [ ] **Step 4: Verify**

Append `module.exports.checkA` to the walk: open, click Begin, set `#ta` to `"sdfsdf"` → `#next.disabled === true`; set to `"   "` → disabled; set to a 300-char string without spaces (`'x'.repeat(150)+'ab'.repeat(75)`) → no `errors`, and `doc.querySelector('.vf textarea').value.length===300`; tap the first chip → `R.a` equals the chip text and `.qrs` is hidden. Print each. Expected: `true true` for key-mash/whitespace, chip check `true`, `errors: []`.

---

### Task 4: B · The thought (sentence fills live)

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `line`, `liveLine`, `bindText`, `scene()`, `B_STARTERS`.

- [ ] **Step 1: CSS** — copy TR lines 124–125 (`.tb`, `.tb textarea`).

- [ ] **Step 2: Step** (placed after the strength step from Task 5 in the final order: intro, a, feel, c, **b**, test, alt, c2, summary)

```js
  {stage: 2, valid: () => words(R.b) >= 2, live: () => liveLine(R.b),
    render: () => `${line(R.b)}${head('What went through your mind just then?', 'Do not make it fair yet. Just catch it.')}
      <div class="tb"><textarea id="ta" rows="3" maxlength="300" placeholder="${esc(scene()?.ph || '“They think I…”')}" aria-label="What went through your mind">${esc(R.b)}</textarea></div>
      <p class="note" id="status" aria-live="polite"></p>${quick(scene()?.thoughts || B_STARTERS, scene() ? 'use' : 'start')}`,
    bind() {
      bindText('b', 2, 'A few words is enough.');
      // a starter goes in front of what is there, never wiping it (TR fairer-step behaviour)
      document.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { const ta = $('#ta'); R.b = b.dataset.start + own(ta.value).trim(); ta.value = R.b; ta.dispatchEvent(new Event('input')); focusField(ta); buzz(); });
    }},
```

- [ ] **Step 3: Verify**

Append `module.exports.checkB`: drive intro → A (type "My boss ignored my email") → feelings (tap `anxious`) → strength (Continue) → B. Type "they hate me" (dispatch `input`): `#line` text contains `“they hate me”`. Tap starter "I always " on an empty field: Continue stays disabled (starter alone does not count). Press Back then Continue: `#ta.value` still "I always " and the line still shows it. Expected: `true`, `true`, `true`, `errors: []`.

---

### Task 5: C · Feelings, C · Strength, Re-rate (words, not numbers)

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `head`, `line`, `liveLine`, `EMOTIONS`.
- Produces: `FACES.face(name, on)`, `STRENGTH(v)`, `SKY(f, cls)`, `rateStep({key, q, sub, before})`.

- [ ] **Step 1: CSS**

Copy TR lines 127–165 (sky, `.mid`, `.ctl`, `.read`, `.scale`, `.segs`, range, `.lbls`) and TR lines 167–177 (`.emos`, `.emo`; `.emo` label weight 600), weights 800→700. Then:

```css
  .read b{font-family:var(--font);font-size:var(--t-title);font-weight:700}
  .segs i.was::after{background:#29452a} /* before notch, 10.61:1 (spec) */
  .emo.just[aria-pressed=true]>svg{animation:pop .35s var(--ease)}
  .link{display:inline-flex;align-items:center;min-height:var(--tap);margin-top:var(--sp-3);padding:0;border:0;background:none;font-size:var(--t-sub);font-weight:600;color:var(--accent);text-decoration:underline;text-underline-offset:3px}
```

If TR's `.read span`/`.read em` rules exist, delete them (word only). Copy TR's `.tick` (TR lines 85–87).

- [ ] **Step 2: Art**

Copy from TR's `ART` IIFE only what `face()` needs (TR lines 336–337 `C`, the `svg`, `ln`, `E`, `drop` helpers, `FEAT`, `face`) into a new IIFE named `FACES` that returns `{face}`; it must not reassign `window.ART`. Copy TR `RAYS` + `SKY` (TR lines 483–491).

- [ ] **Step 3: Steps**

```js
const STRENGTH = v => v === 0 ? 'None' : v <= 3 ? 'Mild' : v <= 6 ? 'Medium' : v <= 9 ? 'Strong' : 'Very strong';
function rateStep({key, q, sub = '', before = false}) {
  return {stage: before ? 3 : 1, valid: () => true,
    render: () => { if (R[key] == null) R[key] = R.c; const v = R[key];
      return `<div class="fill">${before ? line(R.alt, 'could think', false) : line('')}${head(q, sub)}
      <div class="mid">${SKY(null, 'live')}</div>
      <div class="ctl"><p class="read" aria-hidden="true"><b id="v">${STRENGTH(v)}</b></p>
      <div class="scale"><div class="segs" aria-hidden="true">${[...Array(10)].map((_, i) => `<i${before && i === R.c - 1 ? ' class="was"' : ''}></i>`).join('')}</div>
      <input type="range" id="rg" min="0" max="10" step="1" value="${v}" aria-label="${esc(q)}" aria-valuetext="${v} out of 10, ${STRENGTH(v)}"></div>
      <div class="lbls"><span>None</span><span>Very strong</span></div>
      ${before ? '<p class="note" id="cmp" aria-live="polite"></p>' : ''}</div></div>`; },
    bind() {
      const segs = document.querySelectorAll('.segs i'), rg = $('#rg');
      const draw = () => { const v = R[key];
        $('#v').textContent = STRENGTH(v); segs.forEach((s, i) => { s.classList.toggle('f', i < v); s.classList.toggle('cur', i === v - 1); });
        $('#app').style.setProperty('--heat-f', v / 10); rg.setAttribute('aria-valuetext', `${v} out of 10, ${STRENGTH(v)}`);
        if (before) { const a = STRENGTH(R.c), b = STRENGTH(v), lw = s => s.toLowerCase();
          $('#cmp').textContent = v < R.c ? (a !== b ? `Less strong than before: ${a} to ${lw(b)}.` : 'A little less strong than before.')
            : v === R.c ? `Same as before: ${b}.` : (a !== b ? `Stronger than before: ${a} to ${lw(b)}.` : 'A little stronger than before.'); } };
      rg.oninput = e => { R[key] = +e.target.value; draw(); }; draw();
    }};
}
```

Feelings step (stage 1), bind body copied from TR step 5 (TR lines 626–637) with `R.feel`/`MAX_FEEL=3`, the toast "Up to 3. Tap one to swap it out.", a `liveLine('')` call after each toggle, and the Hopeless link:

```js
  {stage: 1, valid: () => R.feel.length >= 1,
    render: () => `${line('')}${head('What did you feel?', 'Pick up to 3.')}<div class="emos" id="grid"></div><div id="h2"></div>`,
    bind() { /* TR step-5 draw(), then: */ }},
```

Inside `draw()` after building the grid: `liveLine(''); $('#h2').innerHTML = R.feel.includes('hopeless') ? '<button class="link" id="help2">Get help now</button>' : ''; $('#help2') && ($('#help2').onclick = e => openHelp(e.currentTarget));` (`openHelp` from Task 7; until then define `let openHelp = () => {};`).

Then `rateStep({key:'c', q:'How strong is it right now?'})` and, after the fairer step, `rateStep({key:'c2', q:'How strong is it now?', sub:'Any answer is fine.', before:true})`.

- [ ] **Step 4: Verify**

Append `module.exports.checkRate`: on the strength step no element under `#main` has text matching `/^\d+$/` except inside `input`; `#rg` valuetext is `"5 out of 10, Medium"`. Drive to c2 without moving the slider: `#cmp` reads `Same as before: Medium.` Move to 2: reads `Less strong than before: Medium to mild.` Tapping a 4th feeling leaves `R.feel.length===3`. Expected values printed match; `errors: []`.

---

### Task 6: Test the thought (three checks, no score)

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `line`, `head`.
- Produces: `TESTS`, `sofar()` → sentence string ('' when nothing answered).

- [ ] **Step 1: Data and `sofar()`**

```js
const TESTS = [
  ['fact', 'Is it a fact, or a guess?', ['A fact', 'A guess', 'Not sure']],
  ['friend', 'Would you say it to a friend?', ['Yes', 'Not sure', 'No']],
  ['help', 'Does believing it help you?', ['Yes', 'Not sure', 'No']],
];
const PART = {
  fact: {'A fact': 'you called it a fact', 'A guess': 'you called it a guess', 'Not sure': 'you weren’t sure if it’s a fact'},
  friend: {'Yes': 'you’d say it to a friend', 'No': 'you wouldn’t say it to a friend', 'Not sure': 'you’re not sure you’d say it to a friend'},
  help: {'Yes': 'believing it helps', 'No': 'believing it doesn’t help', 'Not sure': 'you’re not sure it helps'},
};
const sofar = () => { const p = TESTS.filter(([k]) => R.test[k]).map(([k]) => PART[k][R.test[k]]); if (!p.length) return '';
  const s = p.length < 2 ? p[0] : p.slice(0, -1).join(', ') + ' and ' + p.at(-1); return s[0].toUpperCase() + s.slice(1) + '.'; };
```

- [ ] **Step 2: Step**

```js
  {stage: 3, valid: () => TESTS.every(([k]) => R.test[k]),
    render: () => { qi = Math.max(0, TESTS.findIndex(([k]) => !R.test[k])); if (TESTS.every(([k]) => R.test[k])) qi = TESTS.length - 1; return `${line(R.b)}<div id="qs"></div>`; },
    bind() {
      const draw = () => { const [k, q, o] = TESTS[qi];
        const feel = feelText(), v = feel ? feel[0].toUpperCase() + feel.slice(1) : '';
        $('#qs').innerHTML = `${head(q, qi === 0 && v ? `${v} make${R.feel.length > 1 ? '' : 's'} sense. Now check the thought, not yourself.` : '')}
          <div class="qrs">${o.map(a => `<button class="qr" data-a="${a}" aria-pressed="${R.test[k] === a}">${a}</button>`).join('')}</div>
          <p class="note" id="sofar" aria-live="polite">${sofar()}</p>`;
        document.querySelectorAll('.happi').forEach(h => { if (window.Happi && !h._happi) Happi.mount(h); });
        document.querySelectorAll('#qs [data-a]').forEach(b => b.onclick = () => { R.test[k] = b.dataset.a; buzz(); $('#next').disabled = !steps[idx].valid();
          const nx = TESTS.findIndex(([t]) => !R.test[t]); if (nx >= 0) setTimeout(() => { qi = nx; draw(); $('#qs [data-a]').focus(); }, 420); else draw(); });
      };
      draw();
    }},
```

Back within checks: at the end of `bind()` add `this.redraw = draw;` (call bind as `steps[idx].bind()` so `this` is the step). In the `#back` handler, before the default branch:

```js
  if ($('#qs') && qi > 0) { qi--; steps[idx].redraw(); return; }
```

- [ ] **Step 3: Verify**

Append `module.exports.checkTest`: run all 27 combinations through `sofar()` via `w.eval` setting `R.test`; assert each ends with `.`, starts uppercase, contains no `undefined`, no ` ,`. Drive the UI: answer Q1 → after 450 ms the bubble h1 is Q2; press Back → h1 is Q1 and "A guess" is `aria-pressed=true`. Expected: `27 ok`, `true`, `true`, `errors: []`.

---

### Task 7: Fairer thought and crisis path

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `bindText` (calls `crisisCheck`), `crisis`, `R.helpShown`.
- Produces: real `crisisCheck(text, el) → boolean`, `openHelp(el)`, `openSheet`, `closeSheet`.

- [ ] **Step 1: Fairer step** (stage 3; between test and c2)

Copy TR lines 242–244 (`.frame`). Step:

```js
  {stage: 3, valid: () => words(own(R.alt)) >= 2,
    render: () => `${line(R.b, 'thought', false)}${head('What’s a fairer way to say it?', 'Aim for something fair and believable, not forced positive.')}
      <div class="frame"><div><textarea id="ta" rows="3" maxlength="300" placeholder="It’s possible that…" aria-label="A fairer way to say it">${esc(R.alt)}</textarea></div></div>
      <p class="note" id="status" aria-live="polite"></p>${quick(STARTERS, 'start')}`,
    bind() {
      bindText('alt', 2, 'A short sentence is enough.');
      // TR lines 675–678: a starter goes in front, swapping an earlier starter, never wiping words
      document.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { const ta = $('#ta'), cur = ta.value.trim();
        const old = STARTERS.find(s => cur.startsWith(s.trim())), rest = old ? cur.slice(old.trim().length).trim() : cur;
        R.alt = b.dataset.start + (old || /^I\b/.test(rest) ? rest : rest.charAt(0).toLowerCase() + rest.slice(1));
        ta.value = R.alt; ta.dispatchEvent(new Event('input')); focusField(ta); buzz(); });
    }},
```

- [ ] **Step 2: Crisis sheet CSS and markup**

Copy ONB's `.scrim`, `.sheet`, `.sheet h3`, `.sheet p`, `.sheet .btn+.btn`, `.sheet .x` rules and `.sheet.help{animation:none}`, `a.btn{text-decoration:none}` (search ONB for `.scrim{` and `.sheet{`). Add:

```css
  .btn.dark{background:#142414;border:0} /* Call 988: 16.25:1 */
```

- [ ] **Step 3: JS**

```js
const CRISIS=/\b((kill|hurt|cut)(ing)? myself|kms|end (my life|it all)|wanna die|want(ed)? to die|wish i (was|were) dead|better off (dead|without me)|suicid\w*|self[- ]?harm\w*|overdos\w*|no reason to live|can'?t go on|can ?not go on|do(n'?t| not) want to be here)\b/i;
let from = null;
function openHelp(el = document.activeElement) {
  crisis = true; document.querySelectorAll('#main .happi').forEach(h => h.remove()); document.querySelectorAll('#main .ask').forEach(a => a.classList.add('solo'));
  from = el;
  $('#sheet').innerHTML = `<button class="x icon-btn" data-close aria-label="Close">${IC('<path d="M6 6l12 12M18 6L6 18"/>')}</button>
    <h3 id="sh-t">If you’re thinking about hurting yourself, you deserve support now.</h3>
    <p>988 Suicide &amp; Crisis Lifeline · call or text 988</p>
    <a class="btn dark" href="tel:988">Call 988</a><a class="btn" href="sms:988">Text 988</a>
    <p>In danger right now? Call 911.</p>
    <p>Happy isn’t an emergency service. If you might act on these thoughts, call now.</p>
    <button class="btn ghost" data-close>Keep writing</button>`;
  $('#sheet').classList.add('help'); $('#scrim').hidden = $('#sheet').hidden = false; $('#sheet .x').focus();
}
function closeSheet() { $('#scrim').hidden = $('#sheet').hidden = true; from && from.focus(); }
$('#sheet').onclick = e => { if (e.target.closest('[data-close]')) closeSheet(); };
$('#scrim').onclick = closeSheet;
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
$('#sos').onclick = e => openHelp(e.currentTarget);
// auto-opens once per run; a second Continue advances (never blocks)
crisisCheck = (t, el) => { if (R.helpShown || !CRISIS.test(String(t).replace(/[’‘]/g, "'"))) return false; R.helpShown = true; openHelp(el); return true; };
```

Change `let openHelp = () => {}` from Task 5 to this function (delete the stub). In the `#next` handler, before advancing: `if (['a','b','alt'].includes(steps[idx].key) && crisisCheck(R[steps[idx].key], $('#next'))) return;` and give the three free-text steps `key: 'a'`, `key: 'b'`, `key: 'alt'`.

`#close`: keep TR's `confirm` form, but `restart()` must not reset `crisis` (it doesn't: `crisis` lives outside `R`).

- [ ] **Step 4: Verify (Review Focus 5)**

Append `module.exports.checkCrisis`: drive to B, type "I want to end it all", wait 1600 ms → `#sheet` visible, `#ta.value` unchanged. Close; click Continue → advances to the test step (not blocked) and `#main .happi` count is `0`. Restart via `w.eval('restart()')` and go to A → still `0` Happi (`crisis` session-long). Regex: all of "self-harming", "killing myself", "I wish I were dead", "wanna die", "kms", "I do not want to be here" match; "I could die of embarrassment", "The deadline is killing me", "I want to diet" do not. Header `#sos` opens the sheet on the intro. Expected: all `true`, `errors: []`.

---

### Task 8: Summary keepsake and honest copy

**Files:**
- Modify: `.agents/abc-analysis.html`

**Interfaces:**
- Consumes: `R`, `STRENGTH`, `SKY`, `sofar`, `feelText`, `happiOn`, `crisis`.

- [ ] **Step 1: CSS**

Copy TR lines 246–271 (`.verdict`, `.keep`, `.wx`, `.lead`, `.rf`, `.was`, `.ans`, `.fine`), weights 800→700. Then:

```css
  .verdict{display:flex;align-items:center;gap:var(--sp-3)}
  .verdict .happi{flex:none;width:72px;aspect-ratio:220/246}
  .verdict h1{font-family:var(--font);font-size:var(--t-h);font-weight:700}
  .keep{background:#e2eef8}
  .keep .lead,.keep .was{font-weight:500}
  .keep .rf{overflow-wrap:anywhere}
  .wx figcaption b{font-family:var(--font);font-size:var(--t-body);font-weight:600}
```

- [ ] **Step 2: Step**

```js
  {id: 'summary', noProgress: true, next: 'Save and finish', secondary: 'Edit answers', valid: () => true,
    render: () => {
      const d = R.c2 - R.c, a = STRENGTH(R.c), b = STRENGTH(R.c2), lw = s => s.toLowerCase();
      const [h, sub] = d < 0 ? ['The feeling is less strong now.', a !== b ? `From ${lw(a)} to ${lw(b)}, after you checked the thought.` : `Still ${lw(b)}, a little less than before.`]
        : d === 0 ? ['The feeling is about the same.', 'That’s okay. Some thoughts take more than one look.']
        : ['The feeling is stronger right now.', 'Looking closely can do that for a while. You can come back to this later.'];
      const fig = (lbl, v) => `<figure role="img" aria-label="${lbl}: ${STRENGTH(v)}">${SKY(v / 10)}<figcaption aria-hidden="true">${lbl}<b>${STRENGTH(v)}</b></figcaption></figure>`;
      const row = (dt, dd) => dd ? `<dt>${dt}</dt><dd>${dd}</dd>` : '';
      const v = feelText(), feel = v ? v[0].toUpperCase() + v.slice(1) : '';
      const A = esc(lc(R.a.trim().replace(/[.!]+$/, '')));
      return `<div class="verdict">${happiOn() ? `<div class="happi" data-pose="${d <= 0 ? 'proud' : 'abc'}"></div>` : ''}<div><h1>${h}</h1><p class="sub">${sub}</p>
          ${d > 0 && R.c2 >= 7 ? '<button class="link" id="help3">If it feels like too much, you can get help now.</button>' : ''}</div></div>
        <article class="keep" aria-label="Your fairer thought">
          <div class="wx">${fig('Before', R.c)}${ARROW}${fig('Now', R.c2)}</div>
          <p class="lead">When ${A}, I could think</p>
          <p class="rf">“${esc(R.alt.trim())}”</p>
          <p class="was">Instead of “${esc(R.b.trim())}”</p>
        </article>
        <details class="ans"><summary>See your answers</summary><dl>
          ${row('What happened', esc(R.a.trim()))}
          ${row('You felt', `${esc(feel)}. ${a}, then ${lw(b)}.`)}
          ${row('The thought', esc(R.b.trim()))}
          ${row('Checking it', esc(sofar()))}
          ${row('Fairer thought', esc(R.alt.trim()))}
        </dl></details>
        <p class="fine">Saving keeps this in your exercise history, in your own words.</p>`;
    },
    bind() { $('#help3') && ($('#help3').onclick = e => openHelp(e.currentTarget)); }},
```

In the `#next` handler, the last-step branch becomes `buzz(); toast('Saved. It’s yours.'); restart(); return;`.

- [ ] **Step 3: Verify (Review Focus 3)**

Append `module.exports.checkSummary`: for `(c, c2)` in `(7,4)` `(7,7)` `(4,8)` `(5,5)`: set `R` fully via `w.eval`, `idx = steps.length-1; show()`, print `h1` text, `.sub` text, `[data-pose]` value, and whether `#help3` exists. Expected rows: `less strong / From strong to medium… / proud / false`; `about the same / proud / false`; `stronger / abc / true`; `about the same / proud / false`. Count Fredoka elements: `[...doc.querySelectorAll('#main *')].filter(e=>w.getComputedStyle(e).fontFamily.includes('Fredoka')).length` — jsdom may not resolve `happy-ui.css`; if it prints `0`, confirm by grep that `.rf` is the only rule using `--display` in the summary. `errors: []`.

---

### Task 9: Final step order, cleanup, full walk, reviewer

**Files:**
- Modify: `.agents/abc-analysis.html`

- [ ] **Step 1: Order** — `steps` must be exactly: intro, a, feel, `rateStep c`, b, test, alt, `rateStep c2`, summary. Check the stage map against spec § Stages (a=0; feel,c=1; b=2; test,alt,c2=3).

- [ ] **Step 2: Remove orphans** — delete any remaining `ask(`, `said(`, `quick(` with label arg, `nod(`, `heat(`, `miniChain`, `liveB`, `shaky`, `textStep`, `gaugeStep`, `A_EX`, `B_EX`, `D_EX`, `FEELINGS`, `FACE(`, `MAX_FEEL` (if unused) and CSS selectors `.chip`, `.tray`, `.slot`, `.two`, `.dots`, `.chain`, `.hero`, `.shift`, `.tags`, `.group`, `.big`, `.gauge`, `.bub`, `.paper`, `.pair`.

```bash
grep -nE "\.chip|\.tray|\.slot|\.two|\.dots|\.chain|\.hero|\.shift|\.tags|\.group|\.big|\.gauge|\.bub|paper|\.pair|ask\(|said\(|nod\(|shaky|miniChain|textStep|gaugeStep" abc-analysis.html
```
Expected: no output.

- [ ] **Step 3: Full walk** — add `module.exports.full` that drives intro → A (chip) → feel (anxious, sad) → c (move to 7) → B (scene thought chip) → test (A guess, No, No) → alt ("It’s possible that they are busy.") → c2 (move to 4) → summary, printing the bar `aria-valuetext` at each step and the summary h1. Then press "Edit answers" → lands on A with `R.a` intact. Run all checks:

```bash
cd .agents && sed -n '/<script>/,/<\/script>/p' abc-analysis.html | sed '1d;$d' > /tmp/claude-503/abc.js && node --check /tmp/claude-503/abc.js && echo SYNTAX_OK
for f in checkLine checkA checkB checkRate checkTest checkCrisis checkSummary full; do node -e "require('/tmp/claude-503/abcwalk.js').$f()"; done
grep -c "font-weight:\(800\|900\)" abc-analysis.html
```
Expected: `SYNTAX_OK`, every check prints its expected values with `errors: []`, bar text runs `Event, part 1 of 4` → `Feeling, part 2 of 4` ×2 → `Thought, part 3 of 4` → `Rethink, part 4 of 4` ×3 → `Done`, final `0`.

- [ ] **Step 4: Reviewer (L13)** — spawn an Opus reviewer with the before file `/tmp/claude-503/abc-before.html`, the spec path, and this plan: audit drift from the spec, AA contrast of every new pair, aria (sheet dialog, live regions, focus after check swap), orphaned CSS/JS, the bubble caps (script every `head(` first argument: ≤12 words, ≤60 chars), and regressions in `exercises.html` (it links `abc-analysis.html`). Fix findings, rerun Step 3, report both rounds, and state that layouts are unrendered until screenshots.

---

## Self-Review

- **Spec coverage:** Signature `line()` → Task 2, used in Tasks 3–8. Stages → Task 1/9. Happi head + aside → Task 2. Intro/A → Task 3. B → Task 4. Feelings/strength/re-rate → Task 5. Test → Task 6. Fairer + crisis sheet/rules → Task 7. Honest summary → Task 8. Deletions → Task 9 Step 2. Measurement plan (spec) is analytics for the RN build: out of scope for the static prototype.
- **Open item needing the user's sign-off (from the spec):** Happi's one-question bubbles are not counted against 03-character's 3-lines-per-session cap. The spec treats that as an amendment to confirm. `thought-reframing.html` has the same crisis gap; fixing it is a separate task.
- **Placeholders:** none; every code step has code. TR/ONB copies cite exact line ranges or selectors.
- **Names:** `head`, `line`, `liveLine`, `gap`, `lc`, `feelText`, `STRENGTH`, `rateStep`, `sofar`, `crisisCheck`, `openHelp`, `closeSheet`, `quick`, `bindText`, `own`, `words` are used consistently across tasks.

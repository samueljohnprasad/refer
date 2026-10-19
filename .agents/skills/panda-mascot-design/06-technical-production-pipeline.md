# 06 - Technical Production & Engineering Pipeline

This document defines the step-by-step engineering pipeline for generating, post-processing, typing, and integrating new mascot assets into Happy.

---

## 1. Generation Step (Subagent Invocation)

Dispatch `image-generator` subagent with the style reference pointing to `assets/images/panda/panda.png`. Subagent outputs `.jpg` files into the brain artifact directory.

```json
{
  "Model": "inherit",
  "Role": "Panda Asset Illustrator",
  "TypeName": "image-generator",
  "Workspace": "inherit",
  "Prompt": "Premium 2D vector sticker illustration of the exact same chibi panda mascot character from the reference image /Users/samuelprasad/Desktop/happy/journals/assets/images/panda/panda.png... [Prompt recipe]"
}
```

---

## 2. Format Conversion (`sips`)

Convert from JPEG to PNG format:
```bash
sips -s format png input.jpg --out assets/images/panda/panda-[name].png
```

---

## 3. Background Transparency Post-Processing (BFS Flood-Fill)

Because AI image generators produce images on solid white backgrounds, exterior pixels must be made 100% transparent while strictly preserving the panda's white belly and skull.

Run the Node.js `pngjs` flood-fill script:
```javascript
const fs = require('fs');
const { PNG } = require('pngjs');

function makeOuterBgTransparent(filePath) {
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  const { width, height } = png;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBg(x, y) {
    const idx = (y * width + x) * 4;
    return png.data[idx] > 235 && png.data[idx + 1] > 235 && png.data[idx + 2] > 235;
  }

  // Enqueue border pixels that are near-white
  for (let x = 0; x < width; x++) {
    if (isBg(x, 0)) { queue.push(x); visited[x] = 1; }
    if (isBg(x, height - 1)) { queue.push((height - 1) * width + x); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isBg(0, y)) { queue.push(y * width); visited[y * width] = 1; }
    if (isBg(width - 1, y)) { queue.push(y * width + (width - 1)); visited[y * width + (width - 1)] = 1; }
  }

  // BFS traversal clearing only contiguous exterior background
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);
    png.data[curr * 4 + 3] = 0; // Alpha to 0

    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const npos = ny * width + nx;
        if (!visited[npos] && isBg(nx, ny)) {
          visited[npos] = 1;
          queue.push(npos);
        }
      }
    }
  }

  fs.writeFileSync(filePath, PNG.sync.write(png));
}
```

---

## 4. TypeScript Union Extension

Add the new expression key to [`HappiExpression`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/types.ts#L128) in `src/screens/OnboardingScreen/types.ts`:

```typescript
// ponytail: expand mascot expressions
export type HappiExpression =
  | "happy"
  | "waving"
  | "concentrating"
  | "celebrating"
  | "celebrating_jump"
  | "peaceful"
  | "notes"
  | "breathing"
  | "detective"
  | "comfort"
  | "insight"
  | "sleep"
  | "proud_tears"
  | "pancake"
  | "side_eye"
  | "flex"
  | "transcend"
  | "pleading";
```

---

## 5. Component Registration

Map the asset require in [`HappiMascot.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/components/HappiMascot.tsx#L14):

```typescript
const MASCOT_IMAGES: Record<HappiExpression, ImageSourcePropType> = {
  ...
  proud_tears: require("@/assets/images/panda/panda-proud-tears.png"),
  pancake: require("@/assets/images/panda/panda-pancake.png"),
  side_eye: require("@/assets/images/panda/panda-side-eye.png"),
};
```

---

## 6. Verification & Safety Gate
1. **Linter**: Run `npx oxlint <files>` (0 errors required).
2. **Knowledge Graph**: Run `graphify update .` to keep architecture nodes current.
3. **Git Hygiene**: Strict rule — NEVER commit or push automatically. Leave in working tree.

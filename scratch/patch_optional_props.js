const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/savedResponse: unknown;/, 'savedResponse?: unknown;');
  code = code.replace(/savedResponse: Record<string, unknown> \| null;/, 'savedResponse?: unknown;');
  fs.writeFileSync(file, code);
}

patchFile('src/components/exercise/TimelineRewindCategoryEngine.tsx');
patchFile('src/components/exercise/StateSwitchCategoryEngine.tsx');

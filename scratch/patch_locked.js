const fs = require('fs');

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/locked: boolean;/, 'locked?: boolean;');
  fs.writeFileSync(file, code);
}

patchFile('src/components/exercise/TimelineRewindCategoryEngine.tsx');
patchFile('src/components/exercise/StateSwitchCategoryEngine.tsx');

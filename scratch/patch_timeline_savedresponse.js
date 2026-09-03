const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/savedResponse: Record<string, unknown> \| null;/, 'savedResponse: unknown;');

fs.writeFileSync(file, code);

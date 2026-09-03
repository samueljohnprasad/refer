const fs = require('fs');
const file = 'src/components/exercise/TimelineRewindCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import \{ Exercise \} from "\@\/src\/types\/exercises";/, 'import { Exercise } from "@/src/types/journeyV5";');

fs.writeFileSync(file, code);

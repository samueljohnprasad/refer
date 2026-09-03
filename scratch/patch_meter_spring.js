const fs = require('fs');
const file = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/left: withSpring\(\`\\\$\\\{meterValue\\\}%\`, \{ damping: 20, stiffness: 90 \}\)/, 'left: `${withSpring(meterValue, { damping: 20, stiffness: 90 })}%`');

fs.writeFileSync(file, code);

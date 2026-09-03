const fs = require('fs');
const file = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/backgroundColor: "#F9FAFB", \/\/ gray-50/, 'backgroundColor: "#FFFAF5", // warm-surface');
code = code.replace(/borderColor: "#E5E7EB",/, 'borderColor: "#FDE68A",');

fs.writeFileSync(file, code);

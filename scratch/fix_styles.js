const fs = require('fs');
const path = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/    shadowOpacity: 0\.1,\n    shadowRadius: 3,\n    elevation: 3,\n  \},\n    shadowOpacity: 0\.1,\n    shadowRadius: 3,\n    elevation: 3,\n  \},/g, '    shadowOpacity: 0.1,\n    shadowRadius: 3,\n    elevation: 3,\n  },');

fs.writeFileSync(path, code);

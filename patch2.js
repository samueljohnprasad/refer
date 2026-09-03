const fs = require('fs');
const file = 'src/components/exercise/StateSwitchCategoryEngine.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  '<Animated.View style={[styles.meterIndicator, meterIndicatorStyle]} />',
  '<Animated.View layout={LinearTransition.springify().damping(20).stiffness(90)} style={[styles.meterIndicator, meterIndicatorStyle]} />'
);
fs.writeFileSync(file, code);

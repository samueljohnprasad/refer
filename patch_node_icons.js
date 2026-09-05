const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure Ionicons is imported
if (!content.includes('Ionicons')) {
  content = content.replace(
    'import { Feather, FontAwesome5 } from "@expo/vector-icons";',
    'import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";'
  );
}

content = content.replace(
  'if (vm.iconName === "shield" || vm.iconName === "shield-alt") {\n        return <FontAwesome5 name="shield-alt" solid size={28} color={vm.iconColor as string} />;\n      }',
  'if (vm.iconName === "shield" || vm.iconName === "shield-alt") {\n        return <Ionicons name="shield" size={28} color={vm.iconColor as string} />;\n      }'
);

fs.writeFileSync(file, content);

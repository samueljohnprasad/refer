const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (vm.iconName === "shield" || vm.iconName === "shield-alt") {\n        return <FontAwesome5 name="shield-alt" solid size={28} color={vm.iconColor as string} />;\n      }',
  'if (vm.iconName === "shield" || vm.iconName === "shield-alt") {\n        return <FontAwesome5 name="shield-alt" solid size={28} color={vm.iconColor as string} />;\n      }\n      if (vm.iconName === "award") {\n        return <FontAwesome5 name="award" solid size={28} color={vm.iconColor as string} />;\n      }'
);

fs.writeFileSync(file, content);

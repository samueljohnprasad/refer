const fs = require('fs');
let file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '      if (vm.iconName === "award") {\n        return <FontAwesome5 name="award" solid size={28} color={vm.iconColor as string} />;\n      }',
  '      if (vm.iconName === "award") {\n        return <FontAwesome5 name="award" solid size={28} color={vm.iconColor as string} />;\n      }\n      if (vm.iconName === "star") {\n        return <FontAwesome5 name="star" solid size={24} color={vm.iconColor as string} />;\n      }'
);

fs.writeFileSync(file, content);

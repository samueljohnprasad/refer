const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (vm.iconName) {\n\n      return <Feather name={vm.iconName as any} size={28} color={vm.iconColor as string} />;\n    }',
  'if (vm.iconName) {\n      if (vm.iconName === "shield" || vm.iconName === "shield-alt") {\n        return <FontAwesome5 name="shield-alt" solid size={28} color={vm.iconColor as string} />;\n      }\n      return <Feather name={vm.iconName as any} size={28} color={vm.iconColor as string} />;\n    }'
);

fs.writeFileSync(file, content);

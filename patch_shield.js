const fs = require('fs');
const file1 = 'src/domains/journey/ui/hooks/useNodeViewModel.ts';
let content1 = fs.readFileSync(file1, 'utf8');

content1 = content1.replace('iconName = "shield-alt";', 'iconName = "shield";');
fs.writeFileSync(file1, content1);

const file2 = 'src/domains/journey/ui/components/Node.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

content2 = content2.replace(
  '      if (vm.iconName === "shield-alt") {\n        return <FontAwesome5 name={vm.iconName} size={28} color={vm.iconColor as string} />;\n      }',
  ''
);
fs.writeFileSync(file2, content2);

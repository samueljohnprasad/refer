const fs = require('fs');
const file = 'src/domains/journey/ui/components/Node.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '              paddingHorizontal: 12,\n              paddingVertical: 6,\n              backgroundColor: "white",\n              borderRadius: 16,\n              borderWidth: 2,\n              borderColor: "#E5E5E5",\n              shadowColor: "#000",',
  '              paddingHorizontal: 12,\n              paddingVertical: 6,\n              backgroundColor: "white",\n              borderRadius: 16,\n              borderWidth: 2,\n              borderColor: "#E5E5E5",\n              shadowColor: "#000",\n              minWidth: 80,\n              alignItems: "center",\n              justifyContent: "center",'
);

fs.writeFileSync(file, content);

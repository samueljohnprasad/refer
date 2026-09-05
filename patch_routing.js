const fs = require('fs');
let file = 'src/domains/journey/ui/hooks/useJourneyMapController.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '      // Routing for active/completed nodes is handled declaratively by <Link> in JourneyNodeCell\n      return;',
  '      // Imperative routing since <Link> was removed in unification\n      router.push({\n        pathname: "/tabs/screens/journey-flow",\n        params: { courseId, nodeId: node.id },\n      });'
);

fs.writeFileSync(file, content);

const fs = require('fs');
let file = 'src/domains/journey/ui/hooks/useJourneyMapController.tsx';
let content = fs.readFileSync(file, 'utf8');

const imperativeRouting = `      // Imperative routing since <Link> was removed in unification
      router.push({
        pathname: "/tabs/screens/journey-flow",
        params: { courseId, nodeId: node.id },
      });`;

content = content.replace(
  imperativeRouting,
  `      // Routing for active/completed nodes is handled declaratively by <Link> in JourneyNodeCell
      return;`
);

fs.writeFileSync(file, content);

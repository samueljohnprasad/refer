const fs = require('fs');
let file = 'src/domains/journey/ui/components/JourneyNodeCell.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove imports
content = content.replace(/import \{ FontAwesome5[\s\S]*?;/, '');
content = content.replace(/import \{ AnimatedCircularProgress[\s\S]*?;/, '');
content = content.replace(/import \{ Link[\s\S]*?;/, '');
content = content.replace(/import \{ SEMANTIC_COLORS[\s\S]*?;/, '');
content = content.replace(/import \{ RADIUS[\s\S]*?;/, '');
content = content.replace(/import \{ Text \} from "@\/src\/components\/ui\/Text";/, '');
content = content.replace(/import \{ DuolingoSvgNodeButton \} from "\.\/DuolingoSvgNodeButton";/, '');
content = content.replace(/import ChestNode from "\.\/ChestNode";/, '');
content = content.replace(/import TrophyNode from "\.\/TrophyNode";/, '');

// Remove CurrentNodeLabel component
content = content.replace(/function CurrentNodeLabel[\s\S]*?\}\)\n\}\n\n/, '');

// Remove FONTAWESOME_MAP
content = content.replace(/const FONTAWESOME_MAP: Record<string, string> = \{[\s\S]*?\};\n\n/, '');

fs.writeFileSync(file, content);

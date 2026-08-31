import re

with open('src/theme/colors.ts', 'r') as f:
    content = f.read()

content = content.replace(': string;', ': string | OpaqueColorValue;')
content = content.replace('shadow: string;', 'shadow: string | OpaqueColorValue;')
content = content.replace('import { DynamicColorIOS } from "react-native";', 'import { DynamicColorIOS, OpaqueColorValue } from "react-native";')

with open('src/theme/colors.ts', 'w') as f:
    f.write(content)

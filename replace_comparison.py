import sys
import json

with open('supabase/seed/sleep_reset_section_1.sql', 'r') as f:
    content = f.read()

import re

# find the JSON string that has "Two weeks, one body clock"
pattern = r'{"category":"evening_comparison","format":"evening_comparison","completionMode":"direct","primaryLabel":"Continue","title":"Two weeks, one body clock"[^}]+}'
# Wait, it contains nested arrays, so [^}]+ won't work well.
# Let's just find the exact block.

import os
import re

MAPPINGS = {
    r'SAGE_OVERLAY\.clear': '"transparent"',
    r'SAGE_OVERLAY\.whiteTint': '"rgba(255, 255, 255, 0.2)"',
    r'SAGE_OVERLAY\.disabled': '"rgba(20, 36, 20, 0.32)"',
    r'SAGE_OVERLAY\.faint': '"rgba(95, 127, 88, 0.08)"',
    r'SAGE_OVERLAY\.soft': '"rgba(171, 192, 162, 0.14)"',
    r'SAGE_OVERLAY\.mist': '"rgba(211, 224, 205, 0.18)"',
    r'SAGE_OVERLAY\.whisper': '"rgba(95, 127, 88, 0.06)"',
    r'SAGE_DISCOVERY_GRADIENT': '[SEMANTIC_COLORS.surface.primary, SEMANTIC_COLORS.surface.secondary]',
    r'SAGE_RECORDING_GRADIENT': '["#5f7f58", "#abc0a2", "#d3e0cd", "#f2f8ef", "#ffffff"]',
    r'PARROT_ORANGE': 'SEMANTIC_COLORS.warning.indicator',
}

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content

    for pattern, replacement in MAPPINGS.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Migrated {filepath}")

def main():
    dirs_to_sweep = ['src/components', 'src/screens', 'src/domains', 'app']
    for d in dirs_to_sweep:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()

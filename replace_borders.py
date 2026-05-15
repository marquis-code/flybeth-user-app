import os
import re

def replace_borders(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace border-black and directional variants
    content = re.sub(r'border-black', 'border-gray-200', content)
    content = re.sub(r'border-([trblxy])-black', r'border-\1-gray-200', content)
    
    # Replace hover/focus states
    content = re.sub(r'hover:border-black', 'hover:border-gray-300', content)
    content = re.sub(r'focus:border-black', 'focus:border-gray-300', content)
    
    # Replace rings
    content = re.sub(r'ring-black', 'ring-gray-200', content)
    content = re.sub(r'focus:ring-black', 'focus:ring-gray-300', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.nuxt' in root:
        continue
    for file in files:
        if file.endswith('.vue'):
            replace_borders(os.path.join(root, file))
print("Done border replacement")

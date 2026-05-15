import os
import re

def replace_colors(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace text colors
    content = re.sub(r'text-gray-\d+(/\d+)?', 'text-black', content)
    content = re.sub(r'hover:text-gray-\d+(/\d+)?', 'hover:text-black', content)
    content = re.sub(r'focus:text-gray-\d+(/\d+)?', 'focus:text-black', content)
    
    # Replace background colors (let's aggressively make everything black as requested, or maybe white for light?)
    # If the user said "use black color", let's replace all bg-gray with bg-black.
    # To prevent complete UI breakage, maybe bg-gray-100 to 300 -> bg-white?
    # No, instruction: "remove the use gray color color accross board and use black color. agressievlymake these changes"
    # I will replace bg-gray-\d+ with bg-black
    content = re.sub(r'bg-gray-50', 'bg-white', content) # Except very light backgrounds like 50 which are just off-white
    content = re.sub(r'bg-gray-[1-9]\d{1,2}(/\d+)?', 'bg-black', content)
    content = re.sub(r'hover:bg-gray-\d+(/\d+)?', 'hover:bg-black', content)
    
    # Replace borders
    content = re.sub(r'border-gray-\d+(/\d+)?', 'border-black', content)
    content = re.sub(r'hover:border-gray-\d+(/\d+)?', 'hover:border-black', content)
    content = re.sub(r'focus:border-gray-\d+(/\d+)?', 'focus:border-black', content)
    
    # Replace rings
    content = re.sub(r'ring-gray-\d+(/\d+)?', 'ring-black', content)
    content = re.sub(r'focus:ring-gray-\d+(/\d+)?', 'focus:ring-black', content)
    
    # Replace strokes and fills
    content = re.sub(r'stroke-gray-\d+(/\d+)?', 'stroke-black', content)
    content = re.sub(r'fill-gray-\d+(/\d+)?', 'fill-black', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.nuxt' in root:
        continue
    for file in files:
        if file.endswith('.vue'):
            replace_colors(os.path.join(root, file))
print("Done")

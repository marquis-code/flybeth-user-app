const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // This will match bg-black followed by anything except quotes, then text-black
  // or text-black followed by anything except quotes, then bg-black
  // Note: we should only apply this within class="..." or similar context, 
  // but a simple regex works because these are utility classes.
  
  // Replace bg-black with bg-gray-100 when text-black is in the same class string
  // To be safe and simple, let's just do a string replacement on lines that have both
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('bg-black') && line.includes('text-black')) {
      // Don't modify if it also contains text-white
      if (!line.includes('text-white')) {
         return line.replace(/bg-black/g, 'bg-gray-100');
      }
    }
    return line;
  });
  
  content = newLines.join('\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.vue')) {
      processFile(fullPath);
    }
  }
}

walk('/Users/marquis/flybeth/user/components');
walk('/Users/marquis/flybeth/user/pages');


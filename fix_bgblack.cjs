const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix ternary operators and strings
  content = content.replace(/'bg-black text-black'/g, "'bg-gray-100 text-black'");
  content = content.replace(/"bg-black text-black"/g, '"bg-gray-100 text-black"');
  
  // Fix inline classes
  content = content.replace(/bg-black\s+text-black/g, 'bg-gray-100 text-black');
  content = content.replace(/text-black\s+bg-black/g, 'text-black bg-gray-100');

  // Specific fix for "text-black hover:text-black hover:bg-black"
  content = content.replace(/text-black\s+hover:text-black\s+hover:bg-black/g, 'text-black hover:bg-gray-100');

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


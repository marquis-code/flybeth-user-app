const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. In date pickers and calendars: hover:bg-black text-black hover:text-black -> hover:bg-gray-100 text-black
  content = content.replace(/hover:bg-black\s+rounded-xl\s+transition-all\s+text-black\s+hover:text-black/g, 'hover:bg-gray-100 rounded-xl transition-all text-black');
  
  // 2. 'text-black hover:bg-black' -> 'text-black hover:bg-gray-100'
  content = content.replace(/'text-black hover:bg-black'/g, "'text-black hover:bg-gray-100'");
  content = content.replace(/"text-black hover:bg-black"/g, '"text-black hover:bg-gray-100"');
  
  // 3. 'bg-black text-black hover:bg-black' -> 'bg-white text-black border border-gray-200 hover:bg-gray-100'
  content = content.replace(/'bg-black text-black hover:bg-black'/g, "'bg-white text-black border border-gray-200 hover:bg-gray-100'");
  
  // 4. class="... text-black hover:text-black hover:bg-black ... " -> "hover:bg-gray-100"
  content = content.replace(/text-black\s+hover:text-black\s+hover:bg-black/g, 'text-black hover:bg-gray-100');
  content = content.replace(/hover:text-black\s+hover:bg-black/g, 'hover:bg-gray-100');
  
  // 5. 'hover:bg-black hover:text-white cursor-pointer' -> 'hover:bg-gray-100 text-black cursor-pointer'
  content = content.replace(/'hover:bg-black hover:text-white cursor-pointer'/g, "'hover:bg-gray-100 text-black cursor-pointer'");
  
  // 6. p-2 hover:bg-black rounded-full
  content = content.replace(/p-2\s+hover:bg-black\s+rounded-full/g, 'p-2 hover:bg-gray-100 rounded-full');
  
  // p-2 hover:bg-black rounded-xl
  content = content.replace(/p-2\s+hover:bg-black\s+rounded-xl/g, 'p-2 hover:bg-gray-100 rounded-xl');
  content = content.replace(/p-2\.5\s+hover:bg-black/g, 'p-2.5 hover:bg-gray-100');
  content = content.replace(/p-3\s+hover:bg-black\s+rounded-xl/g, 'p-3 hover:bg-gray-100 rounded-xl');
  
  // 7. group-hover:bg-black group-hover:text-white -> group-hover:bg-gray-100
  content = content.replace(/group-hover:bg-black\s+group-hover:text-white/g, 'group-hover:bg-gray-100 text-black');
  
  // 8. SelectInput: hover:bg-black m-1 rounded-lg cursor-pointer transition-colors text-sm text-[#1A1A1B]
  content = content.replace(/hover:bg-black\s+m-1\s+rounded-lg/g, 'hover:bg-gray-100 m-1 rounded-lg');
  
  // 9. StaySearchGuests: text-black hover:bg-black hover:text-white
  content = content.replace(/text-black\s+hover:bg-black\s+hover:text-white/g, 'text-black hover:bg-gray-100');

  // 10. StaySearchCalendar: 'hover:bg-black' -> 'hover:bg-gray-100'
  content = content.replace(/'hover:bg-black'/g, "'hover:bg-gray-100'");
  
  // 11. CustomTimePicker text-black hover:bg-black
  content = content.replace(/text-black\s+hover:bg-black/g, 'text-black hover:bg-gray-100');
  
  // 12. BaseButton text-brand-gray hover:bg-black
  content = content.replace(/text-brand-gray\s+hover:bg-black/g, 'text-brand-gray hover:bg-gray-100');
  
  // 13. dashboard/bookings: bg-white text-black rounded-xl text-xs uppercase hover:bg-black
  content = content.replace(/bg-white\s+text-black([\s\w-]+)hover:bg-black/g, 'bg-white text-black$1hover:bg-gray-100');
  
  // 14. AnimatedInput AM/PM text-black hover:bg-black -> text-black hover:bg-gray-100
  content = content.replace(/bg-black\s+text-black\s+hover:bg-black/g, 'bg-white border border-gray-200 text-black hover:bg-gray-100');

  // 15. NavBar hover:bg-black on transparent text-black items
  content = content.replace(/text-black\s+hover:bg-gray-100/g, 'text-black hover:bg-gray-100');

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


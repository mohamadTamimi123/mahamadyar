const fs = require('fs');

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

// Function to normalize Persian/Arabic numbers to Arabic
function normalizeNumbers(text) {
  const persianNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const arabicNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let normalized = text;
  for (let i = 0; i < persianNumbers.length; i++) {
    normalized = normalized.replace(new RegExp(persianNumbers[i], 'g'), arabicNumbers[i]);
  }
  return normalized;
}

// Function to extract only items/names from the text
function extractItems(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    const items = [];
    let itemId = 1;
    
    for (const line of lines) {
      // Look for numbered items like "١-علي احمد. ٢-فاطمه ھمسر عوض۔ ٣-علي رضا."
      const itemMatches = line.matchAll(/([٠-٩١-٩0-9]+)[-ـ]\s*([^٠-٩١-٩0-9]+?)(?:\s*$|\.|،|\d)/g);
      
      for (const match of itemMatches) {
        const originalId = normalizeNumbers(match[1]);
        const itemName = cleanText(match[2]);
        
        if (itemName && itemName !== '') {
          items.push({
            id: itemId++,
            originalId: originalId,
            name: itemName
          });
        }
      }
      
      // Also look for main family member names from "فرزندان" headers
      const memberMatch = line.match(/^([٠-٩١-٩0-9]+)[-ـ]\s*فرزندان\s+(.+?)(?:\s*$|!)/);
      if (memberMatch) {
        const originalId = normalizeNumbers(memberMatch[1]);
        const memberName = cleanText(memberMatch[2]);
        
        items.push({
          id: itemId++,
          originalId: originalId,
          name: memberName,
          type: 'main_member'
        });
      }
    }
    
    return items;
    
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

// Main execution
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
console.log(`Extracting items from: ${inputFile}`);

const items = extractItems(inputFile);

if (items.length > 0) {
  // Save items as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/items-only.json';
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8');
  
  console.log(`Items extracted and saved to: ${outputPath}`);
  console.log(`Total items found: ${items.length}`);
  
  // Show first 20 items
  console.log('\n=== First 20 Items ===');
  items.slice(0, 20).forEach(item => {
    console.log(`${item.id}. ${item.name} (Original ID: ${item.originalId})`);
  });
  
  // Create simple CSV
  const csvHeaders = ['ID', 'OriginalID', 'Name'];
  const csvRows = [csvHeaders.join(',')];
  
  items.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.originalId}"`,
      `"${item.name}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/items-only.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Show statistics
  const mainMembers = items.filter(item => item.type === 'main_member').length;
  const regularItems = items.length - mainMembers;
  
  console.log(`\n=== Statistics ===`);
  console.log(`Main family members: ${mainMembers}`);
  console.log(`Regular items: ${regularItems}`);
  console.log(`Total items: ${items.length}`);
  
} else {
  console.error('No items found in the file');
}

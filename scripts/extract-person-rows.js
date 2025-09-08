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

// Function to extract complete person records (rows) from the text
function extractPersonRows(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into blocks (each person's complete record)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    
    const personRows = [];
    let rowId = 1;
    
    blocks.forEach(block => {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length === 0) return;
      
      // Look for the main person header (فرزندان line)
      let mainPersonLine = '';
      let personId = '';
      let personName = '';
      
      for (const line of lines) {
        const memberMatch = line.match(/^([٠-٩١-٩0-9]+)[-ـ]\s*فرزندان\s+(.+?)(?:\s*$|!)/);
        if (memberMatch) {
          personId = normalizeNumbers(memberMatch[1]);
          personName = cleanText(memberMatch[2]);
          mainPersonLine = line;
          break;
        }
      }
      
      // If we found a main person, create a complete record
      if (personId && personName) {
        const personRow = {
          id: rowId++,
          personId: personId,
          personName: personName,
          fullText: block.trim(),
          birthPlace: null,
          residence: null,
          deathPlace: null,
          children: [],
          notes: []
        };
        
        // Extract children from the block
        for (const line of lines) {
          // Look for children lines like "١-علي احمد. ٢-فاطمه ھمسر عوض۔ ٣-علي رضا."
          if (line.match(/^[٠-٩١-٩0-9]+[-ـ]\s*[^٠-٩١-٩0-9]/) && !line.includes('فرزندان')) {
            const childMatches = line.matchAll(/([٠-٩١-٩0-9]+)[-ـ]\s*([^٠-٩١-٩0-9]+?)(?:\s*$|\.|،|\d)/g);
            for (const match of childMatches) {
              const childId = normalizeNumbers(match[1]);
              const childName = cleanText(match[2]);
              if (childName && childName !== '') {
                personRow.children.push({
                  id: childId,
                  name: childName
                });
              }
            }
          }
          
          // Extract birth place, residence, death place
          if (line.includes('تولد')) {
            personRow.birthPlace = cleanText(line.replace(/تولد\s*[:\-]\s*/, ''));
          } else if (line.includes('مقیم')) {
            personRow.residence = cleanText(line.replace(/مقیم\s*[:\-]\s*/, ''));
          } else if (line.includes('وفات')) {
            personRow.deathPlace = cleanText(line.replace(/وفات\s*[:\-]\s*/, ''));
          }
        }
        
        personRows.push(personRow);
      }
    });
    
    return personRows;
    
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

// Main execution
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
console.log(`Extracting person rows from: ${inputFile}`);

const personRows = extractPersonRows(inputFile);

if (personRows.length > 0) {
  // Save person rows as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/person-rows.json';
  fs.writeFileSync(outputPath, JSON.stringify(personRows, null, 2), 'utf8');
  
  console.log(`Person rows extracted and saved to: ${outputPath}`);
  console.log(`Total person rows found: ${personRows.length}`);
  
  // Show first 3 person rows
  console.log('\n=== First 3 Person Rows ===');
  personRows.slice(0, 3).forEach((row, index) => {
    console.log(`\n--- Row ${index + 1} ---`);
    console.log(`ID: ${row.id}`);
    console.log(`Person ID: ${row.personId}`);
    console.log(`Person Name: ${row.personName}`);
    console.log(`Birth Place: ${row.birthPlace || 'N/A'}`);
    console.log(`Residence: ${row.residence || 'N/A'}`);
    console.log(`Death Place: ${row.deathPlace || 'N/A'}`);
    console.log(`Children Count: ${row.children.length}`);
    console.log(`Children: ${row.children.map(c => `${c.id}-${c.name}`).join(', ')}`);
    console.log(`Full Text Length: ${row.fullText.length} characters`);
  });
  
  // Create CSV with essential information
  const csvHeaders = ['ID', 'PersonID', 'PersonName', 'BirthPlace', 'Residence', 'DeathPlace', 'ChildrenCount', 'ChildrenList'];
  const csvRows = [csvHeaders.join(',')];
  
  personRows.forEach(row => {
    const childrenList = row.children.map(c => `${c.id}-${c.name}`).join('; ');
    const rowData = [
      `"${row.id}"`,
      `"${row.personId}"`,
      `"${row.personName}"`,
      `"${row.birthPlace || ''}"`,
      `"${row.residence || ''}"`,
      `"${row.deathPlace || ''}"`,
      `"${row.children.length}"`,
      `"${childrenList}"`
    ];
    csvRows.push(rowData.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/person-rows.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Create a simplified version with just the essential data
  const simplifiedRows = personRows.map(row => ({
    id: row.id,
    personId: row.personId,
    personName: row.personName,
    birthPlace: row.birthPlace,
    residence: row.residence,
    deathPlace: row.deathPlace,
    childrenCount: row.children.length,
    children: row.children.map(child => `${child.id}-${child.name}`)
  }));
  
  const simplifiedPath = '/home/tmp/Documents/shajare-back/data/person-rows-simplified.json';
  fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedRows, null, 2), 'utf8');
  console.log(`Simplified version saved to: ${simplifiedPath}`);
  
  // Show statistics
  const totalChildren = personRows.reduce((sum, row) => sum + row.children.length, 0);
  const withBirthInfo = personRows.filter(row => row.birthPlace).length;
  const withResidence = personRows.filter(row => row.residence).length;
  const withDeathInfo = personRows.filter(row => row.deathPlace).length;
  
  console.log(`\n=== Statistics ===`);
  console.log(`Total person rows: ${personRows.length}`);
  console.log(`Total children: ${totalChildren}`);
  console.log(`Rows with birth info: ${withBirthInfo}`);
  console.log(`Rows with residence info: ${withResidence}`);
  console.log(`Rows with death info: ${withDeathInfo}`);
  
} else {
  console.error('No person rows found in the file');
}

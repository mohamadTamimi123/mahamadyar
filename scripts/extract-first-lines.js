const fs = require('fs');

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

// Function to extract names from line 1 using separators: 2 spaces, "ولد", dash
function extractNamesFromLine(line1) {
  if (!line1) return { personName: '', fatherName: '' };
  
  // Find "فرزندان" and get text after it
  const فرزندانIndex = line1.indexOf('فرزندان');
  if (فرزندانIndex === -1) return { personName: '', fatherName: '' };
  
  const afterفرزندان = line1.substring(فرزندانIndex + 'فرزندان'.length).trim();
  
  // First, try to find "ولد" to separate person and father
  const ولدIndex = afterفرزندان.indexOf('ولد');
  
  if (ولدIndex !== -1) {
    // Split by "ولد"
    const personPart = afterفرزندان.substring(0, ولدIndex).trim();
    const fatherPart = afterفرزندان.substring(ولدIndex + 'ولد'.length).trim();
    
    // Clean person name (remove extra text after first word)
    let personName = personPart;
    
    // If person name contains "يا", take only the first part
    if (personName.includes('يا')) {
      personName = personName.split('يا')[0].trim();
    }
    
    // Clean father name (take only first part before dash)
    let fatherName = fatherPart;
    const dashIndex = fatherName.indexOf('-');
    if (dashIndex !== -1) {
      fatherName = fatherName.substring(0, dashIndex).trim();
    }
    
    // Also clean father name from extra spaces and text
    fatherName = fatherName.split('  ')[0].trim(); // Split by 2 spaces and take first part
    
    // Remove "ولد" and everything after it from father name
    const fatherولدIndex = fatherName.indexOf('ولد');
    if (fatherولدIndex !== -1) {
      fatherName = fatherName.substring(0, fatherولدIndex).trim();
    }
    
    return {
      personName: cleanName(personName),
      fatherName: cleanName(fatherName)
    };
  } else {
    // If no "ولد", split by dash
    const dashIndex = afterفرزندان.indexOf('-');
    if (dashIndex !== -1) {
      const personName = afterفرزندان.substring(0, dashIndex).trim();
      let fatherName = afterفرزندان.substring(dashIndex + 1).trim();
      
      // Clean father name - take only first part before next dash
      const nextDashIndex = fatherName.indexOf('-');
      if (nextDashIndex !== -1) {
        fatherName = fatherName.substring(0, nextDashIndex).trim();
      }
      
      // Also clean father name from extra spaces
      fatherName = fatherName.split('  ')[0].trim(); // Split by 2 spaces and take first part
      
      return {
        personName: cleanName(personName),
        fatherName: cleanName(fatherName)
      };
    } else {
      // If no separators, just return the text as person name
      return {
        personName: cleanName(afterفرزندان),
        fatherName: ''
      };
    }
  }
}

// Function to clean a name
function cleanName(name) {
  if (!name) return '';
  
  // Remove trailing punctuation
  name = name.replace(/[.!؟]+$/, '');
  
  // Remove leading numbers with dots/dashes
  name = name.replace(/^\d+[.-]\s*/, '');
  
  // Remove Persian numbers at start
  name = name.replace(/^\s*[١٢٣٤٥٦٧٨٩٠]+\s*/, '');
  
  // Clean text - but don't remove spaces between words
  name = name.trim().replace(/\s+/g, ' ');
  
  return name;
}

// Read the text file
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
const text = fs.readFileSync(inputFile, 'utf8');

// Split into blocks
const blocks = text.split(/\n\s*\n/).filter(block => block.trim());

console.log(`Extracting first lines from: ${inputFile}`);
console.log(`Total blocks found: ${blocks.length}`);

// Extract first lines
const firstLines = [];

blocks.forEach((block, index) => {
  const lines = block.split('\n').map(line => line.trim()).filter(line => line);
  const firstLine = lines[0] || '';
  
  if (firstLine) {
    // Extract names from first line using new algorithm
    const names = extractNamesFromLine(firstLine);
    
    firstLines.push({
      blockId: index + 1,
      firstLine: firstLine,
      personName: names.personName,
      fatherName: names.fatherName
    });
  }
});

// Display first 20 first lines
console.log('\n=== First 20 First Lines ===');
firstLines.slice(0, 20).forEach((item, index) => {
  console.log(`\n--- Block ${item.blockId} ---`);
  console.log(`Person Name: ${item.personName}`);
  console.log(`Father Name: ${item.fatherName}`);
  console.log(`First Line: ${item.firstLine}`);
  console.log('--- End Block ---');
});

// Save as JSON
const jsonFile = '/home/tmp/Documents/shajare-back/data/first-lines.json';
fs.writeFileSync(jsonFile, JSON.stringify(firstLines, null, 2), 'utf8');

// Save as CSV
const csvHeaders = ['BlockID', 'PersonName', 'FatherName', 'FirstLine'];
const csvRows = [csvHeaders.join(',')];

firstLines.forEach(item => {
  const row = [
    `"${item.blockId}"`,
    `"${item.personName.replace(/"/g, '""')}"`,
    `"${item.fatherName.replace(/"/g, '""')}"`,
    `"${item.firstLine.replace(/"/g, '""')}"`
  ];
  csvRows.push(row.join(','));
});

const csvFile = '/home/tmp/Documents/shajare-back/data/first-lines.csv';
fs.writeFileSync(csvFile, csvRows.join('\n'), 'utf8');

// Save as text file
const textContent = firstLines.map(item => 
  `=== Block ${item.blockId} ===\nPerson Name: ${item.personName}\nFather Name: ${item.fatherName}\nFirst Line: ${item.firstLine}\n--- End Block ---\n`
).join('\n');

const txtFile = '/home/tmp/Documents/shajare-back/data/first-lines.txt';
fs.writeFileSync(txtFile, textContent, 'utf8');

console.log(`\nFirst lines saved to: ${jsonFile}`);
console.log(`CSV file saved to: ${csvFile}`);
console.log(`Text file saved to: ${txtFile}`);

console.log('\n=== Statistics ===');
console.log(`Total blocks: ${blocks.length}`);
console.log(`Blocks with first lines: ${firstLines.length}`);
console.log(`Blocks with person names: ${firstLines.filter(item => item.personName).length}`);
console.log(`Blocks with father names: ${firstLines.filter(item => item.fatherName).length}`);

console.log('\n=== Sample Person Names with Fathers ===');
const personNamesWithFathers = firstLines.filter(item => item.personName && item.fatherName).slice(0, 10);
personNamesWithFathers.forEach(item => {
  console.log(`Block ${item.blockId}: "${item.personName}" - Father: "${item.fatherName}"`);
});

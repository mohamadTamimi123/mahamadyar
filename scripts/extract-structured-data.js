const fs = require('fs');

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

// Function to extract full person name from first line
function extractFullPersonName(blockText) {
  // Look for "فرزندان" followed by a name
  const match = blockText.match(/فرزندان\s+(.+?)(?:\s*$|!|\.|،)/);
  if (match) {
    const namePart = match[1].trim();
    return cleanText(namePart);
  }
  return null;
}

// Function to extract children names from numbered lists
function extractChildrenNames(blockText) {
  const children = [];
  
  // Look for numbered lists (١- ٢- ۳- ٤- ٥- etc.)
  const lines = blockText.split('\n');
  
  for (const line of lines) {
    // Match lines that start with Persian/Arabic numbers followed by a dash
    const match = line.match(/^[١٢٣٤٥٦٧٨٩٠]+\s*[-–—]\s*(.+)$/);
    if (match) {
      const childText = match[1].trim();
      
      // Split by common separators and clean each child name
      const childNames = childText.split(/[،,]/).map(name => {
        // Remove common suffixes like "ھمسر", "ول", etc.
        let cleanName = name.trim();
        cleanName = cleanName.replace(/\s+ھمسر\s+.*$/, ''); // Remove spouse info
        cleanName = cleanName.replace(/\s+ول\s+.*$/, ''); // Remove "ول" info
        cleanName = cleanName.replace(/\s+ولد\s+.*$/, ''); // Remove "ولد" info
        cleanName = cleanName.replace(/\s+ح\s+.*$/, ''); // Remove "ح" prefix
        cleanName = cleanName.replace(/\s+.*$/, ''); // Remove everything after first space
        return cleanText(cleanName);
      }).filter(name => name && name.length > 0 && name !== 'فرزندان');
      
      children.push(...childNames);
    }
  }
  
  return children;
}

// Function to extract birth information
function extractBirthInfo(blockText) {
  // Extract birth information (تولد)
  const birthMatch = blockText.match(/تولد\s*[:：]\s*([^\n]+)/);
  if (birthMatch) {
    return cleanText(birthMatch[1]);
  }
  return null;
}

// Function to extract city/residence information
function extractCityInfo(blockText) {
  // Extract residence information (مقیم)
  const residenceMatch = blockText.match(/مقیم\s*[:：]\s*([^\n]+)/);
  if (residenceMatch) {
    return cleanText(residenceMatch[1]);
  }
  return null;
}

// Function to extract structured information from text blocks
function extractStructuredInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into blocks (separated by double newlines)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    
    const structuredItems = [];
    
    blocks.forEach((block, index) => {
      const cleanBlock = block.trim();
      if (cleanBlock) {
        const fullName = extractFullPersonName(cleanBlock);
        const children = extractChildrenNames(cleanBlock);
        const birth = extractBirthInfo(cleanBlock);
        const city = extractCityInfo(cleanBlock);
        
        structuredItems.push({
          id: index + 1,
          blockId: index + 1,
          fullName: fullName || `Block_${index + 1}`,
          children: children,
          birth: birth,
          city: city,
          text: cleanBlock,
          length: cleanBlock.length,
          lines: cleanBlock.split('\n').length
        });
      }
    });
    
    return structuredItems;
    
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

// Main execution
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
console.log(`Extracting structured information from: ${inputFile}`);

const structuredItems = extractStructuredInfo(inputFile);

if (structuredItems.length > 0) {
  // Save structured items as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/structured-family-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(structuredItems, null, 2), 'utf8');
  
  console.log(`Structured family data extracted and saved to: ${outputPath}`);
  console.log(`Total blocks found: ${structuredItems.length}`);
  
  // Show first 15 structured items
  console.log('\n=== First 15 Structured Family Data Items ===');
  structuredItems.slice(0, 15).forEach((item, index) => {
    console.log(`\n--- Block ${index + 1} ---`);
    console.log(`ID: ${item.id}`);
    console.log(`Block ID: ${item.blockId}`);
    console.log(`Full Name: ${item.fullName}`);
    console.log(`Children: ${item.children.length > 0 ? JSON.stringify(item.children) : 'N/A'}`);
    console.log(`Birth: ${item.birth || 'N/A'}`);
    console.log(`City: ${item.city || 'N/A'}`);
    console.log(`Length: ${item.length} characters`);
    console.log(`Lines: ${item.lines}`);
    console.log(`Text: ${item.text}`);
    console.log('--- End Block ---');
  });
  
  // Create CSV with structured information
  const csvHeaders = ['ID', 'BlockID', 'FullName', 'Children', 'Birth', 'City', 'Text', 'Length', 'Lines'];
  const csvRows = [csvHeaders.join(',')];
  
  structuredItems.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.blockId}"`,
      `"${item.fullName}"`,
      `"${JSON.stringify(item.children)}"`,
      `"${item.birth || ''}"`,
      `"${item.city || ''}"`,
      `"${item.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${item.length}"`,
      `"${item.lines}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/structured-family-data.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Create a simple text file with structured information
  const textOutputPath = '/home/tmp/Documents/shajare-back/data/structured-family-data.txt';
  const textContent = structuredItems.map(item => `=== Block ID: ${item.blockId} ===
Full Name: ${item.fullName}
Children: ${item.children.length > 0 ? JSON.stringify(item.children) : 'N/A'}
Birth: ${item.birth || 'N/A'}
City: ${item.city || 'N/A'}
Text: ${item.text}
`).join('\n');
  fs.writeFileSync(textOutputPath, textContent, 'utf8');
  console.log(`Text file saved to: ${textOutputPath}`);
  
  // Show statistics
  const totalLength = structuredItems.reduce((sum, item) => sum + item.length, 0);
  const avgLength = Math.round(totalLength / structuredItems.length);
  const blocksWithNames = structuredItems.filter(item => !item.fullName.startsWith('Block_')).length;
  const blocksWithChildren = structuredItems.filter(item => item.children.length > 0).length;
  const blocksWithBirth = structuredItems.filter(item => item.birth !== null).length;
  const blocksWithCity = structuredItems.filter(item => item.city !== null).length;
  
  console.log(`\n=== Statistics ===`);
  console.log(`Total blocks: ${structuredItems.length}`);
  console.log(`Blocks with extracted names: ${blocksWithNames}`);
  console.log(`Blocks with default names: ${structuredItems.length - blocksWithNames}`);
  console.log(`Blocks with children information: ${blocksWithChildren}`);
  console.log(`Blocks with birth information: ${blocksWithBirth}`);
  console.log(`Blocks with city information: ${blocksWithCity}`);
  console.log(`Total characters: ${totalLength}`);
  console.log(`Average length: ${avgLength} characters`);
  
  // Show some examples of structured information
  console.log('\n=== Sample Structured Information ===');
  const namedBlocks = structuredItems.filter(item => !item.fullName.startsWith('Block_')).slice(0, 20);
  namedBlocks.forEach(item => {
    const childrenInfo = item.children.length > 0 ? `Children: ${JSON.stringify(item.children)}` : '';
    const birthInfo = item.birth ? `Birth: ${item.birth}` : '';
    const cityInfo = item.city ? `City: ${item.city}` : '';
    const info = [childrenInfo, birthInfo, cityInfo].filter(Boolean).join(', ');
    console.log(`Block ID: ${item.blockId} - ${item.fullName} (${info})`);
  });
  
  // Show blocks with children
  console.log('\n=== Blocks with Children Information ===');
  const blocksWithChildrenInfo = structuredItems.filter(item => item.children.length > 0).slice(0, 15);
  blocksWithChildrenInfo.forEach(item => {
    console.log(`Block ID: ${item.blockId} - ${item.fullName} (Children: ${JSON.stringify(item.children)})`);
  });
  
} else {
  console.error('No blocks found in the file');
}

const fs = require('fs');

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

// Function to extract name after "فرزندان"
function extractNameFromBlock(blockText) {
  // Look for "فرزندان" followed by a name
  const match = blockText.match(/فرزندان\s+(.+?)(?:\s*$|!|\.|،)/);
  if (match) {
    const namePart = match[1].trim();
    // Take only the first part before any dashes or special characters
    const firstPart = namePart.split(/[-–—]/)[0].trim();
    return cleanText(firstPart);
  }
  return null;
}

// Function to extract parent and grandfather from name with "ولد"
function extractParentAndGrandfatherFromName(name) {
  if (!name) return { parent: null, grandfather: null };
  
  // Split by "ولد" and analyze each part
  const parts = name.split('ولد');
  
  if (parts.length < 2) {
    return { parent: null, grandfather: null };
  }
  
  // First "ولد" - this is the parent
  const parentPart = parts[1].trim();
  const parent = parentPart.split(/[-–—]/)[0].trim();
  
  let grandfather = null;
  
  // If there's a second "ولد", that's the grandfather
  if (parts.length >= 3) {
    const grandfatherPart = parts[2].trim();
    grandfather = grandfatherPart.split(/[-–—]/)[0].trim();
  }
  
  return { 
    parent: cleanText(parent), 
    grandfather: grandfather ? cleanText(grandfather) : null 
  };
}

// Function to extract children names from the numbered list
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

// Function to extract birth, residence, and death information
function extractBirthResidenceDeath(blockText) {
  let birth = null;
  let residence = null;
  let death = false;
  
  // Extract birth information (تولد)
  const birthMatch = blockText.match(/تولد\s*[:：]\s*([^\n]+)/);
  if (birthMatch) {
    birth = cleanText(birthMatch[1]);
  }
  
  // Extract residence information (مقیم)
  const residenceMatch = blockText.match(/مقیم\s*[:：]\s*([^\n]+)/);
  if (residenceMatch) {
    residence = cleanText(residenceMatch[1]);
  }
  
  // Check for death information (وفات)
  if (blockText.includes('وفات')) {
    death = true;
  }
  
  return { birth, residence, death };
}

// Function to extract text blocks with all information including children
function extractTextBlocksWithAllInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into blocks (separated by double newlines)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    
    const textItems = [];
    
    blocks.forEach((block, index) => {
      const cleanBlock = block.trim();
      if (cleanBlock) {
        const name = extractNameFromBlock(cleanBlock);
        const { parent, grandfather } = name ? extractParentAndGrandfatherFromName(name) : { parent: null, grandfather: null };
        const { birth, residence, death } = extractBirthResidenceDeath(cleanBlock);
        const children = extractChildrenNames(cleanBlock);
        
        textItems.push({
          id: index + 1,
          blockId: index + 1,
          name: name || `Block_${index + 1}`,
          parent: parent,
          grandfather: grandfather,
          children: children,
          birth: birth,
          residence: residence,
          death: death,
          text: cleanBlock,
          length: cleanBlock.length,
          lines: cleanBlock.split('\n').length
        });
      }
    });
    
    return textItems;
    
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

// Main execution
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
console.log(`Extracting text blocks with names, block IDs, parents, grandfathers, children, birth, residence, and death from: ${inputFile}`);

const textItems = extractTextBlocksWithAllInfo(inputFile);

if (textItems.length > 0) {
  // Save text items as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-final-complete.json';
  fs.writeFileSync(outputPath, JSON.stringify(textItems, null, 2), 'utf8');
  
  console.log(`Text blocks with complete information including children extracted and saved to: ${outputPath}`);
  console.log(`Total text blocks found: ${textItems.length}`);
  
  // Show first 15 text blocks with all information including children
  console.log('\n=== First 15 Text Blocks with Complete Information Including Children ===');
  textItems.slice(0, 15).forEach((item, index) => {
    console.log(`\n--- Block ${index + 1} ---`);
    console.log(`ID: ${item.id}`);
    console.log(`Block ID: ${item.blockId}`);
    console.log(`Name: ${item.name}`);
    console.log(`Parent: ${item.parent || 'N/A'}`);
    console.log(`Grandfather: ${item.grandfather || 'N/A'}`);
    console.log(`Children: ${item.children.length > 0 ? item.children.join(', ') : 'N/A'}`);
    console.log(`Birth: ${item.birth || 'N/A'}`);
    console.log(`Residence: ${item.residence || 'N/A'}`);
    console.log(`Death: ${item.death ? 'Yes' : 'No'}`);
    console.log(`Length: ${item.length} characters`);
    console.log(`Lines: ${item.lines}`);
    console.log(`Text: ${item.text}`);
    console.log('--- End Block ---');
  });
  
  // Create CSV with all information including children
  const csvHeaders = ['ID', 'BlockID', 'Name', 'Parent', 'Grandfather', 'Children', 'Birth', 'Residence', 'Death', 'Text', 'Length', 'Lines'];
  const csvRows = [csvHeaders.join(',')];
  
  textItems.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.blockId}"`,
      `"${item.name}"`,
      `"${item.parent || ''}"`,
      `"${item.grandfather || ''}"`,
      `"${item.children.join('; ')}"`,
      `"${item.birth || ''}"`,
      `"${item.residence || ''}"`,
      `"${item.death ? 'Yes' : 'No'}"`,
      `"${item.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${item.length}"`,
      `"${item.lines}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/text-blocks-final-complete.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Create a simple text file with all information including children
  const textOutputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-final-complete.txt';
  const textContent = textItems.map(item => `=== Block ID: ${item.blockId} - ${item.name} ===
Parent: ${item.parent || 'N/A'}
Grandfather: ${item.grandfather || 'N/A'}
Children: ${item.children.length > 0 ? item.children.join(', ') : 'N/A'}
Birth: ${item.birth || 'N/A'}
Residence: ${item.residence || 'N/A'}
Death: ${item.death ? 'Yes' : 'No'}
Text: ${item.text}
`).join('\n');
  fs.writeFileSync(textOutputPath, textContent, 'utf8');
  console.log(`Text file saved to: ${textOutputPath}`);
  
  // Show statistics
  const totalLength = textItems.reduce((sum, item) => sum + item.length, 0);
  const avgLength = Math.round(totalLength / textItems.length);
  const blocksWithNames = textItems.filter(item => !item.name.startsWith('Block_')).length;
  const blocksWithParents = textItems.filter(item => item.parent !== null).length;
  const blocksWithGrandfathers = textItems.filter(item => item.grandfather !== null).length;
  const blocksWithChildren = textItems.filter(item => item.children.length > 0).length;
  const blocksWithBirth = textItems.filter(item => item.birth !== null).length;
  const blocksWithResidence = textItems.filter(item => item.residence !== null).length;
  const blocksWithDeath = textItems.filter(item => item.death === true).length;
  
  console.log(`\n=== Statistics ===`);
  console.log(`Total text blocks: ${textItems.length}`);
  console.log(`Blocks with extracted names: ${blocksWithNames}`);
  console.log(`Blocks with default names: ${textItems.length - blocksWithNames}`);
  console.log(`Blocks with parent information: ${blocksWithParents}`);
  console.log(`Blocks with grandfather information: ${blocksWithGrandfathers}`);
  console.log(`Blocks with children information: ${blocksWithChildren}`);
  console.log(`Blocks with birth information: ${blocksWithBirth}`);
  console.log(`Blocks with residence information: ${blocksWithResidence}`);
  console.log(`Blocks with death information: ${blocksWithDeath}`);
  console.log(`Total characters: ${totalLength}`);
  console.log(`Average length: ${avgLength} characters`);
  
  // Show some examples of extracted information including children
  console.log('\n=== Sample Extracted Information Including Children ===');
  const namedBlocks = textItems.filter(item => !item.name.startsWith('Block_')).slice(0, 20);
  namedBlocks.forEach(item => {
    const parentInfo = item.parent ? `Parent: ${item.parent}` : '';
    const grandfatherInfo = item.grandfather ? `Grandfather: ${item.grandfather}` : '';
    const childrenInfo = item.children.length > 0 ? `Children: ${item.children.join(', ')}` : '';
    const birthInfo = item.birth ? `Birth: ${item.birth}` : '';
    const residenceInfo = item.residence ? `Residence: ${item.residence}` : '';
    const deathInfo = item.death ? `Death: Yes` : '';
    const info = [parentInfo, grandfatherInfo, childrenInfo, birthInfo, residenceInfo, deathInfo].filter(Boolean).join(', ');
    console.log(`Block ID: ${item.blockId} - ${item.name} (${info})`);
  });
  
  // Show blocks with children
  console.log('\n=== Blocks with Children Information ===');
  const blocksWithChildrenInfo = textItems.filter(item => item.children.length > 0).slice(0, 15);
  blocksWithChildrenInfo.forEach(item => {
    console.log(`Block ID: ${item.blockId} - ${item.name} (Children: ${item.children.join(', ')})`);
  });
  
} else {
  console.error('No text blocks found in the file');
}

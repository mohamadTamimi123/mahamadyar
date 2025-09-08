const fs = require('fs');

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

// Function to extract person's name from line 1 (after "فرزندان")
function extractPersonName(line1) {
  if (!line1) return '';
  
  // Simple approach: find "فرزندان" and extract everything after it until "ولد" or end
  const فرزندانIndex = line1.indexOf('فرزندان');
  if (فرزندانIndex === -1) return '';
  
  const afterفرزندان = line1.substring(فرزندانIndex + 'فرزندان'.length).trim();
  
  // Find the end of the name - look for multiple patterns
  let nameEnd = afterفرزندان.length;
  
  // Check for "ولد" first - but only if it's not part of the name
  const ولدIndex = afterفرزندان.indexOf('ولد');
  if (ولدIndex !== -1 && ولدIndex > 3) { // Only if it's not at the beginning
    nameEnd = ولدIndex;
  }
  
  // Check for dash patterns
  const dashPatterns = [' - ', '- ', ' -', '-'];
  for (const pattern of dashPatterns) {
    const dashIndex = afterفرزندان.indexOf(pattern);
    if (dashIndex !== -1 && dashIndex < nameEnd) {
      nameEnd = dashIndex;
    }
  }
  
  let personName = afterفرزندان.substring(0, nameEnd).trim();
  
  // Clean up the name
  personName = personName.replace(/[.!؟]+$/, ''); // Remove trailing punctuation
  personName = personName.replace(/^\d+[.-]\s*/, ''); // Remove leading numbers with dots/dashes
  personName = personName.replace(/^\s*[١٢٣٤٥٦٧٨٩٠]+\s*/, ''); // Remove Persian numbers at start
  personName = cleanText(personName);
  
  // Additional cleanup for specific cases
  if (personName.includes('يا')) {
    personName = personName.split('يا')[0].trim();
  }
  
  return personName;
}

// Function to extract all numbered children from line 2
function extractAllNumberedChildren(line2) {
  if (!line2) return [];
  
  const children = [];
  
  // Split by Persian numbers and process each segment
  const segments = line2.split(/([١٢٣٤٥٦٧٨٩٠]+\s*[-–—]\s*)/);
  
  for (let i = 1; i < segments.length; i += 2) {
    const numberPart = segments[i]; // e.g., "١- "
    const namePart = segments[i + 1]; // e.g., "سنبل.  ٢-میثم۔ ۳- ردا۔ ۴- عباس آرین۔"
    
    if (namePart) {
      // Extract the name until the next number or end
      const nextNumberMatch = namePart.match(/^([^١٢٣٤٥٦٧٨٩٠]+?)(?=\s*[١٢٣٤٥٦٧٨٩٠]+\s*[-–—]|$)/);
      
      if (nextNumberMatch) {
        let childName = nextNumberMatch[1].trim();
        
        // Clean the child name - preserve multi-syllable names
        // Remove spouse information (ھمسر)
        childName = childName.replace(/\s+ھمسر\s+.*$/, '');
        
        // Remove "ول" info
        childName = childName.replace(/\s+ول\s+.*$/, '');
        
        // Remove "ولد" info
        childName = childName.replace(/\s+ولد\s+.*$/, '');
        
        // Remove "ح" prefix
        childName = childName.replace(/\s+ح\s+.*$/, '');
        
        // Remove trailing punctuation and dots
        childName = childName.replace(/[.،,;؛!؟]+$/, '');
        
        // Clean up extra spaces
        childName = cleanText(childName);
        
        if (childName && childName.length > 0 && childName !== 'فرزندان') {
          children.push(childName);
        }
      }
    }
  }
  
  return children;
}

// Function to extract and display each line of each block separately with all numbered children
function extractTextBlocksWithAllChildren(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into blocks (separated by double newlines)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    
    const blocksWithChildren = [];
    
    blocks.forEach((block, index) => {
      const cleanBlock = block.trim();
      if (cleanBlock) {
        const lines = cleanBlock.split('\n').map(line => line.trim()).filter(line => line);
        
        // Extract all numbered children from line 2 (if it exists)
        const children = lines.length >= 2 ? extractAllNumberedChildren(lines[1]) : [];
        
        // Extract person's name from line 1 (after "فرزندان")
        const personName = extractPersonName(lines[0] || '');
        
        blocksWithChildren.push({
          blockId: index + 1,
          totalLines: lines.length,
          line1: lines[0] || '',
          line2: lines[1] || '',
          line3: lines[2] || '',
          line4: lines[3] || '',
          personName: personName,
          children: children,
          fullText: cleanBlock
        });
      }
    });
    
    return blocksWithChildren;
    
  } catch (error) {
    console.error('Error reading file:', error.message);
    return [];
  }
}

// Main execution
const inputFile = '/home/tmp/Documents/shajare-back/mainData/123.txt';
console.log(`Extracting text blocks with all numbered children from line 2 from: ${inputFile}`);

const blocksWithChildren = extractTextBlocksWithAllChildren(inputFile);

if (blocksWithChildren.length > 0) {
  console.log(`Total blocks found: ${blocksWithChildren.length}`);
  
  // Display first 20 blocks with all numbered children
  console.log('\n=== First 20 Blocks with All Numbered Children ===');
  blocksWithChildren.slice(0, 20).forEach((block, index) => {
    console.log(`\n--- Block ${block.blockId} (${block.totalLines} lines) ---`);
    console.log(`Person Name: ${block.personName}`);
    console.log(`Line 1: ${block.line1}`);
    console.log(`Line 2: ${block.line2}`);
    console.log(`Children: ${JSON.stringify(block.children)}`);
    if (block.line3) console.log(`Line 3: ${block.line3}`);
    if (block.line4) console.log(`Line 4: ${block.line4}`);
    console.log('--- End Block ---');
  });
  
  // Save as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-all-children.json';
  fs.writeFileSync(outputPath, JSON.stringify(blocksWithChildren, null, 2), 'utf8');
  console.log(`\nText blocks with all numbered children saved to: ${outputPath}`);
  
  // Save as CSV
  const csvHeaders = ['BlockID', 'PersonName', 'Line1', 'Line2', 'Children', 'Line3', 'Line4', 'TotalLines'];
  const csvRows = [csvHeaders.join(',')];
  
  blocksWithChildren.forEach(block => {
    const row = [
      `"${block.blockId}"`,
      `"${block.personName.replace(/"/g, '""')}"`,
      `"${block.line1.replace(/"/g, '""')}"`,
      `"${block.line2.replace(/"/g, '""')}"`,
      `"${JSON.stringify(block.children)}"`,
      `"${block.line3.replace(/"/g, '""')}"`,
      `"${block.line4.replace(/"/g, '""')}"`,
      `"${block.totalLines}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-all-children.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`CSV file saved to: ${csvPath}`);
  
  // Save as text file
  const textOutputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-all-children.txt';
  const textContent = blocksWithChildren.map(block => 
    `=== Block ${block.blockId} (${block.totalLines} lines) ===
Person Name: ${block.personName}
Line 1: ${block.line1}
Line 2: ${block.line2}
Children: ${JSON.stringify(block.children)}
Line 3: ${block.line3}
Line 4: ${block.line4}
--- End Block ---
`).join('\n');
  fs.writeFileSync(textOutputPath, textContent, 'utf8');
  console.log(`Text file saved to: ${textOutputPath}`);
  
  // Show statistics
  const totalLines = blocksWithChildren.reduce((sum, block) => sum + block.totalLines, 0);
  const avgLines = Math.round(totalLines / blocksWithChildren.length);
  const blocksWithChildrenInfo = blocksWithChildren.filter(block => block.children.length > 0).length;
  const totalChildren = blocksWithChildren.reduce((sum, block) => sum + block.children.length, 0);
  
  console.log(`\n=== Statistics ===`);
  console.log(`Total blocks: ${blocksWithChildren.length}`);
  console.log(`Total lines: ${totalLines}`);
  console.log(`Average lines per block: ${avgLines}`);
  console.log(`Blocks with children information: ${blocksWithChildrenInfo}`);
  console.log(`Total children found: ${totalChildren}`);
  console.log(`Average children per block: ${blocksWithChildrenInfo > 0 ? Math.round(totalChildren / blocksWithChildrenInfo) : 0}`);
  
  // Show blocks with multiple children
  console.log('\n=== Blocks with Multiple Children ===');
  const blocksWithMultipleChildren = blocksWithChildren.filter(block => block.children.length > 1).slice(0, 15);
  blocksWithMultipleChildren.forEach(block => {
    console.log(`Block ${block.blockId}: ${JSON.stringify(block.children)} (${block.children.length} children)`);
    console.log(`  Line 1: ${block.line1}`);
    console.log(`  Line 2: ${block.line2}`);
    console.log('---');
  });
  
  // Show blocks with most children
  console.log('\n=== Blocks with Most Children ===');
  const blocksWithMostChildren = blocksWithChildren
    .filter(block => block.children.length > 0)
    .sort((a, b) => b.children.length - a.children.length)
    .slice(0, 10);
  
  blocksWithMostChildren.forEach(block => {
    console.log(`Block ${block.blockId}: ${block.children.length} children - ${JSON.stringify(block.children)}`);
  });
  
} else {
  console.error('No blocks found in the file');
}
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

// Function to extract text blocks with names and block IDs
function extractTextBlocksWithNamesAndIDs(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into blocks (separated by double newlines)
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
    
    const textItems = [];
    
    blocks.forEach((block, index) => {
      const cleanBlock = block.trim();
      if (cleanBlock) {
        const name = extractNameFromBlock(cleanBlock);
        
        textItems.push({
          id: index + 1,
          blockId: index + 1, // Add block ID field
          name: name || `Block_${index + 1}`, // Use extracted name or default
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
console.log(`Extracting text blocks with names and block IDs from: ${inputFile}`);

const textItems = extractTextBlocksWithNamesAndIDs(inputFile);

if (textItems.length > 0) {
  // Save text items as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names-and-ids.json';
  fs.writeFileSync(outputPath, JSON.stringify(textItems, null, 2), 'utf8');
  
  console.log(`Text blocks with names and block IDs extracted and saved to: ${outputPath}`);
  console.log(`Total text blocks found: ${textItems.length}`);
  
  // Show first 10 text blocks with names and block IDs
  console.log('\n=== First 10 Text Blocks with Names and Block IDs ===');
  textItems.slice(0, 10).forEach((item, index) => {
    console.log(`\n--- Block ${index + 1} ---`);
    console.log(`ID: ${item.id}`);
    console.log(`Block ID: ${item.blockId}`);
    console.log(`Name: ${item.name}`);
    console.log(`Length: ${item.length} characters`);
    console.log(`Lines: ${item.lines}`);
    console.log(`Text: ${item.text}`);
    console.log('--- End Block ---');
  });
  
  // Create CSV with names and block IDs
  const csvHeaders = ['ID', 'BlockID', 'Name', 'Text', 'Length', 'Lines'];
  const csvRows = [csvHeaders.join(',')];
  
  textItems.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.blockId}"`,
      `"${item.name}"`,
      `"${item.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${item.length}"`,
      `"${item.lines}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names-and-ids.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Create a simple text file with names and block IDs
  const textOutputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names-and-ids.txt';
  const textContent = textItems.map(item => `=== Block ID: ${item.blockId} - ${item.name} ===\n${item.text}\n`).join('\n');
  fs.writeFileSync(textOutputPath, textContent, 'utf8');
  console.log(`Text file saved to: ${textOutputPath}`);
  
  // Show statistics
  const totalLength = textItems.reduce((sum, item) => sum + item.length, 0);
  const avgLength = Math.round(totalLength / textItems.length);
  const blocksWithNames = textItems.filter(item => !item.name.startsWith('Block_')).length;
  
  console.log(`\n=== Statistics ===`);
  console.log(`Total text blocks: ${textItems.length}`);
  console.log(`Blocks with extracted names: ${blocksWithNames}`);
  console.log(`Blocks with default names: ${textItems.length - blocksWithNames}`);
  console.log(`Total characters: ${totalLength}`);
  console.log(`Average length: ${avgLength} characters`);
  
  // Show some examples of extracted names with block IDs
  console.log('\n=== Sample Extracted Names with Block IDs ===');
  const namedBlocks = textItems.filter(item => !item.name.startsWith('Block_')).slice(0, 10);
  namedBlocks.forEach(item => {
    console.log(`Block ID: ${item.blockId} - ${item.name}`);
  });
  
} else {
  console.error('No text blocks found in the file');
}

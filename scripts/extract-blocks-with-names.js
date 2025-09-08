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

// Function to extract text blocks with names
function extractTextBlocksWithNames(filePath) {
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
console.log(`Extracting text blocks with names from: ${inputFile}`);

const textItems = extractTextBlocksWithNames(inputFile);

if (textItems.length > 0) {
  // Save text items as JSON
  const outputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names.json';
  fs.writeFileSync(outputPath, JSON.stringify(textItems, null, 2), 'utf8');
  
  console.log(`Text blocks with names extracted and saved to: ${outputPath}`);
  console.log(`Total text blocks found: ${textItems.length}`);
  
  // Show first 10 text blocks with names
  console.log('\n=== First 10 Text Blocks with Names ===');
  textItems.slice(0, 10).forEach((item, index) => {
    console.log(`\n--- Block ${index + 1} ---`);
    console.log(`ID: ${item.id}`);
    console.log(`Name: ${item.name}`);
    console.log(`Length: ${item.length} characters`);
    console.log(`Lines: ${item.lines}`);
    console.log(`Text: ${item.text}`);
    console.log('--- End Block ---');
  });
  
  // Create CSV with names
  const csvHeaders = ['ID', 'Name', 'Text', 'Length', 'Lines'];
  const csvRows = [csvHeaders.join(',')];
  
  textItems.forEach(item => {
    const row = [
      `"${item.id}"`,
      `"${item.name}"`,
      `"${item.text.replace(/"/g, '""')}"`, // Escape quotes for CSV
      `"${item.length}"`,
      `"${item.lines}"`
    ];
    csvRows.push(row.join(','));
  });
  
  const csvPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names.csv';
  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
  console.log(`\nCSV file saved to: ${csvPath}`);
  
  // Create a simple text file with names
  const textOutputPath = '/home/tmp/Documents/shajare-back/data/text-blocks-with-names.txt';
  const textContent = textItems.map(item => `=== ${item.name} (Block ${item.id}) ===\n${item.text}\n`).join('\n');
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
  
  // Show some examples of extracted names
  console.log('\n=== Sample Extracted Names ===');
  const namedBlocks = textItems.filter(item => !item.name.startsWith('Block_')).slice(0, 10);
  namedBlocks.forEach(item => {
    console.log(`${item.id}. ${item.name}`);
  });
  
} else {
  console.error('No text blocks found in the file');
}

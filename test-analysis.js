const { AnalysisEngine } = require('./src/migration/AnalysisEngine.ts');

// Test the analysis engine with a real HTML file
const engine = new AnalysisEngine();

try {
  const analysis = engine.analyzeHTMLStructure('html/index.html');
  console.log('Analysis Results:');
  console.log('File:', analysis.fileName);
  console.log('Total Lines:', analysis.totalLines);
  console.log('CSS Blocks:', analysis.cssBlocks.length);
  console.log('JS Blocks:', analysis.jsBlocks.length);
  console.log('Components:', analysis.components.length);
  console.log('Assets:', analysis.assets.length);
  
  // Show first CSS block details
  if (analysis.cssBlocks.length > 0) {
    console.log('\nFirst CSS Block:');
    console.log('Start Line:', analysis.cssBlocks[0].startLine);
    console.log('End Line:', analysis.cssBlocks[0].endLine);
    console.log('Type:', analysis.cssBlocks[0].type);
    console.log('Content Preview:', analysis.cssBlocks[0].content.substring(0, 100) + '...');
  }
  
  // Show first JS block details
  if (analysis.jsBlocks.length > 0) {
    console.log('\nFirst JS Block:');
    console.log('Start Line:', analysis.jsBlocks[0].startLine);
    console.log('End Line:', analysis.jsBlocks[0].endLine);
    console.log('Type:', analysis.jsBlocks[0].type);
    console.log('Content Preview:', analysis.jsBlocks[0].content.substring(0, 100) + '...');
  }

  // Show component details
  if (analysis.components.length > 0) {
    console.log('\nFirst 3 Components:');
    analysis.components.slice(0, 3).forEach((comp, idx) => {
      console.log(`${idx + 1}. ${comp.name} (Lines ${comp.startLine}-${comp.endLine}) - Reusable: ${comp.isReusable}`);
    });
  }

  // Show asset details
  if (analysis.assets.length > 0) {
    console.log('\nFirst 5 Assets:');
    analysis.assets.slice(0, 5).forEach((asset, idx) => {
      console.log(`${idx + 1}. ${asset.type}: ${asset.path} (Line ${asset.line})`);
    });
  }
} catch (error) {
  console.error('Error:', error.message);
}
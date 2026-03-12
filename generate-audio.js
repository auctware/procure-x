/**
 * ProcureX Audio Generation Script
 * 
 * This script converts the project introduction script to audio using various TTS methods.
 * 
 * Prerequisites:
 * - For Azure: npm install @azure/cognitiveservices-speech
 * - For AWS: npm install aws-sdk
 * - For Google: npm install @google-cloud/text-to-speech
 */

// Example using Node.js built-in TTS (requires system TTS)
// For production, use a cloud TTS service

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the script
const scriptPath = path.join(__dirname, 'project-introduction-script.txt');
const script = fs.readFileSync(scriptPath, 'utf-8');

// Extract just the spoken content (remove timestamps and markers)
function extractSpeechContent(text) {
  const lines = text.split('\n');
  let speechLines = [];
  let inSpeechBlock = false;
  
  for (const line of lines) {
    // Skip timestamps like [00:00 - 00:05]
    if (line.match(/^\[\d+:\d+ - \d+:\d+\]/)) {
      inSpeechBlock = true;
      continue;
    }
    
    // Skip markers like INTRODUCTION MUSIC
    if (line.match(/^\[.*MUSIC|FADE|OUTRO|END/)) {
      continue;
    }
    
    // Skip section headers
    if (line.match(/^[A-Z\s]+$/) && line.length > 20) {
      continue;
    }
    
    // Skip divider lines
    if (line.match(/^=+$/)) {
      continue;
    }
    
    // Skip empty lines at start/end of blocks
    if (line.trim() === '' && inSpeechBlock) {
      continue;
    }
    
    // Collect actual speech content
    if (inSpeechBlock && line.trim() !== '') {
      speechLines.push(line.trim());
    }
  }
  
  return speechLines.join(' ');
}

// Main function
function main() {
  const speechContent = extractSpeechContent(script);
  
  // Save cleaned speech content
  const outputPath = path.join(__dirname, 'procurex-intro-speech.txt');
  fs.writeFileSync(outputPath, speechContent, 'utf-8');
  
  console.log('✅ Speech content extracted and saved to:', outputPath);
  console.log('\n📝 Next steps:');
  console.log('1. Copy the content from procurex-intro-speech.txt');
  console.log('2. Use one of the following methods to generate audio:');
  console.log('   - Online TTS: https://www.naturalreaders.com/');
  console.log('   - macOS: say -v Samantha -f procurex-intro-speech.txt -o procurex-intro.aiff');
  console.log('   - Windows: Use built-in Narrator or install Balabolka');
  console.log('   - Cloud TTS: Use Azure, AWS, or Google Cloud services');
  console.log('\n📊 Speech content length:', speechContent.length, 'characters');
  console.log('⏱️  Estimated duration: ~2-3 minutes');
}

// Run if executed directly
main();

export { extractSpeechContent };

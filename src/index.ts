import heicConvert from 'heic-convert';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Function to convert .HEIC to .jpg using heic-convert
const convertHeicToJpg = async (inputFile: string, outputFile: string): Promise<void> => {
  try {
    const inputBuffer = await readFileAsync(inputFile);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG',      // output format
      quality: 0.3           // set quality (1 is highest quality)
    });
    
    await writeFileAsync(outputFile, Buffer.from(outputBuffer));
    console.log(`Conversion successful: ${outputFile}`);
  } catch (error) {
    console.error(`Error during conversion: ${error}`);
  }
};

// Grab command-line arguments for input and output files
const [,, inputFile] = process.argv;

// Validate the input and output files
if (!inputFile) {
  console.error('Usage: ts-node convert-heic-to-jpg.ts <inputFile>');
  process.exit(1);
}

const outputFile = inputFile.replace(/heic/gi, 'jpg');

// Resolve the paths
const resolvedInputFile = path.resolve(__dirname, inputFile);
const resolvedOutputFile = path.resolve(__dirname, outputFile);

if (fs.existsSync(resolvedInputFile)) {
  convertHeicToJpg(resolvedInputFile, resolvedOutputFile);
} else {
  console.error(`File not found: ${resolvedInputFile}`);
}

import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract text from Word document
async function extractTextFromDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return null;
  }
}

// Function to get chapter title from filename
function getChapterTitle(fileName) {
  // Remove .docx extension and clean up the name
  const cleanName = fileName.replace(".docx", "");

  // Extract the number and title from format like "(1)Square and Cube"
  const match = cleanName.match(/\((\d+)\)(.+)/);
  if (match) {
    const number = match[1];
    const title = match[2].trim();
    return `Chapter ${number}: ${title}`;
  }

  // If no number found, just use the filename
  return cleanName;
}

// Main function to process all Word files
async function processWordFiles() {
  const publicDir = path.join(__dirname, "public");
  const files = fs
    .readdirSync(publicDir)
    .filter((file) => file.endsWith(".docx"));

  const allNotes = [];

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(publicDir, file);
    const content = await extractTextFromDocx(filePath);

    if (content) {
      const chapterTitle = getChapterTitle(file);

      // Create one note per file
      const note = {
        id: `word-${allNotes.length + 1}`,
        title: chapterTitle,
        content:
          content.substring(0, 500) + (content.length > 500 ? "..." : ""),
        fullContent: content,
        subject: "Mathematics",
        tags: [
          "word-document",
          "study-material",
          file.replace(".docx", ""),
          "chapter",
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isPrivate: false,
        color: "bg-blue-100 border-blue-300",
        sourceFile: file,
      };

      allNotes.push(note);
    }
  }

  // Save to a JSON file
  const outputPath = path.join(__dirname, "src", "data", "word-notes.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allNotes, null, 2));

  console.log(`Extracted ${allNotes.length} notes from ${files.length} files`);
  console.log(`Notes saved to ${outputPath}`);

  return allNotes;
}

// Run the extraction
processWordFiles().catch(console.error);

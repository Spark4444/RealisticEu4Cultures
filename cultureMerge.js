import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gameProvincesPath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Europa Universalis IV\\history\\provinces";
const modProvincesPath = path.join(__dirname, "RealisticEu4Cultures", "history", "provinces");
const finalProvincesPath = modProvincesPath;
const source = ["high-german"];
const target = `"high-german"`;

try {
  // Read all txt files only inside the game provinces directory
  const files = fs
    .readdirSync(finalProvincesPath)
    .filter((file) => file.endsWith(".txt"));
  let filesChanged = 0;

  // Go through all the files
  for (const file of files) {
    const sourcePath = path.join(finalProvincesPath, file);
    const content = fs.readFileSync(sourcePath, "utf8");
    let updatedContent = content;
    let replaceFile = false;

    for (const sourceCulture of source) {
      // Matches "culture = old_culture" with any amount of spacing
      const regex = new RegExp(`\\bculture\\s*=\\s*${sourceCulture}\\b`, "g");

      if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(regex, `culture = ${target}`);
        replaceFile = true;
      }
    }

    // Update the file with new content (obvious)
    if (replaceFile) {
      filesChanged += 1;
      const outputPath = path.join(modProvincesPath, file);
      fs.writeFileSync(outputPath, updatedContent, "utf8");
    }
  }

  console.log(`Files changed: ${filesChanged}`);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gameProvincesPath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Europa Universalis IV\\history\\provinces";
const modProvincesPath = path.join(__dirname, "RealisticEu4Cultures", "history", "provinces");
const finalProvincesPath = gameProvincesPath;
const source = ["4547", "221", "1748", "225", "224", "218", "4548", "1749"];
const target = {
  culture: `castillian`,
  religion: "catholic",
};

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
    const id = file.split(" - ")[0];
    let updatedContent = content;
    let replaceFile = false;

    for (const sourceProvince of source) {
        if (id === sourceProvince) {
            // Go over the file content line by line
            const lines = updatedContent.split("\n");
            lines.map((line, index) => {
                Object.entries(target).forEach(([key, value]) => {
                    if (line.includes(`${key} =`)) {
                        replaceFile = true;
                        return lines[index] = `${key} = ${value}`;
                    }
                    else {
                        return line;
                    }
                });
                updatedContent = lines.join("\n");
            });
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

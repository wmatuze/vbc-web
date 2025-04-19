const fs = require("fs");
const path = require("path");

// Function to extract data from JavaScript files
const extractDataFromJsFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Extract the array part from the file
    const match = content.match(
      /const\s+\w+\s*=\s*(\[\s*\{[\s\S]*\}\s*\])\s*;\s*export\s+default/
    );
    if (match && match[1]) {
      return match[1];
    }
    throw new Error(`Could not extract data from ${filePath}`);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "[]";
  }
};

// Convert zonesData.js to JSON
const zonesJsPath = path.join(
  __dirname,
  "apps",
  "website",
  "src",
  "data",
  "zonesData.js"
);
const zonesData = extractDataFromJsFile(zonesJsPath);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write zones data to JSON file
fs.writeFileSync(path.join(dataDir, "zones.json"), zonesData, "utf8");

// Convert cellGroupsData.js to JSON
const cellGroupsJsPath = path.join(
  __dirname,
  "apps",
  "website",
  "src",
  "data",
  "cellGroupsData.js"
);
const cellGroupsData = extractDataFromJsFile(cellGroupsJsPath);

// Write cell groups data to JSON file
fs.writeFileSync(path.join(dataDir, "cellGroups.json"), cellGroupsData, "utf8");

console.log("Data conversion completed successfully!");

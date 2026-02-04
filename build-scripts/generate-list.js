import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "..", "assets");
const distDir = path.join(__dirname, "..", "dist");

function getAllFiles(dir, baseDir) {
  let fileList = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      fileList = fileList.concat(getAllFiles(fullPath, baseDir));
    } else if (item.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      fileList.push(relPath);
    }
  }

  return fileList;
}

const allFiles = getAllFiles(assetsDir, assetsDir);

function writeContentFiles(folder) {
  const outPath = path.join(folder, "content-files.txt");
  fs.writeFileSync(outPath, allFiles.join("\n"), "utf8");
  console.log(`content-files.txt created in ${folder}`);
}

// writeContentFiles(assetsDir);
writeContentFiles(distDir);

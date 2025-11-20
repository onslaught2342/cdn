import fs from "fs-extra";
import path from "path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const EXCLUDE_FILES = [
	".gitignore",
	".gitattributes",
	".prettierignore",
	"README.md",
	"LICENSE",
	"wrangler.toml",
];

console.log("🧹 Cleaning dist folder...");
fs.emptyDirSync(distDir);

console.log("📦 Copying files (structure preserved, <=100MB)...");

function copyWithStructure(srcDir, destDir) {
	for (const item of fs.readdirSync(srcDir)) {
		const srcPath = path.join(srcDir, item);
		const destPath = path.join(destDir, item);
		const stats = fs.statSync(srcPath);

		// Skip unnecessary folders
		if (
			[
				"node_modules",
				"dist",
				".git",
				".github",
				".qodo",
				"build-scripts",
			].includes(item)
		) {
			continue;
		}

		// Skip excluded individual files
		const relativePath = path.relative(rootDir, srcPath).replace(/\\/g, "/");
		if (EXCLUDE_FILES.includes(relativePath)) {
			console.log(`🚫 Skipped excluded file: ${relativePath}`);
			continue;
		}

		if (stats.isDirectory()) {
			fs.ensureDirSync(destPath); // create folder in dist
			copyWithStructure(srcPath, destPath); // recursive copy
		} else {
			// Skip large files
			if (stats.size > MAX_FILE_SIZE) {
				console.log(
					`🚫 Skipped large file: ${relativePath} (${(
						stats.size /
						1024 /
						1024
					).toFixed(2)} MB)`
				);
				continue;
			}

			fs.copyFileSync(srcPath, destPath);
		}
	}
}

copyWithStructure(rootDir, distDir);

console.log(
	"✅ Github build ready in /dist (structure preserved, assets + wallpapers <=100MB)."
);

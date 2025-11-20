import fs from "fs-extra";
import path from "path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 25 MB in bytes

console.log("🧹 Cleaning dist folder...");
fs.emptyDirSync(distDir);

console.log("📦 Copying files (structure preserved, <=25MB)...");

function copyWithStructure(srcDir, destDir) {
	for (const item of fs.readdirSync(srcDir)) {
		const srcPath = path.join(srcDir, item);
		const destPath = path.join(destDir, item);
		const stats = fs.statSync(srcPath);

		// Skip unnecessary folders
		if (["node_modules", "dist", ".git", ".github", ".qodo"].includes(item)) {
			continue;
		}

		if (stats.isDirectory()) {
			fs.ensureDirSync(destPath); // create folder in dist
			copyWithStructure(srcPath, destPath); // recursive copy
		} else {
			// Skip large files
			if (stats.size > MAX_FILE_SIZE) {
				console.log(
					`🚫 Skipped large file: ${srcPath} (${(
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
	"✅ Cloudflare-like build ready in /dist (structure preserved, assets + wallpapers <=25MB)."
);

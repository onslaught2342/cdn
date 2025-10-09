import fs from "fs-extra";
import path from "path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

console.log("🧹 Cleaning dist folder...");
fs.emptyDirSync(distDir);

console.log("📦 Flattening and copying all files into /dist...");

function copyFilesFlatten(srcDir) {
	for (const item of fs.readdirSync(srcDir)) {
		const srcPath = path.join(srcDir, item);
		const stats = fs.statSync(srcPath);

		// Skip these directories entirely
		if (["node_modules", "dist", ".git", ".github", ".qodo"].includes(item)) {
			continue;
		}

		if (stats.isDirectory()) {
			copyFilesFlatten(srcPath); // recursively go deeper
		} else {
			const destPath = path.join(distDir, path.basename(srcPath)); // flatten structure
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

copyFilesFlatten(rootDir);

console.log("✅ GitHub build ready in /dist (flattened, all files dumped).");

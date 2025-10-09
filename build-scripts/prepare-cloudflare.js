import fs from "fs-extra";
import path from "path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

console.log("🧹 Cleaning dist folder...");
fs.emptyDirSync(distDir);

console.log("📦 Copying files (including assets and wallpapers, <=25MB)...");

fs.readdirSync(rootDir).forEach((item) => {
	const srcPath = path.join(rootDir, item);
	const destPath = path.join(distDir, item);

	// Skip only unnecessary folders
	if (["node_modules", "dist", ".git", ".github", ".qodo"].includes(item)) {
		return;
	}

	// Copy everything else with filters
	fs.copySync(srcPath, destPath, {
		filter: (src) => {
			// Exclude unwanted folders
			if (
				src.includes("node_modules") ||
				src.includes("dist") ||
				src.includes(".git") ||
				src.includes(".github") ||
				src.includes(".qodo")
			) {
				return false;
			}

			// Exclude files larger than 25 MB
			if (fs.existsSync(src) && fs.statSync(src).isFile()) {
				const size = fs.statSync(src).size;
				if (size > MAX_FILE_SIZE) {
					console.log(
						`🚫 Skipped large file: ${src} (${(size / 1024 / 1024).toFixed(
							2
						)} MB)`
					);
					return false;
				}
			}

			return true;
		},
	});
});

console.log(
	"✅ Cloudflare build ready in /dist (assets + wallpapers <=25MB included)"
);

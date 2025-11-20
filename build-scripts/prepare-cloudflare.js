import fs from "fs-extra";
import path from "path";
const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const MAX_FILE_SIZE = 25 * 1024 * 1024;
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

console.log(
	"📦 Copying files (including assets and wallpapers, <=25MB, excluding certain files)..."
);

fs.readdirSync(rootDir).forEach((item) => {
	const srcPath = path.join(rootDir, item);
	const destPath = path.join(distDir, item);
	if (["node_modules", "dist", ".git", ".github", ".qodo"].includes(item)) {
		return;
	}

	fs.copySync(srcPath, destPath, {
		filter: (src) => {
			if (
				src.includes("node_modules") ||
				src.includes("dist") ||
				src.includes(".git") ||
				src.includes(".github") ||
				src.includes(".qodo") ||
				src.includes("build-scripts")
			) {
				return false;
			}
			const relativePath = path.relative(rootDir, src).replace(/\\/g, "/");
			if (EXCLUDE_FILES.includes(relativePath)) {
				console.log(`🚫 Skipped excluded file: ${relativePath}`);
				return false;
			}
			if (fs.existsSync(src) && fs.statSync(src).isFile()) {
				const size = fs.statSync(src).size;
				if (size > MAX_FILE_SIZE) {
					console.log(
						`🚫 Skipped large file: ${relativePath} (${(
							size /
							1024 /
							1024
						).toFixed(2)} MB)`
					);
					return false;
				}
			}

			return true;
		},
	});
});

console.log(
	"✅ Cloudflare build ready in /dist (assets + wallpapers <=25MB included, exclusions applied)"
);

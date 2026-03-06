// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.js"],
		ignores: ["node_modules", "**/*.json", "**/*.config.js"],
		rules: {
			semi: "error",
		},
	},
]);

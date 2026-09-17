import eslint from "@eslint/js";
import globals from "globals";
import lit from "eslint-plugin-lit";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "playwright-report/", "test-results/", "coverage/"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  lit.configs["flat/recommended"],
  {
    files: ["**/*.{ts,js,mjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);

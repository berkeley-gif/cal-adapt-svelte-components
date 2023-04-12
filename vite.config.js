import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],

  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    types: ["vitest/globals"]
  },

  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "./src/styles/themes/caladapt/variables.scss";`, // Import any additional SCSS files here
  //     }
  //   },
  // },

  assetsInclude: ["**/*.json"]
});

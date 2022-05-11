import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite: () => ({
      resolve: {
        alias: {
          "~": resolve(__dirname, "./src"),
          styles: resolve(__dirname, "./src/styles"),
          common: resolve(__dirname, "./src/common")
        }
      }
    })
  }
};

export default config;

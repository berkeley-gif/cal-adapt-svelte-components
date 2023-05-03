// add reusable type declarations here

// Add declarations for npm packages that dont have types. This will fix the following TS error:
// Error: Could not find a declaration file for module 'd3-tile'. '/cal-adapt-svelte-components/node_modules/d3-tile/dist/d3-tile.js' implicitly has an 'any' type.
// Try `npm i --save-dev @types/d3-tile` if it exists or add a new declaration (.d.ts) file containing `declare module 'd3-tile';`
// import { tile } from "d3-tile";
// import type { GeoProjection } from "d3-geo";
declare module "d3-tile";

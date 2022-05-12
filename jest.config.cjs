const { defaults } = require("jest-config");

module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": ["svelte-jester", { preprocess: true }],
    "^.+\\.ts$": "ts-jest",
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "svelte"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(carbon-components-svelte|carbon-icons-svelte))",
  ],
  bail: false,
  verbose: true,
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
    "^common/(.*)$": "<rootDir>/src/lib/common/$1",
    "^styles/(.*)$": "<rootDir>/src/styles/$1",
  },
  preset: "ts-jest/presets/js-with-babel-esm"
};


const { fixTsPaths } = require("./jest.helpers");
const tsconfig = require("./tsconfig.json");
tsconfig.compilerOptions.paths = fixTsPaths(tsconfig);
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": process.cwd(),
  "testRegex": "\\.spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  moduleNameMapper,
};

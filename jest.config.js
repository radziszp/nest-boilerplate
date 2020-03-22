const tsconfig = require("./tsconfig.json");
const paths = tsconfig.compilerOptions.paths;
for (const path in paths) {
  paths[path][0] = paths[path][0].replace('src/', '');
}
tsconfig.compilerOptions.paths = paths;
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  moduleNameMapper,
};

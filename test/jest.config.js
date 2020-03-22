const tsconfig = require("../tsconfig.json");
const paths = tsconfig.compilerOptions.paths;
for (const path in paths) {
  paths[path][0] = '../' + paths[path][0];
}
tsconfig.compilerOptions.paths = paths;
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

process.env.DATABASES_POSTGRES_DATABASE = 'todo_e2e';
module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  moduleNameMapper,
};

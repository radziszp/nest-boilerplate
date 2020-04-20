const { fixTsPaths } = require("./jest.helpers");
const tsconfig = require("./tsconfig.json");
tsconfig.compilerOptions.paths = fixTsPaths(tsconfig);
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig);

process.env.TODO_DATABASES_POSTGRES_DATABASE = 'todo_e2e';
process.env.CI = 'true';
module.exports = {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": process.cwd(),
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "coverageDirectory": "../coverage",
  "testEnvironment": "node",
  moduleNameMapper,
};

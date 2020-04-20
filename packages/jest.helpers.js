const fixTsPaths = (tsconfig) => {
  const paths = tsconfig.compilerOptions.paths;
  const newPaths = {};
  for (const path in paths) {
    newPaths[path] = [paths[path][0].replace('todo/', '')];
  }

  return newPaths;
}

module.exports = { fixTsPaths }

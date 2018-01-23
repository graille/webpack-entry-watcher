let parser = {};

parser.formatPath = (name) => {
  while (name[0] === "."
    || name[0] === "..\/"
    || name[0] === ".."
    || name[0] === "\/") {
    name = name.slice(1);
  }

  return name;
};

parser.removeExtensionFromFileName = (fileName) => {
  return fileName.replace(/\.[^/.]+$/, "");
};

parser.getFileNameFromPath = (fullPath) => {
  return fullPath.replace(/^.*[\\\/]/, '')
};

parser.removeEndSlash = (name) => {
  while (name[-1] === "\/")
    name = name.slice(0, -1);

  return name;
};

module.exports = parser;
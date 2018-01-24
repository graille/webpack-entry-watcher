const glob = require("glob");
const fs = require("fs");
const path = require("path");
const parser = require("./parser");

let watcherApp = {};

watcherApp.formatFile = (watcher, basePath, entries, removeExtensions) => {
  let fileIndex;
  if (typeof watcher.publicName !== 'undefined')
    fileIndex = watcher.publicName;
  else {
    fileIndex = path.relative(basePath, watcher.path);
    fileIndex = (removeExtensions) ? parser.removeExtensionFromFileName(fileIndex) : fileIndex;
    fileIndex = parser.formatPath(fileIndex);
  }

  entries[fileIndex] = watcher.path;
};

watcherApp.formatDir = (watcher, basePath, entries, removeExtensions) => {
  watcher.recursive = typeof watcher.recursive !== 'undefined' ? watcher.recursive : false;
  watcher.extensions = typeof watcher.extensions !== 'undefined' ? watcher.extensions : [".*"];
  let fileIndex;
  watcher.extensions.forEach(ext => {
      glob.sync(watcher.path + (watcher.recursive ? "\/**\/" : "\/") + "*" + ext).forEach(filePath => {
        if (typeof watcher.publicPrefix !== 'undefined')
          fileIndex = watcher.publicPrefix + filePath.slice(watcher.path.length + 1);
        else {
          fileIndex = path.relative(basePath, filePath);
          fileIndex = (removeExtensions) ? parser.removeExtensionFromFileName(fileIndex) : fileIndex;
          fileIndex = parser.formatPath(fileIndex);
        }

        entries[fileIndex] = filePath;
      })
    }
  )
};

watcherApp.generateEntries = (watcherFilePath, removeExtensions = false) => {
  let entries = {};
  let basePath;
  let watchersList = require(watcherFilePath);

  watchersList.forEach(watcher => {
      if (typeof watcher === 'string')
        watcher = {
          path: watcher
        };

      watcher.path = parser.removeEndSlash(watcher.path);
      basePath = watcherFilePath.slice(0, -(parser.getFileNameFromPath(watcherFilePath).length));

      if(path.isAbsolute(watcher.path)) {
        if (fs.lstatSync(watcher.path).isDirectory())
          watcherApp.formatDir(watcher, basePath, entries, removeExtensions);
        else if (fs.lstatSync(watcher.path).isFile())
          watcherApp.formatFile(watcher, basePath, entries, removeExtensions);
        else
          throw "Unknown file type";
      }
      else
        throw "Path must be absolute";
    }
  );

  return entries;
};

module.exports = watcherApp;
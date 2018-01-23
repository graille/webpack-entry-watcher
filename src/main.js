const glob = require("glob");
const fs = require("fs");
const path = require("path");
const parser = require("./parser");

let watcherApp = {};

watcherApp.formatFile = (watcher, basePath, entries) => {
  if (typeof watcher.publicName !== 'undefined')
    entries[watcher.publicName] = watcher.path;
  else
    entries[parser.formatPath(path.relative(basePath, watcher.path))] = watcher.path
};

watcherApp.formatDir = (watcher, basePath, entries) => {
  watcher.recursive = typeof watcher.recursive !== 'undefined' ? watcher.recursive : false;
  watcher.extensions = typeof watcher.extensions !== 'undefined' ? watcher.extensions : [".*"];

  watcher.extensions.forEach(ext => {
      glob.sync(watcher.path + (watcher.recursive ? "\/**\/" : "\/") + "*" + ext).forEach(filePath => {
        if (typeof watcher.publicPrefix !== 'undefined')
          entries[watcher.publicPrefix + filePath.slice(watcher.path.length + 1)] = filePath;
        else
          entries[parser.formatPath(path.relative(basePath, filePath))] = filePath;
      })
    }
  )
};

watcherApp.generateEntries = (watcherFilePath) => {
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
          watcherApp.formatDir(watcher, basePath, entries);
        else if (fs.lstatSync(watcher.path).isFile())
          watcherApp.formatFile(watcher, basePath, entries);
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
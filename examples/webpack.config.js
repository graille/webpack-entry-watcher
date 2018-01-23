const path = require('path');

const watcher = require('../src/main.js');

let entries = watcher.generateEntries(path.resolve(__dirname, './assets/.watcher.js'));
// Execute 'node webpack.config.js' to see the result
console.log(entries);

module.exports = {
  entry: entries,

  // Your webpack configuration
};
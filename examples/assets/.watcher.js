const path = require('path')

module.exports = [
  {
    path: path.resolve(__dirname, "./app.js"),
    publicName: "main"
  },
  {
    path: path.resolve(__dirname, "./dir/subdir/app.js")
  },
  {
    path: path.resolve(__dirname, "./dir"),
    publicPrefix: "dir_"
  }
];
# webpack-entry-watcher

## Installation

    npm i -D webpack-entry-watcher

### Integration with webpack

webpack.config.js :

```js
const watcher = require('webpack-entry-watcher');
let entries = watcher.generateEntries(path.resolve(__dirname, './assets/.watcher.js'));

module.exports = {
  entry: entries,
  
  // Your webpack config
};
```


## Usage

For these examples, we will work with this directory structure (see example folder in sources for more informations)

    ├── .watcher.js
    ├── app.js
    └── dir
        ├── jsFile1.js
        ├── jsFile2.js
        ├── subdir
        │   ├── app.js
        │   └── subsubdir
        │       └── app.js
        └── vueFile.vue

### Watch a file

Let's configure ```.watcher.js``` file with following configuration

```js
const path = require('path')

module.exports = [
  {
    path: path.resolve(__dirname, "./app.js"),
  },
]
```


The result :

```
{ 
    'app.js': '/home/webpack-entry-watcher/examples/assets/app.js' 
}
```


By default, the attribute name of the object will be the relative path of the file :

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./app.js"),
  },
  {
    path: path.resolve(__dirname, "./dir/jsFile1.js"),
  },
];
```
    
Will produce :

```
{ 
  'app.js': '/home/webpack-entry-watcher/examples/assets/app.js',
  'dir/jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js' 
}
```

    
You can configure this name with a ```publicName``` argument :

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./app.js"),
    publicName: "main.js"
  },
  {
    path: path.resolve(__dirname, "./dir/jsFile1.js"),
  },
  {
    path: path.resolve(__dirname, "./dir/jsFile2.js"),
    publicName: "newdir/jsFile2"
  },
];
```

Result :

```
{ 
  'main.js': '/home/webpack-entry-watcher/examples/assets/app.js',
  'dir/jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
  'newdir/jsFile2.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js' 
}
```


### Watch a directory

In addition of files, you can watch entire directories :

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./app.js"),
  },
  {
    path: path.resolve(__dirname, "./dir"),
  },
];
```

    
Result :

```
{ 
  'app.js': '/home/webpack-entry-watcher/examples/assets/app.js',
  'dir/jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
  'dir/jsFile2.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
  'dir/vueFile.vue': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
}
```


    
#### Add a public prefix
By default, the attributes name use the relative folder name in prefix, but you can change it with the `publicPrefix` attribute :

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./dir"),
    publicPrefix: "my/public/directory_"
  },
];
```


Result :

```
{ 
  'my/public/directory_jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
  'my/public/directory_jsFile2.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
  'my/public/directory_vueFile.vue': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
}
```


#### Watch recursively

By default, the directory watcher will not watch directories recursively

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./dir"),
    recursive: true
  },
];
```
    
Result :

```
{ 
  'dir/jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
  'dir/jsFile2.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
  'dir/subdir/app.js': '/home/webpack-entry-watcher/examples/assets/dir/subdir/app.js',
  'dir/subdir/subsubdir/app.js': '/home/webpack-entry-watcher/examples/assets/dir/subdir/subsubdir/app.js',
  'dir/vueFile.vue': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
}
```

#### Advanced configuration
##### Choose extensions to watch

Example : 

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./dir"),
    extensions: [".vue"]
  },
];
```

    
Will only return vue files in the `dir` folder :

```
{ 
  'vueFile.vue': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
}
```


### Use compact notation

If you only want to use default settings, you can use the compact notation for both files and directories :

```js
module.exports = [
  path.resolve(__dirname, "./app.js"), // A file
  path.resolve(__dirname, "./dir") // A directory
];
```


### Remove file extensions

You can remove file extension when you call the entry object generator in `webpack.config.js` :

```js
const watcher = require('webpack-entry-watcher');
let entries = watcher.generateEntries(path.resolve(__dirname, './assets/.watcher.js'), true);

module.exports = {
  entry: entries,
  
  // Your webpack config
};
```

Example with :

```js
module.exports = [
  {
    path: path.resolve(__dirname, "./dir"),
    recursive: true
  },
];
```

    
Result :

```
{ 
  'dir/jsFile1': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
  'dir/jsFile2': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
  'dir/subdir/app': '/home/webpack-entry-watcher/examples/assets/dir/subdir/app.js',
  'dir/subdir/subsubdir/app': '/home/webpack-entry-watcher/examples/assets/dir/subdir/subsubdir/app.js',
  'dir/vueFile': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
}
```


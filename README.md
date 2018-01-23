# webpack-entry-watcher

## Installation
### Integration with webpack

webpack.config.js :

    const watcher = require('webpack-entry-watcher');
    let entries = watcher.generateEntries(path.resolve(__dirname, './assets/.watcher.js'));
    
    module.exports = {
      entry: entries,
      
      // Your webpack config
    };

## Usage

For these examples, we sill work with this directory structure

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

    const path = require('path')
    
    module.exports = [
      {
        path: path.resolve(__dirname, "./app.js"),
      },
    ]

The result :

    { 
        app: '/home/webpack-entry-watcher/examples/assets/app.js' 
    }

By default, the attribute name of the object will be the relative path of the file, without the extension :

    module.exports = [
      {
        path: path.resolve(__dirname, "./app.js"),
      },
      {
        path: path.resolve(__dirname, "./dir/jsFile1.js"),
      },
    ];
    
Will produce :

    { 
      app: '/home/webpack-entry-watcher/examples/assets/app.js',
      'dir/jsFile1': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js' 
    }
    
You can configure this name with a ```publicName``` argument :

    module.exports = [
      {
        path: path.resolve(__dirname, "./app.js"),
        publicName: "main"
      },
      {
        path: path.resolve(__dirname, "./dir/jsFile1.js"),
      },
      {
        path: path.resolve(__dirname, "./dir/jsFile2.js"),
        publicName: "newdir/jsFile2"
      },
    ];
    
Result :

    { 
      main: '/home/webpack-entry-watcher/examples/assets/app.js',
      'dir/jsFile1': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
      'newdir/jsFile2': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js' 
    }


### Watch a directory

In addition of files, you can watch entire directories :

    module.exports = [
      {
        path: path.resolve(__dirname, "./app.js"),
        publicName: "main"
      },
      {
        path: path.resolve(__dirname, "./dir"),
      },
    ];
    
Result :

    { 
      main: '/home/webpack-entry-watcher/examples/assets/app.js',
      'dir/jsFile1': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
      'dir/jsFile2': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
      'dir/vueFile': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
    }

    
#### Add a public prefix
By default, the attributes name use the relative folder name in prefix, but you can change it with the `publicPrefix` attribute :

    module.exports = [
      {
        path: path.resolve(__dirname, "./dir"),
        publicPrefix: "my/public/directory_"
      },
    ];

Result :

    { 
      'my/public/directory_jsFile1.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
      'my/public/directory_jsFile2.js': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
      'my/public/directory_vueFile.vue': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
    }

#### Watch recursively

By default, the directory watcher will not watch directories recursively

    module.exports = [
      {
        path: path.resolve(__dirname, "./dir"),
        recursive: true
      },
    ];
    
Result :

    { 
      'dir/jsFile1': '/home/webpack-entry-watcher/examples/assets/dir/jsFile1.js',
      'dir/jsFile2': '/home/webpack-entry-watcher/examples/assets/dir/jsFile2.js',
      'dir/subdir/app': '/home/webpack-entry-watcher/examples/assets/dir/subdir/app.js',
      'dir/subdir/subsubdir/app': '/home/webpack-entry-watcher/examples/assets/dir/subdir/subsubdir/app.js',
      'dir/vueFile': '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
    }


#### Advanced configuration
##### Choose extensions to watch

Example : 

    module.exports = [
      {
        path: path.resolve(__dirname, "./dir"),
        extensions: [".vue"]
      },
    ];
    
Will only return vue files in the `dir` folder :

    { 
      vueFile: '/home/webpack-entry-watcher/examples/assets/dir/vueFile.vue' 
    }

### Use compact notation

If you only want to use default settings, you can use the compact notation for both files and directories :

    module.exports = [
      path.resolve(__dirname, "./app.js"), // A file
      path.resolve(__dirname, "./dir") // A directory
    ];
var chokidar = require('chokidar');
var borschik = require('./borschik-dep.js');
var fs = require('fs');

var watch = function(filepath, content) {
    var fileMap = {};
    var touch = function(path) {
        var atime = Date.now() / 1000;
        var mtime = Date.now() / 1000;

        if (path !== filepath) {
            fs.utimes(filepath, atime, mtime);
        }
    };

    borschik.parseDepsJs(filepath, content, fileMap);

    var watcher = chokidar.watch(Object.keys(fileMap), {
        ignored: /^\./,
        persistent: true
    });

    watcher
        .on('change', function(path) {
            console.log('File', path, 'has been changed');
            borschik.parseDepsJs(path, fs.readFileSync(path), fileMap);
            touch(path);
        })
        .on('unlink', function(path) {
            console.log('File', path, 'has been removed');
            if (fileMap[path]) {
                delete fileMap[path];
            }
            watcher.close();
            watcher.add(Object.keys(fileMap));
            touch(path);
        })
        .on('error', function(error) {
            console.error('Error happened in borschik watcher', error);
        });

    return watcher;
};

exports.watch = watch;

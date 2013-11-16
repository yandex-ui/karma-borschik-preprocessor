var fs = require('fs');
var File = require('borschik/lib/techs/js.js').Tech.prototype.File;

var parseDepsJs = function(filepath, content, fileMap) {
    var file = new File('js', filepath);

    var requires = file.parse(content).filter(function(dep) {
        return dep.file && fs.existsSync(dep.file);
    }).map(function(dep) {
        parseDepsJs(dep.file, fs.readFileSync(dep.file), fileMap);
        return dep.file;
    });

    fileMap[filepath] = {
        requires: requires
    };

    return fileMap;
};

exports.parseDepsJs = parseDepsJs;

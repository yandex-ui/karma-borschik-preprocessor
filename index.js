var borschik = require('borschik');
var borschikSourceMap = require('./lib/borschik-source-map');
var path = require('path');
var stream = require('./lib/stream');
var watcher = require('./lib/watcher');

var createPattern = function(path) {
    return {
        pattern: path,
        included: false,
        served: true,
        watched: false
    };
};

var createBorschikPreprocessor = function(args, config, logger, helper, basePath, fileList, files) {
    config = config || {};
    var log = logger.create('preprocessor.borschik');
    var defaultOptions = {
        'comments': true,
        'freeze': false,
        'minimize': false,
        'tech': 'js'
    };
    var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
    var watchers = {};
    var servedFiles = {};
    var depFiles = {};

    return function(content, file, done) {
        var output = new stream.Writable();
        var result = null;

        /**
         * HACK(maksimrv):
         * Does not process dependencies
         */
        if (depFiles[file.originalPath]) {
            return done(content);
        }

        log.debug('Processing "%s".', file.originalPath);

        var opts = helper._.clone(options);
        opts.input = file.originalPath;
        opts.output = output;

        // Builded file should not be served
        servedFiles[file.originalPath] = true;

        output.on('data', function(data) {
            var sourceMap = borschikSourceMap.generateSourceMap(path.relative(basePath, file.originalPath), data);
            var rootDir = path.dirname(file.originalPath);

            sourceMap.file = path.basename(file.path);
            file.sourceMap = sourceMap;

            /**
             * Resolve path for dependencies
             */
            sourceMap.sources = sourceMap.sources.map(function(sourceFilePath) {
                return path.resolve(rootDir, sourceFilePath);
            });

            /**
             * Serve files for source map
             */
            var needServeFiles = sourceMap.sources.filter(function(filePath) {
                return !servedFiles[filePath];
            });

            if (needServeFiles.length) {
                needServeFiles.forEach(function(filePath) {
                    files.unshift(createPattern(filePath));
                    fileList.addFile(filePath);
                    servedFiles[filePath] = true;
                    depFiles[filePath] = true;
                });

                fileList.refresh();
            }

            /**
             * Add source map to builded file
             */
            var datauri = 'data:application/json;charset=utf-8;base64,' + new Buffer(JSON.stringify(sourceMap)).toString('base64');
            data += '\n//@ sourceMappingURL=' + datauri + '\n';

            done(data);
        });

        result = borschik.api(opts).fail(function(Error) {
            throw Error;
        });

        //TODO(maksimrv): Improve realization
        if (!watchers[file.originalPath]) {
            log.debug('Watch file', file.originalPath);
            watchers[file.originalPath] = watcher.watch(file.originalPath, content);
        }
    };
};

createBorschikPreprocessor.$inject = ['args', 'config.borschikPreprocessor', 'logger', 'helper', 'config.basePath', 'fileList', 'config.files'];

// PUBLISH DI MODULE
module.exports = {
    'preprocessor:borschik': ['factory', createBorschikPreprocessor]
};

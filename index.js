var borschik = require('borschik');
var stream = require('./lib/stream');
var watcher = require('./lib/watcher');

var createBorschikPreprocessor = function(args, config, logger, helper) {
    config = config || {};
    var log = logger.create('preprocessor.borschik');
    var defaultOptions = {
        'comments': false,
        'freeze': false,
        'minimize': false,
        'tech': 'js'
    };
    var options = helper.merge(defaultOptions, args.options || {}, config.options || {});
    var watchers = {};

    return function(content, file, done) {
        var output = new stream.Writable();

        log.debug('Processing "%s".', file.originalPath);

        var opts = helper._.clone(options);
        opts.input = file.originalPath;
        opts.output = output;

        output.on('data', function(data) {
            done(data);
        });

        borschik.api(opts).done(null, function(Error) {
            throw Error;
        });

        //TODO(maksimrv): Improve realization
        if (!watchers[file.originalPath]) {
            log.debug('Watch file', file.originalPath);
            watchers[file.originalPath] = watcher.watch(file.originalPath, content);
        }
    };
};

createBorschikPreprocessor.$inject = ['args', 'config.borschikPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
    'preprocessor:borschik': ['factory', createBorschikPreprocessor]
};

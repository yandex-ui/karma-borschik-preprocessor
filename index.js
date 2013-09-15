var borschik = require('borschik');
var stream = require('./lib/stream');

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

    return function(content, file, done) {
        var output = new stream.Writable();
        var result = null;
        var onError = function(errorObject) {
            log.error('%s\n  at %s', errorObject.message, file.originalPath);
        };

        log.debug('Processing "%s".', file.originalPath);

        var opts = helper._.clone(options);
        opts.input = file.originalPath;
        opts.output = output;

        output.on('data', function(data) {
            done(data);
        });

        try {
            result = borschik.api(opts).fail(onError);
        } catch (e) {
            onError(e);
            return;
        }
    };
};

createBorschikPreprocessor.$inject = ['args', 'config.borschikPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
    'preprocessor:borschik': ['factory', createBorschikPreprocessor]
};

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            // closure base
            {
                pattern: 'base.js'
            },
            // included files - tests
            {
                pattern: 'test/*.js'
            },{
                pattern: '**/*.js',
                served: true,
                included: false,
                watched: false
            }
        ],

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            require('../index.js')
        ],
        logLevel: config.LOG_DEBUG,
        preprocessors: {
            '*.js': ['borschik']
        },
        browsers: ['PhantomJS'],
        autoWatch: true
    });
};

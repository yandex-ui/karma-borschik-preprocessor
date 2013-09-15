'use strict';

var fs = require('fs');
var path = require('path');
var fake = require('./fake.js');
var createBorschikPreprocessor = require('../index.js')['preprocessor:borschik'][1];

exports['Borchik preprocessor'] = {
    'it should process file with borschik include': function(test) {
        test.expect(1);

        var borschik = createBorschikPreprocessor({}, null, new fake.Logger(), new fake.Helper());
        var file = {
            originalPath: path.resolve(__dirname, 'fixtures/index.js')
        };
        var content = fs.readFileSync(file.originalPath, 'utf8');

        var done = function(data) {
            // XXX why we get \n\n in the end???
            test.equal(data, 'console.log("Car.js");\n\n', 'should process file with borschik include');
            test.done();
        };

        borschik(content, file, done);
    }
};

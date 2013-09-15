'use strict';

var StreamWritable = require('../lib/stream.js').Writable;

exports['StreamWritable'] = {
    'it should write data to stream': function(test) {
        test.expect(1);

        var writer = new StreamWritable();
        var data = null;

        writer.on('data', function(chunk) {
            data = chunk;
        });

        // write data to stream
        writer.write('Youp!');
        writer.end();

        test.equal(data, 'Youp!', 'should write data to stream');
        test.done();
    }
};

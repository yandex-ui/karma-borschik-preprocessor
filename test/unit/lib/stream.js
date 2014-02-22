var StreamWritable = require('../../../lib/stream.js').Writable;

describe('stream', function() {
    it('it should write data to stream', function(done) {
        var writer = new StreamWritable();
        var data = null;

        writer.on('data', function(chunk) {
            data = chunk;
        });

        writer.write('Youp!');
        writer.end();

        expect(data).to.be.equal('Youp!');
        done();
    });
});

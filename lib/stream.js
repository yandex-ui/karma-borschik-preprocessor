/*
 * Writable stream
 * http://nodejs.org/api/stream.html#stream_class_stream_writable_1
 */

(function() {
    'use strict';
    var stream = require('stream');

    /**
     * @desc StreamWritable is an abstract class designed to be extended with an
     * underlying implementation of the write(chunk, encoding, callback) method.
     *
     * @return {Object} The `stream.Writable` instance
     */
    var StreamWritable = function() {
        var writer = new stream.Stream();

        writer.write = this.write;
        writer.end = this.end;

        return writer;
    };

    /**
     * @param {Any} chunk The chunk of data passed to stream
     * Emmit event `data`
     */
    StreamWritable.prototype.write = function(chunk) {
        this.emit('data', chunk);
    };

    /**
     * @param {[Any]} chunk The chunk of data passed to stream
     * If chunk passed then emit event `data` and after
     * emit event `end` else immediately emit `end`
     */
    StreamWritable.prototype.end = function(chunk) {
        if (chunk) {
            this.write(chunk);
        }
        this.emit('end');
    };

    module.exports.Writable = StreamWritable;
    return StreamWritable;
}());

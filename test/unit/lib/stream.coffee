StreamWritable = require('../../../lib/stream.js').Writable

describe 'stream', ->
  it 'it should write data to stream', (done) ->
    writer = new StreamWritable()
    data = null

    writer.on 'data', (chunk) ->
      data = chunk

    writer.write('Youp!')
    writer.end()

    expect(data).to.be.equal 'Youp!'
    done()

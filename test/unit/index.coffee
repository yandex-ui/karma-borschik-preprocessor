fs = require "fs"
path = require "path"
fake = require "../fake.js"
createBorschikPreprocessor = require("../../index.js")['preprocessor:borschik'][1]

describe 'index', ->
  it 'it should process file with borschik include', (done) ->

    borschik = createBorschikPreprocessor({}, null, new fake.Logger(), new fake.Helper())
    file = {
      originalPath: path.resolve(__dirname, '../fixtures/index.js')
    }
    content = fs.readFileSync(file.originalPath, 'utf8')

    _done = (data) ->
      done try
        expect(data).to.be.equal 'console.log("Car.js");\n\n'
        null
      catch error
        error

    borschik(content, file, _done)

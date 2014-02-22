var fs = require("fs");
var path = require("path");
var fake = require("../fake.js");
var createBorschikPreprocessor = require("../../index.js")['preprocessor:borschik'][1]


describe('index', function() {
    it('it should process file with borschik include', function(done) {
        var borschik = createBorschikPreprocessor({}, null, new fake.Logger(), new fake.Helper());
        var file = {
            originalPath: path.resolve(__dirname, '../fixtures/index.js')
        };

        var content = fs.readFileSync(file.originalPath, 'utf8');

        var _done = function(data) {
            expect(data).to.be.equal('console.log("Car.js");\n\n');
            done();
        }

        borschik(content, file, _done);
    });
});

var fake = require('../fake.js');

describe('index', function() {
    var mocks = require('mocks');
    var mockery = require('mockery');
    var fsMock, watcherMock;

    beforeEach(function() {
        mockery.enable({
            warnOnUnregistered: false
        });

        fsMock = mocks.fs.create({
            folder: {
                'main.js': mocks.fs.file('2012-04-04', '/*borschik:include:depA.js*/'),
                'depA.js': mocks.fs.file('2012-05-05', 'console.log("Hello World!");')
            }
        });

        watcherMock = {
            watch: function() {}
        };

        mockery.registerMock('fs', fsMock);
        mockery.registerMock('./lib/watcher', watcherMock);

        this.createBorschikPreprocessor = require('../../index.js')['preprocessor:borschik'].pop();
    });

    afterEach(function() {
        mockery.disable();
    });

    it('it should process file with borschik include', function(done) {
        var borschik = this.createBorschikPreprocessor({}, null, new fake.Logger(), new fake.Helper(), '', [], {
            addFile: function() {}
        }, []);
        var file = {
            originalPath: '/folder/main.js'
        };

        borschik(fsMock.readFileSync('/folder/main.js'), file, function(data) {
            expect(data).to.be.contain('console.log("Hello World!");');
            done();
        });
    });
});

describe('borschik-dep', function() {
    var mocks = require('mocks');

    beforeEach(function() {
        this.fs = mocks.fs.create({
            some: {
                'a.js': mocks.fs.file('2012-04-04', '/*borschik:include:b.js*/\n/*borschik:include:c.js*/'),
                'b.js': mocks.fs.file('2012-04-04', 'console.log("b.js");'),
                'c.js': mocks.fs.file('2012-05-05', 'console.log("c.js");')
            },
            folder: {
                'a.js': mocks.fs.file('2012-04-04', '/*borschik:include:b.js*/'),
                'b.js': mocks.fs.file('2012-04-04', '/*borschik:include:c.js*/'),
                'c.js': mocks.fs.file('2012-05-05', 'console.log("c.js");')
            }
        });

        this.borschik = mocks.loadFile(__dirname + '/../../../lib/borschik-dep.js', {
            fs: this.fs,
            borschik: require('borschik')
        });
    });

    describe('borschik.parseDepsJs', function() {
        it('should parse a.js and produce fileMap', function() {
            var fs = this.fs;
            var fileMap = this.borschik.parseDepsJs('/some/a.js', fs.readFileSync('/some/a.js'), {});
            expect(fileMap).to.deep.equal({
                '/some/a.js': {
                    requires: ['/some/b.js', '/some/c.js']
                },
                '/some/b.js': {
                    requires: []
                },
                '/some/c.js': {
                    requires: []
                }
            });
        });

        it('should parse nested dependencies', function() {
            var fs = this.fs;
            var fileMap = this.borschik.parseDepsJs('/folder/a.js', fs.readFileSync('/folder/a.js'), {});

            expect(fileMap).to.deep.equal({
                '/folder/a.js': {
                    requires: ['/folder/b.js']
                },
                '/folder/b.js': {
                    requires: ['/folder/c.js']
                },
                '/folder/c.js': {
                    requires: []
                }
            });
        });
    });
});

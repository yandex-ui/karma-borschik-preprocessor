describe('borschik-source-map', function() {
    beforeEach(function() {
        this.borschikSourceMap = require('../../../lib/borschik-source-map.js');
    });

    describe('#getMapForIncludedFiles', function() {
        it('should throw error if content does not string', function() {
            var that = this;

            expect(function() {
                that.borschikSourceMap.getMapForIncludedFiles('main-builded.js', []);
            }).to.throws(/Error\(borschik source-map\): content should be string/);
        });

        it('should find position dependency file in builded file', function() {
            var content = [
                'console.log("start");',
                '/* foo/bar.js begin */',
                'console.log("Hello World");',
                '',
                '/* foo/bar.js end */',
                '',
                'console.log("end");',
            ].join('\n');

            var result = this.borschikSourceMap.getMapForIncludedFiles('main-builded.js', content);

            expect(result).to.be.eql([{
                fileName: 'main-builded.js',
                position: {
                    line: [
                        [1, 1],
                        [0, 0],
                        [5, 1],
                        [6, 2]
                    ]
                }
            }, {
                fileName: 'foo/bar.js',
                position: {
                    line: [
                        [ /*builded file*/ 2, /*source file*/ 0]
                    ]
                }
            }]);
        });

        it('should correct define position nested dependencies in builded file', function() {
            var content = [
                'console.log("start");',
                '/* foo/bar.js begin */',
                'console.log("bar:Hello World");',
                '/* foo/zoo.js begin */',
                'console.log("zoo:Hello World");',
                '',
                '/* foo/zoo.js end */',
                '',
                'console.log("bar:Hello World");',
                '',
                '/* foo/bar.js end */',
                '',
                'console.log("end");',
            ].join('\n');

            var result = this.borschikSourceMap.getMapForIncludedFiles('main-builded.js', content);

            expect(result).to.be.eql([{
                fileName: 'main-builded.js',
                position: {
                    line: [
                        [1, 1],
                        [0, 0],
                        [11, 1],
                        [12, 2]
                    ]
                }
            }, {
                fileName: 'foo/bar.js',
                position: {
                    line: [
                        [3, 1], // start include
                        [2, 0],
                        [7, 1], // end include
                        [8, 2]
                    ]
                }
            }, {
                fileName: 'foo/zoo.js',
                position: {
                    line: [
                        [4, 0]
                    ]
                }
            }]);
        });
    });

    describe('generateSourceMap', function() {
        it('should generate source map', function() {
            var content = [
                'console.log("start");',
                '/* foo/bar.js begin */',
                'console.log("Hello World");',
                '',
                '/* foo/bar.js end */',
                '',
                'console.log("end");'
            ].join('\n');

            var result = this.borschikSourceMap.generateSourceMap('main-builded.js', content);

            expect(result).to.be.eql({
                "version": 3,
                "file": "main-builded.js",
                "sources": ["main-builded.js", "foo/bar.js"],
                "names": [],
                "mappings": "AAAA;AACA;ACDA;;;ADCA;AACA"
            });
        });

        it('should generate source map for nested dependencies', function() {
            var content = [
                'console.log("start");',
                '/* foo/bar.js begin */',
                'console.log("bar:Hello World");',
                '/* foo/zoo.js begin */',
                'console.log("zoo:Hello World");',
                '',
                '/* foo/zoo.js end */',
                '',
                'console.log("bar:Hello World");',
                '',
                '/* foo/bar.js end */',
                '',
                'console.log("end");',
            ].join('\n');

            var result = this.borschikSourceMap.generateSourceMap('main-builded.js', content);

            expect(result).to.be.eql({
                "version": 3,
                "file": "main-builded.js",
                "sources": ["main-builded.js", "foo/bar.js", "foo/zoo.js"],
                "names": [],
                "mappings": "AAAA;AACA;ACDA;AACA;ACDA;;;ADCA;AACA;;;ADDA;AACA"
            });
        });
    });
});

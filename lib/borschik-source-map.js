/**
 * @desc Create source-map for borschik
 * based on special comments
 */
var getMapForIncludedFiles = exports.getMapForIncludedFiles = function(rootFileName, content) {
    var specialCommentRegExp = /\/\*\s*(\S+)\s*(begin|end)\s*\*\//;
    var currentFile = {
        fileName: rootFileName,
        position: {
            line: []
        }
    };

    /**
     * Include builed file in source map
     */
    var includedFiles = [currentFile];

    var processSpecialComment = function(fileName, commentType) {
        if (commentType === 'begin') {
            /**
             * add current file
             */
            currentFile = {
                fileName: fileName,
                position: {
                    line: []
                }
            };
            includedFiles.push(currentFile);
        }

        if (commentType === 'end') {
            // Remove empty new line inserted with specail comment
            currentFile.position.line.pop();
            currentFile = includedFiles[includedFiles.indexOf(currentFile) - 1];

            if (currentFile) {
                /**
                 * HACK:
                 * swap positoin start include and line before
                 * it allow map end postion on include comment
                 * and remove problem with trailing new line
                 */
                currentFile.position.line.push(currentFile.position.line.splice(currentFile.position.line.length - 2, 1)[0]);
            }
        }
    };

    var addPositionToCurrentFile = function(currentFile, buildedFileLine) {
        if (!currentFile) {
            return;
        }

        var lastPositionLine = currentFile.position.line[currentFile.position.line.length - 1];
        var currentPositionInFile;

        if (!lastPositionLine) {
            currentPositionInFile = [buildedFileLine, 0];
        } else {
            currentPositionInFile = [buildedFileLine, lastPositionLine[1] + 1];
        }

        currentFile.position.line.push(currentPositionInFile);
    };

    if (Object.prototype.toString.call(content) !== '[object String]') {
        throw new Error('Error(borschik source-map): content should be string');
    }

    content.split('\n').forEach(function(line, lineNumber) {
        var specialCommentMatch = line.match(specialCommentRegExp);
        var commentType;

        if (specialCommentMatch) {
            commentType = specialCommentMatch[2];

            if (commentType === 'begin') {
                /**
                 * borschik include comment
                 * should be in source-map
                 */
                addPositionToCurrentFile(currentFile, lineNumber);
            }

            return processSpecialComment(specialCommentMatch[1], specialCommentMatch[2]);
        }

        addPositionToCurrentFile(currentFile, lineNumber);
    });

    return includedFiles;
};

function addMappings(generator, fileMap) {
    fileMap.position.line.forEach(function(lines) {
        generator.addMapping({
            source: fileMap.fileName,
            original: {
                line: lines[1] + 1,
                column: 0
            },
            generated: {
                line: lines[0] + 1,
                column: 0
            }
        });
    });
}

exports.generateSourceMap = function(fileName, content, sourceRoot) {
    var sourceMap = require('source-map');
    var SourceMapGenerator = sourceMap.SourceMapGenerator;

    var mapForIncludedFiles = getMapForIncludedFiles(fileName, content);
    var generator = new SourceMapGenerator({
        file: fileName,
        sourceRoot: sourceRoot || ''
    });

    mapForIncludedFiles.forEach(function(fileMap) {
        addMappings(generator, fileMap);
    });

    return JSON.parse(generator.toString());
};

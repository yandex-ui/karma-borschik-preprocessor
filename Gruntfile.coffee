module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  # Project configuration.
  grunt.initConfig
    nodeunit:
      files: ['test/**/*_test.js']

    jshint:
      options:
        jshintrc: '.jshintrc'
      all:
        src: ['*.js', 'lib/*.js', '<%= nodeunit.files %>']

    pkgFile: 'package.json'

    'npm-contributors':
      options:
        commitMessage: 'chore: update contributors'

    bump:
      options:
        commitMessage: 'chore: release v%VERSION%'

    'auto-release':
      options:
        checkTravisBuild: true

    watch:
      all:
        files: '<%= jshint.all.src %>',
        tasks: ['jshint', 'nodeunit']

  grunt.registerTask 'release', 'Bump the version and publish to NPM.', (type) ->
    grunt.task.run [
      'npm-contributors',
      "bump:#{type||'patch'}",
      'npm-publish'
    ]

  grunt.registerTask 'test', ['nodeunit']
  grunt.registerTask 'default', ['jshint', 'nodeunit']

module.exports = (grunt) ->

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  # Project configuration.
  grunt.initConfig
    simplemocha:
      options:
        ui: 'bdd',
        reporter: 'dot'
      unit:
        src: [
          'test/unit/mocha-globals.coffee',
          'test/unit/**/*.coffee'
        ]

    jshint:
      options:
        jshintrc: '.jshintrc'
      all:
        src: ['*.js', 'lib/*.js']

    pkgFile: 'package.json'

    'npm-contributors':
      options:
        commitMessage: 'chore: update contributors'

    bump:
      options:
        commitMessage: 'chore: release v%VERSION%'
        pushTo: 'origin'

    'auto-release':
      options:
        checkTravisBuild: true

    watch:
      all:
        files: ['<%= jshint.all.src %>', '<%= simplemocha.unit.src %>']
        tasks: ['jshint', 'simplemocha:unit']

  grunt.registerTask 'release', 'Bump the version and publish to NPM.', (type) ->
    grunt.task.run [
      'npm-contributors',
      "bump:#{type||'patch'}",
      'npm-publish'
    ]

  grunt.registerTask 'test', ['simplemocha:unit']
  grunt.registerTask 'default', ['jshint', 'simplemocha:unit']

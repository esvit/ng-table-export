path = require 'path'

# Build configurations.
module.exports = (grunt) ->
    grunt.initConfig
        cmpnt: grunt.file.readJSON('bower.json'),
        banner: '/*! ngTableExport v<%= cmpnt.version %> by Vitalii Savchuk(esvit666@gmail.com) - ' +
                    'https://github.com/esvit/ng-table-export - New BSD License */\n',
            
        # Deletes built file and temp directories.
        clean:
            working:
                src: [
                    'ng-table.*'
                    './.temp/views'
                    './.temp/'
                ]

        uglify:
            # concat js files before minification
            js:
                src: ['ng-table-export.src.js']
                dest: 'ng-table-export.js'
                options:
                  banner: '<%= banner %>'
                  sourceMap: (fileName) ->
                    fileName.replace /\.js$/, '.map'
        concat:
            # concat js files before minification
            js:
                src: [
                    'src/scripts/*.js'
                ]
                dest: 'ng-table-export.src.js'

    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'

    grunt.registerTask 'dev', [
        'clean'
        'concat'
    ]
    grunt.registerTask 'default', [
        'dev'
        'uglify'
    ]

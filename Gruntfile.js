module.exports = function (grunt) {

    var files = grunt.file.readJSON('nittro.json').files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                mangle: false,
                sourceMap: false
            },
            nittro: {
                files: {
                    'dist/js/nittro-extras-flashes.min.js': files.js
                }
            }
        },

        concat: {
            options: {
                separator: ";\n"
            },
            nittro: {
                files: {
                    'dist/js/nittro-extras-flashes.js': files.js
                }
            }
        },

        less: {
            min: {
                options: {
                    compress: true
                },
                files: {
                    'dist/css/nittro-extras-flashes.min.css': files.css
                }
            },
            full: {
                options: {
                    compress: false
                },
                files: {
                    'dist/css/nittro-extras-flashes.css': files.css
                }
            }
        },

        jasmine: {
            src: files,
            options: {
                vendor: [
                    'bower_components/promiz/promiz.min.js',
                    'bower_components/nittro-core/dist/js/nittro-core.js',
                    'bower_components/nittro-datetime/dist/js/nittro-datetime.js',
                    'bower_components/nittro-neon/dist/js/nittro-neon.js',
                    'bower_components/nittro-di/dist/js/nittro-di.js'
                ],
                specs: 'tests/specs/**.spec.js',
                display: 'short',
                summary: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['uglify', 'concat', 'less']);
    grunt.registerTask('test', ['jasmine']);

};

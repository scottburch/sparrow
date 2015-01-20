module.exports = function(grunt) {

    var sparrowFiles = (function() {
        var vendorCommon = ['node_modules/jquery/dist/jquery.min.js', 'env.js', 'node_modules/lodash/dist/lodash.min.js', 'vendor/functional.min.js', 'vendor/async.js'];
        return {
            vendor: {
                headless: vendorCommon.concat(['headless.js', 'runner.js', 'globals.js','vendor/html2canvas.js']),
                headed: vendorCommon.concat(['globals.js'])
            }
        }
    }());

    grunt.initConfig({
//        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            headless: {
                options: {
                    outfile: 'specRunner.html',
                    specs: 'specs/**/*Spec.js',
                    helpers: ['helpers/*Helper.js'],
                    vendor: sparrowFiles.vendor.headless.concat(['vendor/moment.js']),
//                    host: 'https://mysite.com',
                    '--ignore-ssl-errors': true,
                    '--web-security': false,
                    timeout: 120000,
                    junit: {
                        path: './test-reports'
                    }
                }
            },
            headed: {
                options: {
                    outfile: 'specRunner.html',
                    specs: 'specs/**/*Spec.js',
                    helpers: ['helpers/*Helper.js'],
                    vendor: sparrowFiles.vendor.headed.concat(['vendor/moment.js'])
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['jasmine:headless']);
};

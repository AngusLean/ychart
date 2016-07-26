module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        meta: {
            banner: "/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> */\n"
        },
        unwrap: {
            options: {
                base: "./src",
                globalBase: "./src/global_modules",
                name: "dialog",
                namespace: "window",
                banner: "<%= meta.banner %>"
            },
            "DamJs.js": {
                src: "./src/DamJs.js",
                dest: "./dist/DamJs.js"
            }
        },
        uglify: {
            options: {
                banner: "<%= meta.banner %>"
            },
            "DamJs.js": {
                src: "./dist/DamJs.js",
                dest: "./dist/DamJs-min.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-unwrap");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["unwrap", "uglify"]);
};

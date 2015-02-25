module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: ['js/libs/socket.io.js', 'js/libs/quill.min.js', 'js/libs/moment.min.js', 'js/libs/ba-emotify.min.js', 'js/libs/jquery-1.11.1.js', 'js/libs/jquery-ui-1.10.4.js', 'js/libs/handlebars-v1.3.0.js', 'js/libs/ember.min.js', 'js/app.js', 'js/all_mixins.js', 'js/all_controllers.js', 'js/all_routes.js', 'js/views_components_helpers.js', 'js/router.js', 'js/jquery_code.js', 'js/libs/si.files.js'],
				dest: 'js/global.min.js'
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['*.css', '!*.min.css'],
				dest: 'css/',
				ext: '.min.css'
			},
			combine: {
				files: {
					'css/global.min.css': ['css/*.css']
				 }
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Default task(s).
	grunt.registerTask('default', ['uglify', 'cssmin']);

};

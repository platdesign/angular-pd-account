var
		gulp 	= require('gulp')
	,	pdTasks = require('gulp-pd-tasks')
;

gulp.task('dev', pdTasks.jsDev({
	src: './src',
	dest: './dist'
}));

gulp.task('build', pdTasks.jsBuild({
	suffix:'.min',
	src: './src',
	dest: './dist'
}));

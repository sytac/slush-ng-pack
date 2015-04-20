var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  inquirer = require('inquirer'),
  _ = require('lodash');

gulp.task('default', function(done) {
  inquirer.prompt([{
      type: 'input',
      name: 'moduleName',
      message: 'What is the name of your component? ',
      default: 'ng-super-component'
    }, {
      type: 'input',
      name: 'moduleDesc',
      message: 'A description for your module: ',
      default: 'My very own, super component!'
    }, {
      type: 'input',
      name: 'moduleAuthor',
      message: 'Your name: ',
      default: 'Jane Doe'
    }, {
      type: 'input',
      name: 'moduleLicense',
      message: 'License type: ',
      default: 'MIT'
    }, {
      type: 'confirm',
      name: 'moduleTravis',
      message: 'Do you want .travis.yml to be included? ',
      default: true
    }],
    function(answers) {
      var name = _.deburr(answers.moduleName),
        files = [__dirname + '/templates/**'];

      answers.moduleName = _.kebabCase(name);
      answers.moduleNameCamelCase = _.camelCase(name);
      answers.moduleDesc = _.deburr(answers.moduleDesc);
      answers.moduleAuthor = _.deburr(answers.moduleAuthor);
      answers.moduleLicense = _.deburr(answers.moduleLicense);

      if (!answers.moduleTravis) {
        files.push('!' + __dirname + '/templates/*.yml')
      }

      return gulp.src(files)
        .pipe(gulpif(function(file) {
          // exclude gulpfile from templating:
          return file.history[0].indexOf('gulpfile.js') < 0;
        }, template(answers)))
        .pipe(rename(function(file) {
          if (file.basename && file.basename[0] === '_') {
            var replacement = '';

            if (!file.extname) {
              replacement = '.';
            }

            file.basename = file.basename.replace('_', replacement)
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('finish', function() {
          done();
        });
    });
});

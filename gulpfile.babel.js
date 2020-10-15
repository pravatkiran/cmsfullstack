const _ = require('lodash');
const del = require('del');
const gulp = require('gulp');
const grunt = require('grunt');
const path = require('path');
const through2 = require('through2');
const gulpLoadPlugins = require('gulp-load-plugins');
const http = require('http');
const opn = require('opn');
const lazypipe = require('lazypipe');
const nodemon = require('nodemon');
const runSequence = require('run-sequence');
const Instrumenter = require('isparta');
const webpack = require('webpack');
const makeWebpackConfig = require('./webpack.make');
var plugins = gulpLoadPlugins();


const clientPath = 'client';
const serverPath = 'server';
const paths = {
    client: {
        assets: `${clientPath}/assets/**/*`,
        images: `${clientPath}/assets/images/**/*`,
        revManifest: `${clientPath}/assets/rev-manifest.json`,
        scripts: [
            `${clientPath}/**/!(*.spec|*.mock).ts`
        ],
        styles: [
            `${clientPath}/{app,components}/**/*.css`
        ],
        mainStyle: `${clientPath}/style.css`,
        views: `${clientPath}/{app,components}/**/*.html`,
        mainView: `${clientPath}/index.html`,
        test: `${clientPath}/{app,components}/**/*.{spec,mock}.ts`,
        e2e: ['e2e/**/*.spec.js']
    },
    server: {
        scripts: [
            `${serverPath}/**/!(*.spec).js`
        ],
        json: [`${serverPath}/**/*.json`]
    },
    karma: 'karma.config.js',
    dist: 'dist'
};

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white(']') +
        log.message);
}

// let lintClientScripts = lazypipe()
//     .pipe(plugins.tslint, { formatter: 'verbose' })
//     .pipe(plugins.tslint.report, { emitError: false });

// let lintClientTestScripts = lazypipe()
//     .pipe(plugins.tslint, { formatter: 'verbose' })
//     .pipe(plugins.tslint.report, { emitError: false });

// let lintServerScripts = lazypipe()
//     .pipe(plugins.eslint, {
//         configFile: `${serverPath}/.eslintrc`,
//         envs: [
//             'node',
//             'es6',
//             'mocha'
//         ]
//     })
//     .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');
// env

// gulp.task('env:all', () =>{
//     let localconfig;
//     try{
//         localconfig = require(`./${serverPath}/config/local.env`);
//     }catch(e){
//         localconfig = {};
//     }
//     plugins.env({
//         vars:localconfig
//     });
// });

gulp.task('env:prod', () => {
    plugins.env({
        vars: { NODE_ENV: 'production' }
    });
});

// tasks
gulp.task('inject', cb => {
    runSequence(['inject:css'], cb);
});


gulp.task('inject:css', () => {
    return gulp.src(paths.client.mainStyle)
        .pipe(plugins, inject(
            gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), { read: false })
                .pipe(plugins.sort()),
            {
                starttag: '/* inject:css */',
                endtag: '/* endinject */',
                transform: (filepath) => {
                    let newPath = filepath
                        .replace(`/${clientPaht}/app`, '')
                        .replace(`/${clientPath}/components/`, '../components')
                        .replace(/_(.*).css/, (match, p1, offset, string) => p1);
                    return `@import '${newPath}';`;
                }
            }
        ))
        .pipe(gulp.dest(`${clientPath}/app`));
});

function webpackCompile(options, cb) {
    let compiler = webpack(makeWebpackConfig(options));
    compiler.run((err, stats) => {
        if (err) return cb(err);

        plugins.util.log(stats.toString({
            colors: true,
            timings: true,
            chunks: options.BUILD
        }));
        cb();
    });
}

gulp.task('webpack:dev', cb => webpackCompile({ DEV: true }, cb));
gulp.task('webpack:dist', cb => webpackCompile({ BUILD: true }, cb));
gulp.task('webpack:test', cb => webpackCompile({ TEST: true }, cb));

gulp.task('styles', () => {
    return gulp.src(paths.client.styles)
        .pipe(styles())
        .pipe(gulp.dest('.tmp/app'));
});

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb));

// gulp.task('lint:scripts:client', () => {
//     return gulp.src(_.union(
//         paths.client.scripts,
//         _.map(paths.client.test, blob => `!${blob}`)
//     ))
//         .pipe(lintClientScripts());
// });

// gulp.task('lint:scripts:server', () => {
//     return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
//         .pipe(lintServerScripts());
// });

gulp.task('jscs', () => {
    return gulp.src(_.union(paths.client.scripts, paths.server.scripts))
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));

glup.task('start:client', cb => {
    return require('./webpack.server').start(config.clientPort).then(() => {
        onpagehide(`http://localhost:${confg.clientPort}`);
        cb();
    });
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog());
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-2 ${paths.dist}/${serverPaht} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog());
});

gulp.task('serve', cb => {
    runSequence(
        [
            'cliean: tmp',
            'lint: scripts',
            'inject',
            'copy:fonts:dev',
            'env:all'
        ],
        //'webpack:dev'
        ['start:server', 'start:client'],
        'watch',
        cb
    );
});

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod', 'start:client'],
        cb
    );
});

gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
        // covering files
        .pipe(plugins.istanbul({
            instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
            includeUntested: true
        }))
        // Force `require` to return covered files
        .pipe(plugins.istanbul.hookRequire());
})

/******************************
 * Build
 *****************************/

gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'inject',
        'transpile:server',
        [
            'build:images'
        ],
        [
            'copy:extras',
            'copy:assets',
            'copy:fonts:dist',
            'copy:server',
            'ng build'
        ],
        'revReplaceWebpack',
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));

gulp.task('build:images', () => {
    return gulp.src(paths.client.images)
        .pipe(plugins.imagemin([
            plugins.imagemin.optipng({ optimizationLevel: 5 }),
            plugins.imagemin.jpegtran({ progressive: true }),
            plugins.imagemin.gifsicle({ interlaced: true }),
            plugins.imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ]))
        .pipe(plugins.rev())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
        .pipe(plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
            base: `${paths.dist}/${clientPath}/assets`,
            merge: true
        }))
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('revReplaceWebpack', function () {
    return gulp.src('dist/client/app.*.js')
        .pipe(plugins.revReplace({ manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`) }))
        .pipe(gulp.dest('dist/client'));
});

gulp.task('copy:extras', () => {
    return gulp.src([
        `${clientPath}/favicon.ico`,
        `${clientPath}/icon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/.htaccess`
    ], { dot: true })
        .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */

function flatten() {
    return through2.obj(function (file, enc, next) {
        if (!file.isDirectory()) {
            try {
                let dir = path.dirname(file.relative).split(path.sep)[0];
                let fileName = path.normalize(path.basename(file.path));
                file.path = path.join(file.base, path.join(dir, fileName));
                this.push(file);
            } catch (e) {
                this.emit('error', new Error(e));
            }
        }
        next();
    });
}
gulp.task('copy:fonts:dev', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${clientPath}/assets/fonts`));
});
gulp.task('copy:fonts:dist', () => {
    return gulp.src('node_modules/{bootstrap,font-awesome}/fonts/*')
        .pipe(flatten())
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
});

gulp.task('copy:assets', () => {
    return gulp.src([paths.client.assets, '!' + paths.client.images])
        .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task('copy:server', () => {
    return gulp.src([
        'package.json'
    ], { cwdbase: true })
        .pipe(gulp.dest(paths.dist));
});

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
    buildcontrol: {
        options: {
            dir: paths.dist,
            commit: true,
            push: true,
            connectCommits: false,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        },
        heroku: {
            options: {
                remote: 'heroku',
                branch: 'master'
            }
        },
        openshift: {
            options: {
                remote: 'openshift',
                branch: 'master'
            }
        }
    }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', function (done) {
    grunt.tasks(
        ['buildcontrol:heroku'],    //you can add more grunt tasks in this array
        { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
        function () { done(); }
    );
});
gulp.task('buildcontrol:openshift', function (done) {
    grunt.tasks(
        ['buildcontrol:openshift'],    //you can add more grunt tasks in this array
        { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
        function () { done(); }
    );
});
exports.default = defaultTask
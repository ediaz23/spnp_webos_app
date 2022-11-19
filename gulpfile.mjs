
import fs from 'fs'
import gulp from 'gulp'
import { deleteAsync } from 'del'
import { exec } from 'child_process'


gulp.task('clean', () =>
    deleteAsync('bin/**', { force: true })
        .then(deleteAsync('dist/**', { force: true }))
)

gulp.task('pack', cb =>
    exec('npm run pack', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
)

gulp.task('pack-p', cb =>
    exec('npm run pack-p', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
)

gulp.task('donwloadService', cb => {
    if (!fs.existsSync('../spnp_webos_service')) {
        exec('git clone https://github.com/ediaz23/spnp_webos_service.git ../spnp_webos_service', (err, stdout, stderr) => {
            console.log(stdout)
            console.log(stderr)
            cb(err)
        })
    } else {
        cb()
    }
})

gulp.task('installService', cb => {
    exec('npm install --prefix=../spnp_webos_service', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('buildService', cb => {
    exec('npm run build --prefix=../spnp_webos_service', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('buildService-p', cb => {
    exec('npm run build-p --prefix=../spnp_webos_service', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})

gulp.task('app', cb => {
    exec('ares-package dist/ ../spnp_webos_service/dist -o bin/', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})


gulp.task('build', gulp.series('clean', 'pack', 'app'));
gulp.task('build-dev', gulp.series('clean', 'pack', 'donwloadService', 'installService', 'buildService', 'app'));
gulp.task('build-p', gulp.series('clean', 'pack-p', 'donwloadService', 'installService', 'buildService-p', 'app'));

export default gulp
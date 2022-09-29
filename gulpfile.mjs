
import gulp from 'gulp'
import { deleteAsync } from 'del'
import { exec } from 'child_process'


gulp.task('clean', () =>
     deleteAsync('bin/**', {force: true})
)

gulp.task('pack', cb => 
    exec('npm run pack', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
)

gulp.task('pack-p', cp => 
    exec('npm run pack-p', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
)

gulp.task('service', cb => {
    exec('ares-package dist/ services/spnp_webos_service -o bin/', (err, stdout, stderr) => {
        console.log(stdout)
        console.log(stderr)
        cb(err)
    })
})


gulp.task('build', gulp.series('clean', 'pack', 'service'));
gulp.task('build-p', gulp.series('clean', 'pack-p', 'service'));

export default gulp

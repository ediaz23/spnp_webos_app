
import PhotoPlayer from './PhotoPlayer/PhotoPlayer'
//import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
//import css from './Player.module.less'

/**
        <VideoPlayer {...rest} className={className + css.player + ' enact-fit'}>
            <source src={file.res.url} type={file.mimeType} />
            <infoComponents>
                {file.title}
            </infoComponents>
        </VideoPlayer>
 */
/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {Object} obj.rest
 */
const Player = ({ className, ...rest }) => {
    /** @type {Number} */
    const fileIndex = useRecoilValue(fileIndexState)
    /** @type {Array<import('../models/File').default} */
    const files = useRecoilValue(filesState)
    /** @type {import('../models/Playable').default} */
    const file = files[fileIndex]

    let out
    console.log(`className ${className}`)
    if (file.type === 'image') {
        /** @type {import('../models/Image').default} */
        const image = file
        const [width, height] = image.res.resolution.split('x')
        const img = {
            width: parseInt(width),
            uri: image.res.url,
            title: image.title,
            file_size: image.res.size,
            height: parseInt(height),
            file_path: image.res.url
        }
        const imageList = [img, img, img, img]
        out = (
            <PhotoPlayer slides={imageList} startSlideIndex={0} {...rest} />
        )
    } else if (file.type === 'music') {
        /** @type {import('../models/Music').default} */
        //        const music = file
    }

    return out
}

Player.propTypes = {
    className: PropTypes.string,
}

export default Player

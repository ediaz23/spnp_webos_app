
import PhotoPlayer from './PhotoPlayer/PhotoPlayer'
//import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue } from 'recoil'
import { fileState } from '../recoilConfig'
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
    /** @type {import('../models/Playable').default} */
    const file = useRecoilValue(fileState)
    let out
    console.log(`className ${className}`)
    if (file.type === 'image') {
        const [width, height] = file.res.resolution.split('x')
        const img = {
            width: parseInt(width),
            uri: file.res.url,
            title: file.title,
            file_size: file.res.size,
            height: parseInt(height),
            file_path: file.res.url
        }
        const imageList = [img,img,img,img]
        out = (
            <PhotoPlayer slides={imageList} startSlideIndex={0} {...rest} />
        )
    }

    return out
}

Player.propTypes = {
    className: PropTypes.string,
}

export default Player

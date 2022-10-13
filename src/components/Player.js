
import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue } from 'recoil'
import { fileState } from '../recoilConfig'
import css from './Player.module.less'


/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {Object} obj.rest
 */
const Player = ({ className, ...rest }) => {
    /** @type {import('../models/Playable').default} */
    const file = useRecoilValue(fileState)
    return (
        <VideoPlayer {...rest} className={className + css.player + ' enact-fit'} >
            <source src={file.res.url} type={file.mimeType} />
            <infoComponents>
                {file.title}
            </infoComponents>
        </VideoPlayer>
    )
}

Player.propTypes = {
    className: PropTypes.string,
}

export default Player

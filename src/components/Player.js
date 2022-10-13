
import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'


import css from './Player.module.less';

/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {import('../models/Playable').default} obj.file
 * @param {Object} obj.rest
 */
const Player = ({ className, file, ...rest }) => {
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
    file: PropTypes.object,
}

export default Player


import { useCallback } from 'react'
import PhotoPlayer from './PhotoPlayer/PhotoPlayer'
import AudioPlayer from './AudioPlayer/AudioPlayer'
//import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
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
const Player = ({ backHome, className, ...rest }) => {
    /** @type {[Number, Function]} */
    const [fileIndex, setFileIndex] = useRecoilState(fileIndexState)
    /** @type {Array<import('../models/File').default} */
    const files = useRecoilValue(filesState)
    /** @type {import('../models/Playable').default} */
    const file = files[fileIndex]
    const nextFile = useCallback(() => {
        if (fileIndex + 1 < files.length) {
            setFileIndex(fileIndex + 1)
        } else {
            backHome()
        }
    }, [setFileIndex, fileIndex, backHome, files.length])

    const prevFile = useCallback(() => {
        if (fileIndex - 1 >= 0) {
            const newFile = files[fileIndex - 1]
            if (newFile.type === 'folder') {
                backHome()
            } else {
                setFileIndex(fileIndex - 1)
            }
        } else {
            backHome()
        }
    }, [setFileIndex, fileIndex, backHome, files])


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
        out = (<PhotoPlayer slides={imageList} startSlideIndex={0} {...rest} />)
    } else if (file.type === 'music') {
        out = (<AudioPlayer handleNext={nextFile} handlePrevious={prevFile} song={file} {...rest} />)
    } else {
        backHome()
        out = (<></>)
    }
    console.log('<Player>')
    return out
}

Player.propTypes = {
    className: PropTypes.string,
    backHome: PropTypes.func,
}

export default Player

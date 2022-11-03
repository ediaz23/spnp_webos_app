
 import { useCallback } from 'react'
import VideoPlayer from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'


/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {Object} obj.rest
 */
const Player = ({ backHome, ...rest }) => {
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
    let title = file.title, mimeType = file.mimeType, source = file.res.url, imageUrl = file.imageUrl

    if (file.type === 'music') {
        /** @type {import('../models/Music').default} */
        const music = file
        const tmp = []
        if (music.title) {
            tmp.push(music.title)
        }
        if (music.artist) {
            tmp.push(music.artist)
        }
        if (music.album) {
            tmp.push(music.album)
        }
        title = tmp.join(' - ')
    } else if (file.type === 'image') {
        mimeType = 'audio/ogg'
        source = silent
        imageUrl = file.res.url
    }
    return (
        <div className={rest.className}>
            <VideoPlayer title={title} poster={imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile} >
                <source src={source} type={mimeType} />
            </VideoPlayer>
        </div>
    )
}

Player.propTypes = {
    backHome: PropTypes.func,
}

export default Player

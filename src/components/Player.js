
import { useCallback, useEffect, useState, useRef } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import VideoPlayer, { MediaControls } from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'
import AudioList from './AudioList'


const IconButtonWithPopup = ContextualPopupDecorator(IconButton)


/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {String} obj.locale
 * @param {Object} obj.rest
 */
const Player = ({ backHome, ...rest }) => {
    /** @type {[Number, Function]} */
    const [fileIndex, setFileIndex] = useRecoilState(fileIndexState)
    /** @type {Array<import('../models/File').default} */
    const files = useRecoilValue(filesState)
    /** @type {import('../models/Playable').default} */
    const file = files[fileIndex]
    /** @type {[Boolean, Function]} */
    const [showAudioList, setShowAudioList] = useState(false)
    /** @type {[Boolean, Function]} */
    const [showAudioBtn, setShowAudioBtn] = useState(false)
    /** @type {[Boolean, Function]} */
    const [showSubtitleBtn, setShowSubtitleBtn] = useState(false)

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
    let title = file.title, mimeType = file.mimeType, source = file.res.url
    let imageUrl = file.imageUrl, passNextFile = false
    let mediaRef = useRef(null)

    if (file.type === 'music') {
        const audio = document.createElement('audio')
        passNextFile = !audio.canPlayType(mimeType)
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
    } else if (file.type === 'video') {
        const video = document.createElement('video')
        passNextFile = !video.canPlayType(mimeType)
    }

    /**
     * @todo falta los subitulos.
     */
    const setMediaRef = useCallback(node => {
        if (node) {
            /** @type {HTMLVideoElement} */
            const video = document.querySelector('video')
            video.onended = nextFile
            video.onloadedmetadata = () => {
                /** @type {{audioTracks: Array, textTracks: Array}} */
                const { audioTracks, textTracks } = video
                if (audioTracks && audioTracks.length > 1) {
                    setShowAudioBtn(true)
                }
                if (textTracks && textTracks.length > 0) {
                    setShowSubtitleBtn(true)
                }
            }
            mediaRef.current = video
        }
    }, [nextFile])

    const onShowAudioList = useCallback(() => { setShowAudioList(oldVar => !oldVar) }, [setShowAudioList])
    const onHideAudioList = useCallback(() => { setShowAudioList(false) }, [setShowAudioList])
    const onSelectAudio = useCallback(({ selected }) => {
        if (mediaRef.current.audioTracks.length > 1) {
            mediaRef.current.pause()
            const currentTime = mediaRef.current.currentTime - 2
            Array.from(mediaRef.current.audioTracks).forEach((audio, index) => {
                audio.enabled = selected === index
            })
            mediaRef.current.currentTime = Math.max(0, currentTime)
            mediaRef.current.play()
        }
        onHideAudioList()
    }, [mediaRef, onHideAudioList])
    const audioList = useCallback(() => (
        <AudioList audioTracks={mediaRef.current.audioTracks} onSelectAudio={onSelectAudio} />
    ), [mediaRef, onSelectAudio])

    useEffect(() => { if (passNextFile) nextFile() }, [passNextFile, nextFile])

    return (
        <div className={rest.className}>
            <VideoPlayer title={title} poster={imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile}
                ref={setMediaRef}>
                <source src={source} type={mimeType} />
                {file.type === 'video' &&
                    <MediaControls>
                        <rightComponents>
                            {showSubtitleBtn &&
                                <IconButton backgroundOpacity="translucent">sub</IconButton>
                            }
                            {showAudioBtn &&
                                <IconButtonWithPopup backgroundOpacity="translucent"
                                    open={showAudioList}
                                    onClick={onShowAudioList}
                                    popupComponent={audioList}
                                    onClose={onHideAudioList}
                                    direction="up"
                                    showCloseButton>
                                    audio
                                </IconButtonWithPopup>
                            }
                        </rightComponents>
                    </MediaControls>
                }
            </VideoPlayer>
        </div>
    )
}

Player.propTypes = {
    backHome: PropTypes.func,
}

export default Player

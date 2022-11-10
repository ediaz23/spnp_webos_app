
import { useCallback, useEffect, useState, useRef } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import VideoPlayer, { MediaControls } from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'
import AudioList from './AudioList'
import toWebVTT from 'srt-webvtt'

import sub from '../../assets/Kimi.no.na.wa.2016.1080p.1080p-dual-lat.srt'
import video2 from '../../assets/video2.vtt'
import video1_1 from '../../assets/video1_1.vtt'


const IconButtonWithPopup = ContextualPopupDecorator(IconButton)


const buildData = file => {
    let title = file.title, mimeType = file.mimeType, source = file.res.url
    let imageUrl = file.imageUrl, passNextFile = false

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
        /* leer parte de una url
        fetch(file.res.url, { headers: { Range: 'bytes=0-253' }, mode: 'no-cors' })
        .then(res => console.log('si funcionó '))
        .catch(() => console.log('dio error'))
        */
    }
    return { title, mimeType, source, imageUrl, passNextFile }
}

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
    /** @type {[Boolean, Function]} */
    const [playNext, setPlayNext] = useState(false)
    const mediaRef = useRef(null)
    const fileData = buildData(file)

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


    /**
     * @todo falta los subitulos.
     */
    const setMediaRef = useCallback(node => {
        if (node) {
            const video = document.querySelector('video')
            video.onloadedmetadata = () => {
                /** @type {{audioTracks: Array, textTracks: Array}} */
                const { audioTracks, textTracks } = video
                if (audioTracks && audioTracks.length > 1) {
                    setShowAudioBtn(true)
                }
                if (textTracks && textTracks.length > 0) {
                    setShowSubtitleBtn(true)
                }
                /*
                fetch(sub).then(async res => {
                    const subFile = await res.blob()
                    const textTrackUrl = await toWebVTT(subFile)
                    const track = video.addTextTrack('subtitles', 'English', 'en')
                    track.src = textTrackUrl
                    setShowSubtitleBtn(true)
                })
                fetch(video2).then(async res => {
                    const subFile = await res.blob()
                    const track = video.addTextTrack('subtitles', 'Portu', 'pt')
                    track.src = subFile
                    track.mode = 'showing'
                })*/
            }
            mediaRef.current = video
        }
    }, [])
    const onEnded = useCallback(() => { if (playNext) nextFile() }, [nextFile, playNext])

    const togglePlayNext = useCallback(() => { setPlayNext(oldVar => !oldVar) }, [setPlayNext])
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

    useEffect(() => { if (fileData.passNextFile) nextFile() }, [fileData.passNextFile, nextFile, playNext])

    return (
        <div className={rest.className}>
            <VideoPlayer title={fileData.title} poster={fileData.imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile}
                onEnded={onEnded}
                subtitle={'asdf'}
                ref={setMediaRef}>
                <source src={fileData.source} type={fileData.mimeType} />
                <MediaControls>
                    <rightComponents>
                        <IconButton backgroundOpacity="lightTranslucent"
                            selected={playNext}
                            onClick={togglePlayNext}>
                            arrowhookright
                        </IconButton>
                        {file.type === 'video' && showSubtitleBtn &&
                            <IconButton backgroundOpacity="translucent">sub</IconButton>
                        }
                        {file.type === 'video' && showAudioBtn &&
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

            </VideoPlayer>
        </div>
    )
}

Player.propTypes = {
    backHome: PropTypes.func,
}

export default Player

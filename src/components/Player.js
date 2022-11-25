
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import VideoPlayer, { MediaControls, Video } from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'
import AudioSelect from './AudioSelect'
import FileTypeSelect from './FileTypeSelect'
import SubtitleSelect from './SubtitleSelect'
import useExtractMp4Subtitles from '../hooks/extractMp4Subtitles'
import css from './SubtitleSelect.module.less'


/**
 * Get metadat from file to pass to player
 * @param {import('../models/File').default} file
 * @returns {Object}
 */
const buildData = file => {
    let title = file.title, mimeType = file.mimeType, source = file.res.url
    let imageUrl = file.imageUrl

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
    return { title, mimeType, source, imageUrl }
}

/**
 * Calculate next file to play, no matters if it is next o prev file
 */
const playNextFileFn = ({ backHome, fileIndex, files, filesReverse, repeat, setFileIndexCb, typeSelected, extractMp4Subtitle, prev }) => {
    const audio = document.createElement('audio')
    const video = document.createElement('video')
    const validAudio = f => f.type === 'music' && audio.canPlayType(f.mimeType)
    const validImage = f => f.type === 'image'
    const validVideo = f => f.type === 'video' && video.canPlayType(f.mimeType)
    /** @param {import('../models/File').default} f */
    const validFile = f => {
        let out = false
        if (f.type !== 'folder') {
            out = (
                (typeSelected === 'all' && (validImage(f) || validAudio(f) || validVideo(f))) ||
                (typeSelected === 'image' && validImage(f)) ||
                (typeSelected === 'music' && validAudio(f)) ||
                (typeSelected === 'video' && validVideo(f)) ||
                (typeSelected === 'music_video' && (validAudio(f) || validVideo(f)))
            )
        }
        return out
    }
    /** @type {Array<import('../models/File').default} */
    const array = prev ? filesReverse : files
    /** Calculate complement index of index for array */
    const complementIndex = (index) => prev ? array.length - index - 1 : index
    const fileIndexComplement = complementIndex(fileIndex)
    let nextIndex = fileIndexComplement + 1
    while (nextIndex < array.length && !validFile(array[nextIndex])) {
        ++nextIndex
    }
    extractMp4Subtitle.postMessage({action: 'cancel'})
    if (nextIndex < array.length) {
        setFileIndexCb(complementIndex(nextIndex))
    } else {
        if (repeat === 'all') {
            nextIndex = 0
            while (nextIndex < fileIndexComplement && !validFile(array[nextIndex])) {
                ++nextIndex
            }
            if (nextIndex < fileIndexComplement) {
                setFileIndexCb(complementIndex(nextIndex))
            } else {
                backHome()
            }
        } else {
            backHome()
        }
    }
}

/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {String} obj.locale
 * @param {Object} obj.rest
 */
const Player = ({ backHome, ...rest }) => {
    const extractMp4Subtitle = useExtractMp4Subtitles()
    /** @type {[Number, Function]} */
    const [fileIndex, setFileIndex] = useRecoilState(fileIndexState)
    /** @type {Array<import('../models/File').default} */
    const files = useRecoilValue(filesState)
    /** @type {import('../models/Playable').default} */
    const filesReverse = useMemo(() => [...files].reverse(), [files])
    /** @type {import('../models/Playable').default} */
    const file = files[fileIndex]
    /** @type {[Boolean, Function]} */
    const [showSubtitleBtn, setShowSubtitleBtn] = useState(false)
    /** @type {[Boolean, Function]} */
    const [showAudioBtn, setShowAudioBtn] = useState(false)
    /** @type {[Boolean, Function]} */
    const [playNext, setPlayNext] = useState(true)
    /** @type {[Boolean, Function]} */
    const [loading, setLoading] = useState(true)
    /** @type {{current: HTMLVideoElement}} */
    const videoRef = useRef(null)
    /** @type {{current:import('@enact/moonstone/VideoPlayer/VideoPlayer').VideoPlayerBase}} */
    const videoCompRef = useRef(null)
    /** @type {[String, Function]} */
    const [repeat, setRepeat] = useState('none')
    const fileData = useMemo(() => buildData(file), [file])
    const repeatSet = useMemo(() => { return { none: 'all', all: 'one', one: 'none' } }, [])
    /** @type {[String, Function]} */
    const [typeSelected, setTypeSelected] = useState('all')
    /** @type {{current: Array<{id: Number}>}} */
    const subtitlesRef = useRef(null)

    const setFileIndexCb = useCallback(index => {
        setLoading(true)
        setFileIndex(index)
    }, [setLoading, setFileIndex])

    const playNextFile = useCallback(param => {
        playNextFileFn({ backHome, fileIndex, files, filesReverse, repeat, setFileIndexCb, typeSelected, extractMp4Subtitle, ...param })
    }, [backHome, fileIndex, files, filesReverse, repeat, setFileIndexCb, typeSelected, extractMp4Subtitle])

    const nextFile = useCallback(() => { playNextFile({ next: true }) }, [playNextFile])
    const prevFile = useCallback(() => { playNextFile({ prev: true }) }, [playNextFile])
    const togglePlayNext = useCallback(() => { setPlayNext(oldVar => !oldVar) }, [setPlayNext])
    const changeRepeat = useCallback(() => { setRepeat(oldVar => repeatSet[oldVar]) }, [setRepeat, repeatSet])

    const onEnded = useCallback(() => {
        if (repeat === 'one') {
            videoCompRef.current.play()
        } else {
            if (playNext) {
                nextFile()
            }
        }
    }, [nextFile, playNext, repeat, videoCompRef])

    const onLoadedMetadata = useCallback(() => {
        if (file.type === 'video') {
            const video = videoRef.current
            if (!video.classList.contains(css.video)) {
                video.classList.add(css.video)
            }
            setShowSubtitleBtn(video.textTracks && video.textTracks.length > 0)
            setShowAudioBtn(video.audioTracks && video.audioTracks.length > 1)
        }
        videoRef.current.play()
    }, [file, setShowAudioBtn, setShowSubtitleBtn])

    const stopLoading = useCallback((event) => {
        if (event) {
            console.log(event)
        }
        setLoading(false)
        videoRef.current.load()
    }, [setLoading, videoRef])

    const cleanExtractMp4Subtitle = useCallback((processFunc) => {
        extractMp4Subtitle.removeEventListener('message', processFunc)
        extractMp4Subtitle.removeEventListener('messageerror', stopLoading)
        extractMp4Subtitle.removeEventListener('error', stopLoading)
    }, [extractMp4Subtitle, stopLoading])

    const processSubtitles = useCallback((event) => {
        const { action, ...params } = event.data
        if (action === 'subtitles') {
            const { subtitles } = params
            for (const sub of subtitles) {
                const track = videoRef.current.addTextTrack(sub.type, sub.name, sub.language)
                sub.track = track
            }
            stopLoading()
            subtitlesRef.current = subtitles
        } else if (action === 'cues') {
            const { cues } = params
            const subtitle = subtitlesRef.current.find(sub => sub.id === params.id)
            if (subtitle) {
                const { track } = subtitle
                for (const cue of cues) {
                    const cueObj = new window.VTTCue(cue.start, cue.end, cue.text)
                    cueObj.line = -3
                    track.addCue(cueObj)
                }
            }
        } else if (action === 'error') {
            console.error(params)
            stopLoading()
            cleanExtractMp4Subtitle(processSubtitles)
        } else if (action === 'end') {
            cleanExtractMp4Subtitle(processSubtitles)
        }
    }, [stopLoading, cleanExtractMp4Subtitle])

    useEffect(() => { videoRef.current = document.querySelector('video') }, [file, videoCompRef])

    useEffect(() => {
        setShowAudioBtn(false)
        setShowSubtitleBtn(false)
        if (file.type === 'video') {
            if (file.mimeType === 'video/mp4') {
                if (loading) {
                    const dataParam = { url: file.res.url, size: file.res.size }
                    extractMp4Subtitle.addEventListener('message', processSubtitles)
                    extractMp4Subtitle.addEventListener('messageerror', stopLoading)
                    extractMp4Subtitle.addEventListener('error', stopLoading)
                    extractMp4Subtitle.postMessage({ action: 'getSubtitles', data: dataParam })
                }
            } else {
                stopLoading()
            }
        } else {
            stopLoading()
        }
    }, [file, setShowAudioBtn, setShowSubtitleBtn, loading, processSubtitles, extractMp4Subtitle, stopLoading])

    return (
        <div className={rest.className}>
            <VideoPlayer title={fileData.title} poster={fileData.imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile}
                onEnded={onEnded}
                loading={loading}
                ref={videoCompRef}
                noAutoPlay>
                <Video id={file.id} onLoadedMetadata={onLoadedMetadata}>
                    <source src={fileData.source} type={fileData.mimeType} />
                </Video>
                <MediaControls>
                    <leftComponents>
                        <FileTypeSelect typeSelected={typeSelected} onSelect={setTypeSelected} />
                        <IconButton backgroundOpacity="lightTranslucent"
                            selected={repeat !== 'none'}
                            onClick={changeRepeat}>
                            {'repeat' + repeat}
                        </IconButton>
                    </leftComponents>
                    <rightComponents>
                        <IconButton backgroundOpacity="lightTranslucent"
                            selected={playNext}
                            onClick={togglePlayNext}>
                            arrowhookright
                        </IconButton>
                        {showSubtitleBtn &&
                            <SubtitleSelect file={file} videoRef={videoRef} />
                        }
                        {showAudioBtn &&
                            <AudioSelect file={file} videoRef={videoRef} />
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

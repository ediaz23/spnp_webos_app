
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import VideoPlayer, { MediaControls, Video } from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'
import AudioSelect from './AudioSelect'
import { Buffer } from 'buffer'
import MP4Box from 'mp4box'

import AudioList from './AudioList'


const IconButtonWithPopup = ContextualPopupDecorator(IconButton)


const toBuffer = (ab) => {
    const buffer = new Buffer(ab.byteLength)
    const view = new Uint8Array(ab)
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i]
    }
    return buffer
}

/**
 * @param {import('../models/Video').default} video
 * @return {Promise<Array>}
 */
const extracMp4Subtitles = async (video) => {
    const mp4boxfile = MP4Box.createFile()
    const bufferSize = 1 << 23
    const subtitles = [], control = []

    let filePos = 0, loop = true

    mp4boxfile.onReady = (info) => {
        if (info.subtitleTracks) {
            loop = info.subtitleTracks.length > 0
            for (const track of info.subtitleTracks) {
                track.cueList = []
                track.addCue = function(cue) { this.cueList.push(cue) }
                subtitles.push(track)
                mp4boxfile.setExtractionOptions(track.id, track)
            }
            mp4boxfile.start()
        } else {
            loop = false
        }
    }

    mp4boxfile.onSamples = async (id, textTrack, samples) => {
        control.push(id)
        loop = control.length < subtitles.length
        for (const sample of samples) {
            const text = toBuffer(sample.data).toString('utf-8').substring(2)
            const cue = new window.VTTCue(sample.dts / sample.timescale, (sample.dts + sample.duration) / sample.timescale, text)
            textTrack.addCue(cue)
        }
    }
    const resSize = await fetch(video.res.url, { method: 'HEAD' })
    const maxSize = parseInt(resSize.headers.get('Content-Length'))
    while (loop) {  // up function are executed inside loop
        try {
            const nextChunk = Math.min(filePos + bufferSize, maxSize)
            const res = await fetch(video.res.url, { headers: { Range: `bytes=${filePos}-${nextChunk}` } })
            if ([200, 206].includes(res.status)) {
                const arrayBuffer = await res.arrayBuffer()
                arrayBuffer.fileStart = filePos
                filePos += arrayBuffer.byteLength
                mp4boxfile.appendBuffer(arrayBuffer)
            } else {
                loop = false
            }
        } catch (err) {
            console.log(err)
            loop = false
        }
    }
    return subtitles
}

/**
 * @param {import('../models/Video').default} video
 * @return {Promise<Array>}
 */
const extractSubtitles = async (video) => {
    let out = []
    if (video.mimeType === 'video/mp4') {
        out = await extracMp4Subtitles(video)
    } else {
        /** @todo que pasa si no es mp4 */
    }
    return out
}

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
    const filesReverse = useMemo(() => [...files].reverse(), [files])
    /** @type {import('../models/Playable').default} */
    const file = files[fileIndex]
    /** @type {[Boolean, Function]} */
    const [showSubtitleList, setShowSubtitleList] = useState(false)
    /** @type {[Boolean, Function]} */
    const [showSubtitleBtn, setShowSubtitleBtn] = useState(false)
    /** @type {[Boolean, Function]} */
    const [playNext, setPlayNext] = useState(false)
    /** @type {[Boolean, Function]} */
    const [loading, setLoading] = useState(file.type === 'video')
    /** @type {{current: HTMLVideoElement}} */
    const mediaRef = useRef(null)
    /** @type {[String, Function]} */
    const [repeat, setRepeat] = useState('none')
    const fileData = useMemo(() => buildData(file), [file])
    const [subtitles, setSubtitles] = useState(null)
    const repeatSet = useMemo(() => { return { none: 'all', all: 'one', one: 'none' } }, [])

    const setFileIndexCb = useCallback(index => {
        setShowSubtitleBtn(false)
        setFileIndex(index)
    }, [setShowSubtitleBtn, setFileIndex])

    const playNextFile = useCallback(({ prev }) => {
        const audio = document.createElement('audio')
        const video = document.createElement('video')
        /** @type {Array<import('../models/File').default} */
        const array = prev ? filesReverse : files
        /** @param {import('../models/File').default} f */
        const validFile = f => f.type !== 'folder' &&
            (f.type === 'image' ||
                (f.type === 'music' && audio.canPlayType(f.mimeType)) ||
                (f.type === 'video' && video.canPlayType(f.mimeType)))
        const complementIndex = index => prev ? array.length - index - 1 : index
        const fileIndexComplement = complementIndex(fileIndex)
        let nextIndex = fileIndexComplement + 1
        while (nextIndex < array.length && !validFile(array[nextIndex])) {
            ++nextIndex
        }
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
    }, [backHome, fileIndex, files, filesReverse, repeat, setFileIndexCb])

    const nextFile = useCallback(() => { playNextFile({ next: true }) }, [playNextFile])
    const prevFile = useCallback(() => { playNextFile({ prev: true }) }, [playNextFile])
    const togglePlayNext = useCallback(() => { setPlayNext(oldVar => !oldVar) }, [setPlayNext])
    const changeRepeat = useCallback(() => { setRepeat(oldVar => repeatSet[oldVar]) }, [setRepeat, repeatSet])
    const setMediaRef = useCallback(node => { if (node) mediaRef.current = document.querySelector('video') }, [])
    const onEnded = useCallback(() => {
        if (repeat === 'one') {
            mediaRef.current.play()
        } else {
            if (playNext) {
                nextFile()
            }
        }
    }, [nextFile, playNext, repeat])

    // subtitle
    const onShowSubList = useCallback(() => { setShowSubtitleList(oldVar => !oldVar) }, [setShowSubtitleList])
    const onHideSubList = useCallback(() => { setShowSubtitleList(false) }, [setShowSubtitleList])
    const onSelectSub = useCallback(({ selected }) => {
        mediaRef.current.pause()
        const currentTime = mediaRef.current.currentTime - 2
        Array.from(mediaRef.current.textTracks).forEach(sub => { sub.mode = 'hidden' })
        mediaRef.current.textTracks[selected].mode = 'showing'
        mediaRef.current.currentTime = Math.max(0, currentTime)
        mediaRef.current.play()
        onHideSubList()
    }, [mediaRef, onHideSubList])
    const subList = useCallback(() => (
        <AudioList audioTracks={mediaRef.current.textTracks} onSelectAudio={onSelectSub} />
    ), [mediaRef, onSelectSub])

    useEffect(() => {
        const video = document.querySelector('video')
        if (video) {
            mediaRef.current = video
        }
        if (file.type === 'video') {
            extractSubtitles(file).then(setSubtitles)
        }
    }, [file])
    useEffect(() => {
        if (mediaRef.current) {
            const video = mediaRef.current
            if (subtitles) {
                for (const sub of subtitles) {
                    const track = video.addTextTrack(sub.type, sub.name, sub.language)
                    for (const cue of sub.cueList) {
                        track.addCue(cue)
                    }
                }
            }
            if (video.textTracks && video.textTracks.length > 0) {
                setShowSubtitleBtn(true)
            }
            if (subtitles) {
                setLoading(false)
            }
        }

    }, [mediaRef, subtitles])
    useEffect(() => { if (fileData.passNextFile) nextFile() }, [fileData.passNextFile, nextFile, playNext])
    return (
        <div className={rest.className}>
            <VideoPlayer title={fileData.title} poster={fileData.imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile}
                onEnded={onEnded}
                loading={loading}
                ref={setMediaRef}>
                <Video id={file.id}>
                    <source src={fileData.source} type={fileData.mimeType} />
                </Video>
                <MediaControls>
                    <leftComponents>
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
                        {file.type === 'video' && showSubtitleBtn &&
                            <IconButtonWithPopup backgroundOpacity="translucent"
                                open={showSubtitleList}
                                onClick={onShowSubList}
                                onClose={onHideSubList}
                                popupComponent={subList}
                                direction="up"
                                showCloseButton>
                                sub
                            </IconButtonWithPopup>
                        }
                        {file.type === 'video' && mediaRef.current &&
                            mediaRef.current.audioTracks && mediaRef.current.audioTracks.length > 1 &&
                            <AudioSelect file={file} />
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

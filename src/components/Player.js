
import { useCallback, useEffect } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import VideoPlayer, { MediaControls } from '@enact/moonstone/VideoPlayer'
import PropTypes from 'prop-types'
import { I18nContextDecorator } from '@enact/i18n/I18nDecorator'
import languages from '@cospired/i18n-iso-languages'
import LocaleInfo from 'ilib/lib/LocaleInfo'
import { useRecoilValue, useRecoilState } from 'recoil'
import { fileIndexState, filesState } from '../recoilConfig'
import silent from '../../assets/silent.ogg'


/**
 * @param {Object} obj
 * @param {String} obj.className
 * @param {String} obj.locale
 * @param {Object} obj.rest
 */
const Player = ({ backHome, locale, ...rest }) => {
    const localeInfo = new LocaleInfo(locale).getLocale()
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
    let title = file.title, mimeType = file.mimeType, source = file.res.url
    let imageUrl = file.imageUrl, passNextFile = false
    /** @type {HTMLVideoElement} */
    let mediaRef = null

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
    useEffect(() => {
        if (passNextFile) {
            nextFile()
        }
    }, [passNextFile, nextFile])

    const setMediaRef = node => {
        if (node) {
            mediaRef = document.querySelector('video')
            mediaRef.onended = nextFile
        }
    }

    const handleClick = useCallback(() => {
        if (mediaRef) {
            /** @param {Array} */
            const audioTracks = mediaRef.audioTracks
            if (audioTracks) {
                for (const audio of audioTracks) {
                    console.log(languages.getName(audio.language, localeInfo.language))
                }
            }
        }
    }, [mediaRef, localeInfo])

    return (
        <div className={rest.className}>
            <VideoPlayer title={title} poster={imageUrl} {...rest}
                onJumpBackward={prevFile}
                onJumpForward={nextFile}
                ref={setMediaRef}>
                <source src={source} type={mimeType} />
                <MediaControls>
                    <rightComponents>
                        <IconButton backgroundOpacity="translucent">sub</IconButton>
                        <IconButton backgroundOpacity="translucent"
                            onClick={handleClick}>
                            audio
                        </IconButton>
                    </rightComponents>
                </MediaControls>
            </VideoPlayer>
        </div>
    )
}

Player.propTypes = {
    backHome: PropTypes.func,
    locale: PropTypes.string
}

export default I18nContextDecorator({ localeProp: 'locale' }, Player)

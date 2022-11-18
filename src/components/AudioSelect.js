
import { useCallback, useState } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import AudioList from './AudioList'

const IconButtonWithPopup = ContextualPopupDecorator(IconButton)

const AudioSelect = ({ videoRef }) => {
    const video = videoRef.current

    /** @type {[Boolean, Function]} */
    const [showAudioList, setShowAudioList] = useState(false)

    const onShowAudioList = useCallback(() => { setShowAudioList(oldVar => !oldVar) }, [setShowAudioList])
    const onHideAudioList = useCallback(() => { setShowAudioList(false) }, [setShowAudioList])
    const onSelectAudio = useCallback(({ selected }) => {
        if (video.audioTracks.length > 1) {
            let play = !video.paused
            if (play) { video.pause() }
            const currentTime = video.currentTime - 2
            Array.from(video.audioTracks).forEach((audio, index) => {
                audio.enabled = selected === index
            })
            video.currentTime = Math.max(0, currentTime)
            if (play) { video.play() }
        }
        onHideAudioList()
    }, [video, onHideAudioList])
    const audioList = useCallback(() => (
        <AudioList audioTracks={video.audioTracks} onSelectAudio={onSelectAudio} />
    ), [video, onSelectAudio])

    return (
        <IconButtonWithPopup
            backgroundOpacity="lightTranslucent"
            open={showAudioList}
            onClick={onShowAudioList}
            onClose={onHideAudioList}
            popupComponent={audioList}
            direction="up"
            showCloseButton>
            audio
        </IconButtonWithPopup>
    )
}

export default AudioSelect

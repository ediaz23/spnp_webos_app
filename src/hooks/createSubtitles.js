
import { useMemo, useRef } from 'react'
import useExtractSubtitles from './extractSubtitles'

/**
 * @param {import('../models/Playable').default} file
 */
export default function useCreateSubtitles(file) {
    const subtitleWorker = useExtractSubtitles()
    const subtitlesRef = useRef(null)

    return useMemo(() => ({ stopLoading, videoRef }) => {

        const cleanExtractMp4Subtitle = (processFunc) => {
            subtitleWorker.removeEventListener('message', processFunc)
            subtitleWorker.removeEventListener('messageerror', stopLoading)
            subtitleWorker.removeEventListener('error', stopLoading)
        }

        const processSubtitles = (event) => {
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
                /** @type {{cues: Array}} */
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
        }

        if (['video/mp4', 'video/x-matroska'].includes(file.mimeType)) {
            const dataParam = { url: file.res.url, size: file.res.size, mimeType: file.mimeType }
            subtitleWorker.addEventListener('message', processSubtitles)
            subtitleWorker.addEventListener('messageerror', stopLoading)
            subtitleWorker.addEventListener('error', stopLoading)
            subtitleWorker.postMessage({ action: 'getSubtitles', data: dataParam })
        } else {
            stopLoading()
        }
    }, [file, subtitleWorker])
}

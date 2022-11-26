
import { useMemo, useRef } from 'react'
import useExtractMp4Subtitles from './extractMp4Subtitles'


export default function useCreateSubtitles(file) {
    const extractMp4Subtitle = useExtractMp4Subtitles()
    const subtitlesRef = useRef(null)
    const subtitleWorker = extractMp4Subtitle

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

        const dataParam = { url: file.res.url, size: file.res.size }
        subtitleWorker.addEventListener('message', processSubtitles)
        subtitleWorker.addEventListener('messageerror', stopLoading)
        subtitleWorker.addEventListener('error', stopLoading)
        subtitleWorker.postMessage({ action: 'getSubtitles', data: dataParam })
    }, [file, subtitleWorker])
}

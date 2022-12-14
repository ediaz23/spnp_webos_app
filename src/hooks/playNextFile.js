
import { useMemo } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { filesState, fileIndexState } from '../recoilConfig'
import useExtractSubtitles from './extractSubtitles'


export default function usePlayNext() {

    /** @type {Array<import('../models/File').default} */
    const files = useRecoilValue(filesState)
    /** @type {import('../models/Playable').default} */
    const filesReverse = useMemo(() => [...files].reverse(), [files])
    /** @type {[Number, Function]} */
    const [fileIndex, setFileIndex] = useRecoilState(fileIndexState)
    const extractSubtitle = useExtractSubtitles()

    return ({ backHome, repeat, typeSelected, setLoading, prev }) => {
        const audio = document.createElement('audio')
        const video = document.createElement('video')
        const validAudio = f => f.type === 'music' && audio.canPlayType(f.mimeType)
        const validImage = f => f.type === 'image'
        const validVideo = f => {
            if (f.type === 'video') {
                const videoPlay = video.canPlayType(f.mimeType)
                console.log(`Test play ${f.type} ${f.mimeType} ${videoPlay}`)
            }
            return f.type === 'video'
        }
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
        extractSubtitle.postMessage({ action: 'cancel' })
        if (nextIndex < array.length) {
            setLoading(true)
            setFileIndex(complementIndex(nextIndex))
        } else {
            if (repeat === 'all') {
                nextIndex = 0
                while (nextIndex < fileIndexComplement && !validFile(array[nextIndex])) {
                    ++nextIndex
                }
                if (nextIndex < fileIndexComplement) {
                    setLoading(true)
                    setFileIndex(complementIndex(nextIndex))
                } else {
                    backHome()
                }
            } else {
                backHome()
            }
        }
    }
}


import { Buffer } from 'buffer'
import MP4Box from 'mp4box'


const toBuffer = (ab) => {
    const buffer = Buffer.alloc(ab.byteLength)
    const view = new Uint8Array(ab)
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i]
    }
    return buffer
}

/**
 * Extrar subtitles from url
 * @param {Object} obj
 * @param {String} obj.url
 * @param {Array<{type: String, size: Number, pos: Number}>} obj.atoms
 * @return {Promise}
 */
const extracMp4Subtitles = async ({ url, atoms }) => {
    const mp4boxfile = MP4Box.createFile(false)
    const subtitles = [], control = new Set()
    const bufferSize = (1 << 20) * 23 // 5 Mb
    const ignore = ['mdat', 'free']
    let bufferPos = 0, okey = true

    mp4boxfile.onReady = (info) => {
        console.log('extracMp4Subtitles.ready')
        if (info.subtitleTracks) {
            okey = info.subtitleTracks.length > 0
            for (const track of info.subtitleTracks) {
                track.cueList = []
                track.addCue = function(cue) { this.cueList.push(cue) }
                subtitles.push(track)
                mp4boxfile.setExtractionOptions(track.id, track, { nbSamples: 500 })
            }
            mp4boxfile.start()
        }
    }
    mp4boxfile.onSamples = (id, textTrack, samples) => {
        console.log('extracMp4Subtitles.onSamples')
        control.add(id)
        for (const sample of samples) {
            const text = toBuffer(sample.data).toString('utf-8').substring(2)
            textTrack.addCue({
                start: sample.dts / sample.timescale,
                end: (sample.dts + sample.duration) / sample.timescale,
                text: text,
            })
        }
        okey = control.size < subtitles.length || textTrack.cueList.length < textTrack.nb_samples
        mp4boxfile.releaseUsedSamples(id, textTrack.cueList.length)
    }
    mp4boxfile.onError = (res) => {
        console.error('extracMp4Subtitles mp4boxfile.Error')
        console.error(res)
        okey = false
    }
    const readAtom = async atom => {
        console.log('extracMp4Subtitles.readAtom ' + atom.type)
        const endAtom = atom.pos + atom.size
        for (let pos = atom.pos; pos < endAtom && okey; pos += bufferSize) {
            const nextChunk = Math.min(pos + bufferSize, endAtom - 1)
            const res = await fetch(url, { headers: { Range: `bytes=${pos}-${nextChunk}` } })
            if ([200, 206].includes(res.status)) {
                const arrayBuffer = await res.arrayBuffer()
                arrayBuffer.fileStart = bufferPos
                bufferPos += arrayBuffer.byteLength
                mp4boxfile.appendBuffer(arrayBuffer)
            } else {
                okey = false
            }
        }
    }
    for (const atom of atoms) {
        if (!ignore.includes(atom.type)) {
            await readAtom(atom)
        }
        if (!okey) { break }
    }
    const atomMdat = atoms.find(atom => atom.type === 'mdat')
    if (okey && atomMdat) {
        await readAtom(atomMdat)
    }
    mp4boxfile.flush()
    return subtitles
}

/**
 * Returns mp4 atoms
 * @param {String} url
 * @param {Number} fileSize
 * @returns {Promise<{size: Number, atoms: Array<{type: String, size: Number, pos: Number}>}>}
 */
const getMp4Atoms = async (url, fileSize) => {
    const buffers = []
    const basicSize = 8
    let size = 0

    for (let pos = 0; pos < fileSize; pos += size) {
        const res = await fetch(url, { headers: { Range: `bytes=${pos}-${pos + basicSize}` } })
        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        size = buffer.readInt32BE()
        if (size < 0) { throw new Error('not mp4') }
        const type = buffer.toString('utf8', 4, 8)
        buffers.push({ type, size, pos })
    }
    return buffers
}

/**
 * @param {import('../models/Video').default} video
 * @type {import('../types').Device} device
 * @return {Promise<Array>}
 */
const extractSubtitles = async (video) => {
    let out = []
    try {
        if (video.mimeType === 'video/mp4') {
            const atoms = await getMp4Atoms(video.res.url, video.res.size)
            if (atoms.find(atom => atom.type === 'moov')) {
                out = await extracMp4Subtitles({ url: video.res.url, atoms })
            }
        } else {
            /** @todo que pasa si no es mp4 */
        }
    } catch (err) {
        console.log('error extractSubtitles')
        console.log(err)
    }
    return out
}

export default function useExtractSubtitles() {
    return extractSubtitles
}
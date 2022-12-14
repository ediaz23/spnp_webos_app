/* global MP4Box */
/* global importScripts */
/* global self */

const queue = Promise.resolve()
let okey = false, cancel = false, Buffer = null


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
    const bufferSize = (1 << 20) * 5 // 5 Mb
    const ignore = ['mdat', 'free']
    let bufferPos = 0

    mp4boxfile.onReady = (info) => {
        console.log('extracMp4Subtitles.ready')
        if (info.subtitleTracks) {
            okey = info.subtitleTracks.length > 0
            for (const track of info.subtitleTracks) {
                subtitles.push({ ...track })
                track.cueList = []
                track.addCue = function(cue) { this.cueList.push(cue) }
                mp4boxfile.setExtractionOptions(track.id, track, { nbSamples: 256 })
            }
            mp4boxfile.start()
        }
        self.postMessage({ action: 'subtitles', subtitles })
    }

    mp4boxfile.onSamples = (id, textTrack, samples) => {
        console.log('extracMp4Subtitles.onSamples')
        control.add(id)
        const cues = []
        for (const sample of samples) {
            const text = Buffer.from(sample.data.buffer).toString('utf-8').substring(2)
            const cue = {
                start: sample.dts / sample.timescale,
                end: (sample.dts + sample.duration) / sample.timescale,
                text: text,
            }
            cues.push(cue)
            textTrack.addCue(cue)
        }
        okey = control.size < subtitles.length || textTrack.cueList.length < textTrack.nb_samples
        mp4boxfile.releaseUsedSamples(id, textTrack.cueList.length)
        self.postMessage({ action: 'cues', cues, id })  // eslint-disable-line
    }

    mp4boxfile.onError = (res) => {
        console.error('extracMp4Subtitles mp4boxfile.Error')
        console.error(res)
        okey = false
        self.postMessage({ action: 'error', error: res })  // eslint-disable-line
    }
    const readAtom = async atom => {
        console.log('extracMp4Subtitles.readAtom ' + atom.type)
        const endAtom = atom.pos + atom.size
        for (let pos = atom.pos; pos < endAtom && okey && !cancel; pos += bufferSize) {
            const nextChunk = Math.min(pos + bufferSize, endAtom) - 1
            const res = await fetch(url, { headers: { Range: `bytes=${pos}-${nextChunk}` } })
            if ([200, 206].includes(res.status)) {
                const arrayBuffer = await res.arrayBuffer()
                arrayBuffer.fileStart = bufferPos
                bufferPos += arrayBuffer.byteLength
                mp4boxfile.appendBuffer(arrayBuffer)
            } else {
                okey = false
                self.postMessage({ action: 'error', error: 'Req status error ' + res.status })  // eslint-disable-line
            }
        }
    }
    for (const atom of atoms) {
        if (!ignore.includes(atom.type)) {
            await readAtom(atom)
        }
        if (!okey || cancel) { break }
    }
    const atomMdat = atoms.find(atom => atom.type === 'mdat')
    if (okey && !cancel && atomMdat) {
        await readAtom(atomMdat)
        mp4boxfile.flush()
        self.postMessage({ action: 'end' })
    }
    console.log('extracMp4Subtitles end')
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
 * Extrac subtitltes and notify
 */
const extractSubtitles = async ({ url, size, mimeType }) => {
    try {
        okey = true
        cancel = false
        const atoms = await getMp4Atoms(url, size)
        if (atoms.find(atom => atom.type === 'moov')) {
            await extracMp4Subtitles({ url, atoms })
        } else {
            self.postMessage({ action: 'subtitles', subtitles: [] })  // eslint-disable-line
        }
    } catch (error) {
        console.error('extractSubtitles error')
        console.error(error)
        self.postMessage({ action: 'error', error })  // eslint-disable-line
    } finally {
        okey = false
    }
}

self.addEventListener('message', function(event) {
    const { action, data } = event.data
    console.log('extractMp4Subtitles ' + action)
    if (action === 'init') {
        try {
            for (const lib of data.libs) {
                importScripts(lib)
            }
            Buffer = self.Buffer
        } catch (err) {
            console.log('error importando')
            console.log(err)
        }
    } else if (action === 'getSubtitles') {
        queue.then(() => extractSubtitles(data))
    } else if (action === 'cancel') {
        cancel = true
    }
})

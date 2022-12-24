/* global MP4Box */
/* global importScripts */
/* global self */

const queue = Promise.resolve()
let okey = false, cancel = false
/** @type {import('buffer/').Buffer} */
let Buffer = null
/** @type {import('matroska-subtitles').SubtitleParser} */
let SubtitleParser = null


/**
 * Extrar subtitles from url
 * @param {Object} obj
 * @param {String} obj.url
 * @param {Array<{type: String, size: Number, pos: Number}>} obj.atoms
 * @return {Promise}
 */
const extracMp4Subtitles = async ({ url, atoms }) => {
    /** @type {import('mp4box').ISOFile} */
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
    }
    console.log('extracMp4Subtitles end')
    return subtitles
}

/**
 * Returns mp4 atoms
 * @param {Object} obj
 * @param {String} obj.url
 * @param {Number} obj.fileSize
 * @returns {Promise<{size: Number, atoms: Array<{type: String, size: Number, pos: Number}>}>}
 */
const getMp4Atoms = async ({ url, fileSize }) => {
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
        if (type === 'moof') {  // it's a stream.
            break
        }
    }
    return buffers
}

/**
 * Returns mp4 atoms
 * @param {Object} obj
 * @param {String} obj.url
 * @param {Number} obj.fileSize
 */
const extracMkvSubtitles = async ({ url, fileSize }) => {
    /** @type {import('matroska-subtitles').SubtitleParser} */
    const parser = new SubtitleParser()
    let bufferSize = (1 << 20) * 2 // 2 Mb
    let pos = 0, bufferPos = 0
    const subtitles = []

    parser.once('tracks', (tracks) => {
        for (const track of tracks) {
            subtitles.push({
                id: track.number,
                name: track.name,
                language: track.language || 'eng',
                type: 'subtitles'
            })
        }
        self.postMessage({ action: 'subtitles', subtitles: subtitles })  // eslint-disable-line
        bufferSize = (1 << 20) * 5  // 5 MB
        okey = subtitles.length > 0
    })

    // afterwards each subtitle is emitted
    parser.on('subtitle', (subtitle, trackNumber) => {
        const cues = [{
            start: subtitle.time / 1000.0,
            end: (subtitle.time + subtitle.duration) / 1000.0,
            text: subtitle.text.replace(/\\n/gi, '\n'),
        }]
        self.postMessage({ action: 'cues', cues, id: trackNumber })  // eslint-disable-line
    })
    pos = 0
    while (pos < fileSize && okey && !cancel) {
        const nextChunk = Math.min(pos + bufferSize, fileSize)
        const res = await fetch(url, { headers: { Range: `bytes=${pos}-${nextChunk}` } })
        pos += bufferSize + 1
        if ([200, 206].includes(res.status)) {
            const arrayBuffer = await res.arrayBuffer()
            /** @type {Buffer} */
            const buffer = Buffer.from(arrayBuffer)
            bufferPos += arrayBuffer.byteLength
            parser.write(buffer)
        } else {
            okey = false
            self.postMessage({ action: 'error', error: 'Req status error ' + res.status })  // eslint-disable-line
        }
    }
    parser.end()
    console.log(`termino ${bufferPos} - ${fileSize}`)
    return subtitles
}

/**
 * Extrac subtitltes and notify
 */
const extractSubtitles = async ({ url, size, mimeType }) => {
    try {
        okey = true
        cancel = false
        if (mimeType === 'video/mp4') {
            const atoms = await getMp4Atoms({ url, fileSize: size })
            if (atoms.find(atom => atom.type === 'moov')) {
                await extracMp4Subtitles({ url, atoms })
            } else {
                self.postMessage({ action: 'subtitles', subtitles: [] })  // eslint-disable-line
            }
        } else if (mimeType === 'video/x-matroska') {
            await extracMkvSubtitles({ url, fileSize: size })
        } else {
            throw new Error('Subtitle type no supported')
        }
        self.postMessage({ action: 'end' })
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
    console.log('extractSubtitles ' + action)
    if (action === 'init') {
        try {
            for (const lib of data.libs) {
                importScripts(lib)
            }
            Buffer = self.Buffer
            SubtitleParser = self.SubtitleParser
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

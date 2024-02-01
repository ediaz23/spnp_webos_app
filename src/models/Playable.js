
import FileBase from './File'


export default class Playable extends FileBase {
    constructor(obj) {
        super(obj)
        /** @type {Date} */
        this.date = new Date(obj.date)
        const res = Array.isArray(obj.res) ? obj.res[0] : obj.res
        this.res = {
            bitrate: parseInt(res.bitrate),
            duration: res.duration,
            nrAudioChannels: parseInt(res.nrAudioChannels),
            protocolInfo: res.protocolInfo,
            sampleFrequency: parseInt(res.sampleFrequency),
            size: parseInt(res.size),
            url: res.url,
        }
        const chunks = this.res.protocolInfo.split(':')
        /** @type {String} */
        this.mimeType = chunks[2]
    }
}

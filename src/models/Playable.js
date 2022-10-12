
import File from './File'


export default class Playable extends File {
    constructor(obj) {
        super(obj)
        /** @type {Date} */
        this.date = new Date(obj.date)
        this.res = {
            bitrate: parseInt(obj.res.bitrate),
            duration: obj.res.duration,
            nrAudioChannels: parseInt(obj.res.nrAudioChannels),
            protocolInfo: obj.res.protocolInfo,
            sampleFrequency: parseInt(obj.res.sampleFrequency),
            size: parseInt(obj.res.size),
            url: obj.res.url,
        }
        const chunks = this.res.protocolInfo.split(':')
        /** @type {String} */
        this.mimeType = chunks[2]
    }
}


import FileBase from './File'


export default class Image extends FileBase {
    /**
     * @todo falta res
     */
    constructor(obj) {
        super(obj)
        this.type = 'image'
        this.imageUrl = obj.res[obj.res.length - 1].url
        const res = obj.res[0]
        this.res = {
            protocolInfo: res.protocolInfo,
            resolution: res.resolution,
            size: parseInt(res.size),
            url: res.url,
        }
        const chunks = this.res.protocolInfo.split(':')
        /** @type {String} */
        this.mimeType = chunks[2]
    }
}


import File from './File'


export default class Image extends File {
    /**
     * @todo falta res
     */
    constructor(obj) {
        super(obj)
        this.type = 'image'
        this.imageUrl = obj.res[obj.res.length - 1].url
        const res = obj.res[0]
        this.url = {
            protocolInfo: res.protocolInfo,
            resolution: res.resolution,
            size: parseInt(res.size),
            url: res.url,
        }
    }
}

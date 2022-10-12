
import Playable from './Playable'
import defaulImage from '../../assets/img/video.png'


export default class Video extends Playable {

    constructor(obj) {
        super(obj)
        this.res.resolution = obj.res.resolution
        this.type = 'video'
        /** @type {String} */
        this.imageUrl = defaulImage
    }
}


import Playable from './Playable'


export default class Video extends Playable {

    constructor(obj) {
        super(obj)
        this.res.resolution = obj.res.resolution
        this.type = 'video'
    }
}

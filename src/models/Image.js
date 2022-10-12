
import File from './File'


export default class Image extends File {
    /**
     * @todo falta res
     */
    constructor(obj) {
        super(obj)
        this.type = 'image'
    }
}

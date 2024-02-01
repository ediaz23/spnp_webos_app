
import defaulImage from '../../assets/img/file.png'


export default class FileBase {
    constructor(obj) {
        /** @type {String} */
        this.id = obj.id
        /** @type {String} */
        this.parentID = obj.parentID
        /** @type {Boolean} */
        this.restricted = obj.restricted === '1'
        /** @type {String} */
        this.title = '' + obj.title
        /** @type {String} */
        this.type = 'file'
        /** @type {String} */
        this.imageUrl = defaulImage
    }
}

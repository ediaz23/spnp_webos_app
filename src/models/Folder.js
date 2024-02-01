
import FileBase from './File'
import defaulImage from '../../assets/img/folder.png'


export default class Folder extends FileBase {
    constructor(obj) {
        super(obj)
        /** @type {Integer} */
        this.childCount = parseInt(obj.childCount)
        /** @type {Boolean} */
        this.searchable = obj.searchable === '1'
        /** @type {Integer} */
        this.storageUsed = obj.storageUsed
        this.type = 'folder'
        /** @type {String} */
        this.imageUrl = defaulImage
    }
}

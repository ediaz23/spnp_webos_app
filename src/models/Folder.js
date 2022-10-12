
import File from './File'


export default class Folder extends File {
    constructor(obj) {
        super(obj)
        /** @type {Integer} */
        this.childCount = parseInt(obj.childCount)
        /** @type {Boolean} */
        this.searchable = obj.searchable === '1'
        /** @type {Integer} */
        this.storageUsed = obj.storageUsed
        this.type = 'folder'
    }
}

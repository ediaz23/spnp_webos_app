
import Playable from './Playable'


export default class Music extends Playable {

    /**
     * @todo falta albumArtURI
     */
    constructor(obj) {
        super(obj)
        /** @type {String} */
        this.album = obj.album
        /** @type {String} */
        this.artist = obj.artist
        /** @type {String} */
        this.creator = obj.creator
        /** @type {String} */
        this.description = obj.description
        /** @type {String} */
        this.genre = obj.genre
        /** @type {Integer} */
        this.originalTrackNumber = obj.originalTrackNumber
        this.type = 'music'
    }
}

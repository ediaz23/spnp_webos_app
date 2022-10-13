
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import { useEffect, useState, useCallback } from 'react'
import { Header, Panel } from '@enact/moonstone/Panels'
import PropTypes from 'prop-types'
import MessagePanel from './MessagePanel'
import FileList from '../components/FileList'
import PathNavigate from '../components/PathNavigate'
import backend from '../api/backend'
import File from '../models/File'
import Folder from '../models/Folder'
import Image from '../models/Image'
import Music from '../models/Music'
import Video from '../models/Video'


const PANELS = {
    INIT: 0,
    SEARCHING: 1,
    EMPTY: 2,
    ERROR: 3,
    RESULT: 4,
}

/**
 * @param {Object} file
 * @returns {File}
 */
const toFile = file => {
    let out
    if (file.class === 'object.container.storageFolder') {
        out = new Folder(file)
    } else if (file.class === 'object.item.imageItem.photo') {
        out = new Image(file)
    } else if (file.class === 'object.item.videoItem') {
        out = new Video(file)
    } else if (file.class === 'object.item.audioItem.musicTrack') {
        out = new Music(file)
    } else {
        out = new File(file)
    }
    return out
}

/**
 * @param {File} a
 * @param {File} b
 * @returns {Integer}
 */
const sortFiles = (a, b) => {
    let out
    if (a.type === b.type) {
        out = a.title.localeCompare(b.title)
    } else {
        if (a.type === 'folder') {
            out = -1
        } else if (b.type === 'folder') {
            out = 1
        } else {
            out = a.title.localeCompare(b.title)
        }
    }
    return out
}


/**
 * @param {Object} obj
 * @param {import('../types').Device} obj.device
 * @param {Object} obj.rest
 */
const FilePanel = ({ title, titleBelow, spotlightId, onClick, device, ...rest }) => {

    /** @type {[files: Array<File>, setDevices: Function]}  */
    const [files, setFiles] = useState([])
    /** @type {[currentFolder: Folder, setCurrentFolder: Function]} */
    const [currentFolder, setCurrentFolder] = useState(null)
    /** @type {[path: Array<Folder>, setPath: function]} */
    let [path, setPath] = useState([])
    const [panelIndex, setPanelIndex] = useState(0)

    const fetchData = useCallback(async () => {
        setPanelIndex(PANELS.SEARCHING)
        const filter = { deviceId: device.id }
        if (currentFolder) {
            filter.id = currentFolder.id
        }
        const { files: data } = await backend.browse(filter)

        if (data && data.length) {
            /** @type {Array<File>} */
            const newData = data.map(toFile)
            setFiles(newData.sort(sortFiles))
            setPanelIndex(PANELS.RESULT)
        } else {
            setPanelIndex(PANELS.EMPTY)
        }
    }, [device, currentFolder])

    const pushFolder = useCallback(folder => {
        path.push(folder)
        setCurrentFolder(folder)
    }, [path])

    const popFolder = useCallback(event => {
        const { folderId } = event.currentTarget.dataset
        const index = path.findIndex(folder => folder.id === folderId)
        if (index === -1) {
            setCurrentFolder(null)
        } else {
            setCurrentFolder(path[index])
        }
        if (index < path.length - 1) {
            setPath(path.splice(0, index))
        }
    }, [path])

    useEffect(() => {
        fetchData().catch(error => {
            console.error('Error fetching devices')
            console.error(error)
            setPanelIndex(PANELS.ERROR)
        })
    }, [fetchData])

    return (
        <Panel {...rest}>
            <Header title={title} titleBelow={titleBelow} />
            <PathNavigate path={path} popFolder={popFolder} />
            {panelIndex === PANELS.INIT &&
                <MessagePanel message="Hellow" />}
            {panelIndex === PANELS.SEARCHING &&
                <MessagePanel message="Searching files." />}
            {panelIndex === PANELS.EMPTY &&
                <MessagePanel message="No file was found." />}
            {panelIndex === PANELS.ERROR &&
                <MessagePanel message="Error searching files." />}
            {panelIndex === PANELS.RESULT &&
                <FileList id={spotlightId} files={files}
                    index={rest['data-index']} onClick={onClick}
                    pushFolder={pushFolder} />
            }
        </Panel>
    )
}

FilePanel.propTypes = {
    title: PropTypes.string,
    titleBelow: PropTypes.string,
    spotlightId: PropTypes.string,
    onClick: PropTypes.func,
    device: PropTypes.object
}

export default MoonstoneDecorator(FilePanel)


import { useEffect, useState, useCallback } from 'react'
import Spinner from '@enact/moonstone/Spinner'
import Popup from '@enact/moonstone/Popup'
import { Header, Panel } from '@enact/moonstone/Panels'
import { Cell, Column, Row } from '@enact/ui/Layout'
import IconButton from '@enact/moonstone/IconButton'
import Input from '@enact/moonstone/Input'
import $L from '@enact/i18n/$L'
import PropTypes from 'prop-types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { deviceState, filePathState, searchState, filesState } from '../recoilConfig'
import FileList from '../components/FileList'
import PathNavigate from '../components/PathNavigate'
import backend from '../api/backend'
import File from '../models/File'
import Folder from '../models/Folder'
import Image from '../models/Image'
import Music from '../models/Music'
import Video from '../models/Video'


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
    let out = -1
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
 * @param  obj.device
 * @param {Object} obj.rest
 */
const FilePanel = ({ spotlightId, title, titleBelow, ...rest }) => {
    /** @type {import('../types').Device} */
    const device = useRecoilValue(deviceState)
    /** @type {[files: Array<File>, setDevices: Function]}  */
    const [files, setFiles] = useRecoilState(filesState)
    /** @type {Array<Folder>} */
    const filePath = useRecoilValue(filePathState)
    /** @type {Folder} */
    const currentFolder = filePath.length ? filePath[filePath.length - 1] : null
    /** @type {[search: String, setSearch: Function]}  */
    const [search, setSearch] = useRecoilState(searchState)
    /** @type {[value: String, setValue: Function]}  */
    const [value, setValue] = useState(search)
    /** @type {[isLoading: Boolean, setIsLoading: Function]}  */
    const [isLoading, setIsLoading] = useState(true)
    /** @type {[message: String, setMessage: Function]}  */
    const [message, setMessage] = useState('')

    const setResult = useCallback((data) => {
        if (data && data.length) {
            /** @type {Array<File>} */
            const newData = data.map(toFile)
            setFiles(newData.sort(sortFiles))
        } else {
            setFiles([])
            setMessage($L('No file was found.'))
        }
    }, [setFiles])

    const handelError = useCallback(error => {
        console.error('Error fetching devices')
        console.error(error)
        setMessage($L('Error searching files.'))
    }, [setMessage])

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const filter = { device }
            if (currentFolder) {
                filter.id = currentFolder.id
            }
            const res = await backend.browse(filter)
            setResult(res.files)
        } catch (error) { handelError(error) }
        finally { setIsLoading(false) }
    }, [device, currentFolder, setResult, handelError])

    const searchButton = useCallback(async () => {
        setIsLoading(true)
        try {
            const filter = { device, query: value }
            if (currentFolder) {
                filter.id = currentFolder.id
            }
            const res = await backend.search(filter)
            setResult(res.files)
            setSearch(value)
        } catch (error) { handelError(error) }
        finally { setIsLoading(false) }
    }, [value, device, currentFolder, setResult, setSearch, handelError])

    const handleChange = useCallback((ev) => { setValue(ev.value) }, [])
    const handleOnClose = useCallback(() => { setMessage('') }, [])
    const refreshData = useCallback(() => {
        fetchData()
        setSearch('')
    }, [fetchData, setSearch])

    useEffect(() => { fetchData() }, [fetchData])

    return (
        <Panel {...rest}>
            <Header title={title} titleBelow={titleBelow} >
                <Input placeholder={$L('Search')} value={value} onChange={handleChange} />
                <IconButton size="small" onClick={searchButton}>search</IconButton>
                <IconButton size="small" onClick={refreshData}>refresh</IconButton>
            </Header>
            <Row style={{ height: '100%' }}>
                <Cell>
                    <Column>
                        <Cell shrink>
                            <PathNavigate />
                        </Cell>
                        <Cell>
                            {isLoading &&
                                <Spinner transparent centered>{$L('Loading...')}</Spinner>
                            }
                            {!isLoading && files.length > 0 &&
                                <FileList id={spotlightId} files={files}
                                    index={rest['data-index']} />
                            }
                        </Cell>
                    </Column>
                </Cell>
            </Row>
            <Popup onClose={handleOnClose} open={!!message} showCloseButton>
                {message}
            </Popup>
        </Panel>
    )
}

FilePanel.propTypes = {
    spotlightId: PropTypes.string,
    title: PropTypes.string,
    titleBelow: PropTypes.string,
}

export default FilePanel

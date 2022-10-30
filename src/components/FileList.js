
import { useCallback } from 'react'
import VirtualList from '@enact/moonstone/VirtualList'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import { pathState, fileState, filePathState } from '../recoilConfig'
import back from '../back'
import FileListItem from './FileListItem'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<import('../models/File').default>} obj.files
 * @param {Object} obj.rest
 */
const FileList = ({ id, files, ...rest }) => {

    const setPath = useSetRecoilState(pathState)
    const setFile = useSetRecoilState(fileState)
    const setFilePath = useSetRecoilState(filePathState)

    const selectItem = useCallback(event => {
        /** @type {import('../models/File').default} */
        const file = files[parseInt(event.currentTarget.dataset.index)]
        if (file.type !== 'folder') {
            setFile(file)
            setPath('/player')
            back.pushHistory({ doBack: () => setPath('/home') })
        } else {
            setFilePath(oldList => {
                if (oldList.length) {
                    back.replaceHistory({ doBack: () => back.backPath([...oldList], setFilePath) })
                } else {
                    back.pushHistory({ doBack: () => setFilePath([]) })
                }
                return [...oldList, file]
            })
        }
    }, [files, setFile, setPath, setFilePath])

    const renderItem = useCallback(({ index }) => {
        const currentIndex = index << 1
        return (
            <div key={'row' + index}>
                <FileListItem itemIndex={currentIndex} selectItem={selectItem}
                    file={files[currentIndex]} />
                {currentIndex + 1 < files.length &&
                    <FileListItem itemIndex={currentIndex + 1} selectItem={selectItem}
                        file={files[currentIndex + 1]} />}
            </div>
        )
    }, [files, selectItem])
    const size = (files.length >> 1) + (files.length & 1)
    return (
        <VirtualList
            {...rest}
            dataSize={size}
            focusableScrollbar
            id={id}
            itemRenderer={renderItem}
            itemSize={ri.scale(100)}
            spotlightId={id}
            spacing={ri.scale(15)}
        />
    )
}

FileList.propTypes = {
    id: PropTypes.string,
    files: PropTypes.array,
}

export default FileList

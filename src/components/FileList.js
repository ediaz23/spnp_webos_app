
import { useCallback, useEffect, useRef } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import { pathState, fileIndexState, filePathState } from '../recoilConfig'
import back from '../back'
import FileListItem from './FileListItem'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<import('../models/File').default>} obj.files
 * @param {Object} obj.rest
 */
const FileList = ({ id, files, ...rest }) => {

    const scrollToRef = useRef(null)
    const setPath = useSetRecoilState(pathState)
    const setFileIndex = useSetRecoilState(fileIndexState)
    const setFilePath = useSetRecoilState(filePathState)

    useEffect(() => {
        scrollToRef.current({ index: 0, animate: false, focus: true })
    })
    const getScrollTo = useCallback((scrollTo) => {
        scrollToRef.current = scrollTo
    }, [])
    const selectItem = useCallback(event => {
        const index = parseInt(event.currentTarget.dataset.index)
        /** @type {import('../models/File').default} */
        const file = files[index]
        if (file.type !== 'folder') {
            setFileIndex(index)
            setPath('/player')
            back.pushHistory({ doBack: () => setPath('/home') })
        } else {
            setFilePath(oldList => {
                if (oldList.length) {
                    back.replaceHistory({ doBack: () => { back.backPath([...oldList], setFilePath) } })
                } else {
                    back.pushHistory({ doBack: () => setFilePath([]) })
                }
                return [...oldList, file]
            })
        }
    }, [files, setFileIndex, setPath, setFilePath])

    const renderItem = useCallback(({ index, ...restProps }) => (
        <FileListItem key={index} selectItem={selectItem}
            file={files[index]} {...restProps} />
    ), [files, selectItem])
    return (
        <VirtualGridList
            {...rest}
            dataSize={files.length}
            focusableScrollbar
            id={id}
            itemRenderer={renderItem}
            itemSize={{ minHeight: ri.scale(100), minWidth: ri.scale(840) }}
            spotlightId={id}
            spacing={ri.scale(15)}
            cbScrollTo={getScrollTo}
        />
    )
}

FileList.propTypes = {
    id: PropTypes.string,
    files: PropTypes.array,
}

export default FileList

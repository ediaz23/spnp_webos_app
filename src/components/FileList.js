
import { useCallback, useEffect, useRef } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { pathState, fileIndexState } from '../recoilConfig'
import useSetFilePath from '../hooks/setFilePath'
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
    /** @type {Function} */
    const setPath = useSetRecoilState(pathState)
    /** @type {[Number, Function]} */
    const [fileIndex, setFileIndex] = useRecoilState(fileIndexState)
    /** @type {Function} */
    const setFilePath = useSetFilePath()

    const getScrollTo = useCallback((scrollTo) => { scrollToRef.current = scrollTo }, [])
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
                    back.replaceHistory({ doBack: () => back.backPath([...oldList], setFilePath) })
                } else {
                    back.pushHistory({ doBack: () => { setFilePath([]) } })
                }
                return [...oldList, file]
            })
            setFileIndex(0)
        }
    }, [files, setFileIndex, setPath, setFilePath])

    const renderItem = useCallback(({ index, ...restProps }) => (
        <FileListItem key={index} selectItem={selectItem}
            file={files[index]} {...restProps} />
    ), [files, selectItem])

    useEffect(() => { scrollToRef.current({ index: fileIndex, animate: false, focus: true }) })

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

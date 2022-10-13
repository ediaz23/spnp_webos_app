
import { useCallback } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import GridListImageItem from '@enact/moonstone/GridListImageItem'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import { pathState, fileState, filePathState } from '../recoilConfig'


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
        } else {
            setFilePath(oldList => [...oldList, file])
        }
    }, [files, setFile, setPath, setFilePath])

    const renderItem = useCallback(({ index, ...restProps }) => (
        <GridListImageItem
            {...restProps}
            caption={files[index].title}
            source={files[index].imageUrl}
            index={index}
            onClick={selectItem}
        />
    ), [files, selectItem])

    return (
        <VirtualGridList
            {...rest}
            dataSize={files.length}
            focusableScrollbar
            id={id}
            itemRenderer={renderItem}
            itemSize={{ minWidth: ri.scale(250), minHeight: ri.scale(250) }}
            spotlightId={id}
            style={{
                height: '100%'
            }}
            spacing={ri.scale(21)}
        />
    )
}

FileList.propTypes = {
    id: PropTypes.string,
    files: PropTypes.array,
}

export default FileList


import { useCallback } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import GridListImageItem from '@enact/moonstone/GridListImageItem'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import File from '../models/File'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<File>} obj.files
 * @param {Function} obj.onClick
 * @param {Object} obj.rest
 */
const FileList = ({ id, files, onClick, ...rest }) => {

    const renderItem = useCallback(({ index, ...restProps }) => (
        <GridListImageItem
            {...restProps}
            caption={files[index].title}
            source={files[index].imageUrl}
            index={index}
        />
    ), [files])

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
    onClick: PropTypes.func,
}

export default FileList

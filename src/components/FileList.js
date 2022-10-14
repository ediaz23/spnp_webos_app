
import { useCallback } from 'react'
import VirtualList from '@enact/moonstone/VirtualList'
import Item from '@enact/moonstone/Item'
import Image from '@enact/moonstone/Image'
import BodyText from '@enact/moonstone/BodyText'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import { pathState, fileState, filePathState } from '../recoilConfig'
import css from './FileList.module.less'


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

    const renderItem = useCallback(({ index, ...restProps }) => {

        const cleanDuration = str => str.split('.')[0]
        /** @param {import('../models/File').default} file */
        const simple = file => (<BodyText className={css.caption}>{file.title}</BodyText>)
        /** @param {import('../models/Playable').default} file */
        const playable = file => (
            <div className={css.caption}>
                <BodyText>{file.title}</BodyText>
                <BodyText>{cleanDuration(file.res.duration)}</BodyText>
            </div>
        )
        return (
            <Item {...restProps}
                className={css.item}
                index={index}
                onClick={selectItem}>
                <Image className={css.image}
                    src={files[index].imageUrl}
                    style={{ maxHeight: 100, maxWidth: 100 }} />
                {['folder', 'image'].includes(files[index].type) && simple(files[index])}
                {['video', 'music'].includes(files[index].type) && playable(files[index])}
            </Item>
        )
    }, [files, selectItem])
    return (
        <VirtualList
            className={css.fileList}
            {...rest}
            dataSize={files.length}
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

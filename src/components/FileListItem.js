
import kind from '@enact/core/kind'
import PropTypes from 'prop-types'
import Item from '@enact/moonstone/Item'
import Image from '@enact/moonstone/Image'
import BodyText from '@enact/moonstone/BodyText'
import css from './FileListItem.module.less'


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

const FileListItem = kind({
    name: 'FileListItem',

    propTypes: {
        itemIndex: PropTypes.number,
        selectItem: PropTypes.func,
        file: PropTypes.object,
    },

    render: ({ itemIndex, selectItem, file, ...rest }) => {
        return (
            <Item key={itemIndex}
                data-index={itemIndex}
                className={css.item}
                index={itemIndex}
                onClick={selectItem} {...rest}>
                <Image className={css.image}
                    src={file.imageUrl}
                    style={{ maxHeight: 100, maxWidth: 100 }} />
                {['folder', 'image'].includes(file.type) && simple(file)}
                {['video', 'music'].includes(file.type) && playable(file)}
            </Item>
        )
    }
})

export default FileListItem

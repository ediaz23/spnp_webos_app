
import kind from '@enact/core/kind'
import PropTypes from 'prop-types'
import Item from '@enact/moonstone/Item'
import Image from '@enact/moonstone/Image'
import BodyText from '@enact/moonstone/BodyText'
import { Row, Cell } from '@enact/ui/Layout'
import css from './FileListItem.module.less'


const cleanDuration = str => str.split('.')[0]
/** @param {import('../models/File').default} file */
const simple = file => (
    <div className={css.caption}>
        <BodyText>{file.title}</BodyText>
    </div>
)
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
        selectItem: PropTypes.func,
        file: PropTypes.object
    },

    render: ({ selectItem, file, ...rest }) => {
        return (
            <Item onClick={selectItem} {...rest}>
                <Row>
                    <Cell shrink>
                        <Image className={css.image}
                            src={file.imageUrl}
                            style={{ maxHeight: 100, maxWidth: 100 }} />
                    </Cell>
                    <Cell align="center">
                        {['folder', 'image'].includes(file.type) && simple(file)}
                        {['video', 'music'].includes(file.type) && playable(file)}
                    </Cell>
                </Row>
            </Item>
        )
    }
})

export default FileListItem

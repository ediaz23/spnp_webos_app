
import kind from '@enact/core/kind'
import PropTypes from 'prop-types'
import Item from '@enact/moonstone/Item'
import Image from '@enact/moonstone/Image'
import { Row, Cell, Column } from '@enact/ui/Layout'
import css from './FileListItem.module.less'


const cleanDuration = str => str.split('.')[0]

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
                        <Column>
                            <Cell>{file.title}</Cell>
                            {['video', 'music'].includes(file.type) &&
                                <Cell>{cleanDuration(file.res.duration)}</Cell>}
                        </Column>
                    </Cell>
                </Row>
            </Item>
        )
    }
})

export default FileListItem


import PropTypes from 'prop-types'
import Image from '@enact/moonstone/Image'
import Marquee from '@enact/moonstone/Marquee'
import Spottable from '@enact/spotlight/Spottable'
import Skinnable from '@enact/moonstone/Skinnable'
import { Row, Cell, Column } from '@enact/ui/Layout'
import css from './FileListItem.module.less'


const cleanDuration = str => str.split('.')[0]
const CellItem = Spottable(Skinnable(Cell))

const FileListItem = ({ selectItem, file, ...rest }) => {

    return (
        <CellItem onClick={selectItem} {...rest}>
            <Row>
                <Cell shrink>
                    <Image className={css.image}
                        src={file.imageUrl}
                        style={{ maxHeight: 100, maxWidth: 100 }} />
                </Cell>
                <Cell align="center">
                    <Column>
                        <Cell>
                            <Marquee marqueeOn='render'>{file.title}</Marquee>
                        </Cell>
                        {['video', 'music'].includes(file.type) &&
                            <Cell>{cleanDuration(file.res.duration)}</Cell>}
                    </Column>
                </Cell>
            </Row>
        </CellItem>
    )
}

FileListItem.propTypes = {
    selectItem: PropTypes.func,
    file: PropTypes.object
}

export default FileListItem


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

    const cellSize = ['video', 'music'].includes(file.type) ? '50%' : '100%'

    return (
        <CellItem onClick={selectItem} {...rest}>
            <Row id="Row">
                <Cell shrink id="cell1">
                    <Image className={css.image}
                        src={file.imageUrl}
                        style={{ maxHeight: 100, maxWidth: 100 }} />
                </Cell>
                <Cell align="center" id="cell2">
                    <Column id="colunm">
                        <Cell id="cell3" size={cellSize}>
                            <Marquee marqueeOn='render'>{file.title}</Marquee>
                        </Cell>
                        {['video', 'music'].includes(file.type) &&
                            <Cell id="cell4" size={cellSize}>
                                {cleanDuration(file.res.duration)}
                            </Cell>
                        }
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

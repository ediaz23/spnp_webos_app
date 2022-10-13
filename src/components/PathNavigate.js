
import Item from '@enact/moonstone/Item'
import PropTypes from 'prop-types'
import css from './PathNavigate.module.less'


/**
 * @param {Object} obj
 * @param {Array<import('../models/Folder').default>} obj.path
 * @param {Function} obj.popFolder
 * @param {Object} obj.rest
 */
const PathNavigate = ({ path, popFolder, ...rest }) => {

    const items = []
    let key = 1
    items.push((
        <Item {...rest} key={key - 1} onClick={popFolder}
            data-folder-id={'-1'}>
            Media Folder
        </Item>
    ))
    for (const folder of path) {
        items.push((<div key={key}>/</div>))
        items.push((
            <Item {...rest} key={key + 1} onClick={popFolder}
                data-folder-id={folder.id}>
                {folder.title}
            </Item>
        ))
        key += 2
    }
    return (
        <div className={css.pathNaviate}>
            {items}
        </div>
    )
}

PathNavigate.propTypes = {
    path: PropTypes.array,
    popFolder: PropTypes.func,
}

export default PathNavigate

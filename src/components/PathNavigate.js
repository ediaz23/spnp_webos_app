
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import Item from '@enact/moonstone/Item'
import css from './PathNavigate.module.less'
import { filePathState } from '../recoilConfig'


/**
 * @param {Object} rest
 */
const PathNavigate = ({ ...rest }) => {
    /** @type {[filePath: Array<import('../models/Folder').default>, setFilePath: function]} */
    const [filePath, setFilePath] = useRecoilState(filePathState)
    const items = []
    let key = 1
    const popFolder = useCallback(event => {
        const { folderId } = event.currentTarget.dataset
        const index = filePath.findIndex(folder => folder.id === folderId)
        if (index === -1) {
            setFilePath([])
        } else if (index + 1 < filePath.length) {
            setFilePath(filePath.slice(0, index + 1))
        }
    }, [filePath, setFilePath])
    items.push((
        <Item {...rest} key={key - 1} onClick={popFolder}
            data-folder-id={'-1'}>
            Media Folder
        </Item>
    ))
    for (const folder of filePath) {
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

export default PathNavigate

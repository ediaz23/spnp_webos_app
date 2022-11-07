
import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import Item from '@enact/moonstone/Item'
import css from './PathNavigate.module.less'
import { filePathState, deviceState } from '../recoilConfig'
import useSetFilePath from '../hooks/setFilePath'
import back from '../back'


/**
 * @param {Object} rest
 */
const PathNavigate = ({ ...rest }) => {
    /** @type {import('../types').Device} */
    const device = useRecoilValue(deviceState)
    /** @type {Array<import('../models/Folder').default>} */
    const filePath = useRecoilValue(filePathState)
    const setFilePath = useSetFilePath()
    const items = []
    let key = 1
    const popFolder = useCallback(event => {
        const { folderId } = event.currentTarget.dataset
        const index = filePath.findIndex(folder => folder.id === folderId)
        if (index === -1) {
            setFilePath([])
        } else if (index + 1 < filePath.length) {
            const backList = filePath.slice(0, index)
            setFilePath(filePath.slice(0, index + 1))
            back.replaceHistory({ doBack: () => back.backPath(backList, setFilePath) })
        }
    }, [filePath, setFilePath])
    items.push((
        <Item {...rest} key={key - 1} onClick={popFolder}
            data-folder-id={'-1'}>
            {device.name}
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

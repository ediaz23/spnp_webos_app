
import { useCallback } from 'react'
import { ActivityPanels } from '@enact/moonstone/Panels'
import $L from '@enact/i18n/$L'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import DevicePanel from './DevicePanel'
import FilePanel from './FilePanel'
import { homeIndexState } from '../recoilConfig'
import css from './HomePanel.module.less'
import back from '../back'


const HomePanel = ({ spotlightId, ...rest }) => {
    const [homeIndex, setHomeIndex] = useRecoilState(homeIndexState)
    const handleBreadcrumb = useCallback(event => {
        if (event.type === 'onSelect') {
            back.popHistory()
            setHomeIndex(event.index)
        }
    }, [setHomeIndex])

    delete rest.hideChildren
    rest.className += ' ' + css.home
    return (
        <ActivityPanels id={spotlightId} index={homeIndex}
             {...rest} onSelectBreadcrumb={handleBreadcrumb}>
            <DevicePanel title={$L('Media Storage')}
                titleBelow={$L('Select Storage')} {...rest} />
            <FilePanel title={$L('Media Storage')}
                titleBelow={$L('Folder')} {...rest} />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    spotlightId: PropTypes.string,
}

export default HomePanel

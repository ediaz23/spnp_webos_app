
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
import utils from '../utils'


const HomePanel = ({ spotlightId, ...rest }) => {
    /** @type {[Number, Function]} */
    const [homeIndex, setHomeIndex] = useRecoilState(homeIndexState)
    const handleBreadcrumb = useCallback(event => {
        if (event.type === 'onSelect') {
            back.popHistory()
            setHomeIndex(event.index)
        }
    }, [setHomeIndex])

    const closeApp = useCallback(() => {
        if (utils.isTv()) {
            window.close()
        }
    }, [])
    delete rest.hideChildren
    const newRest = { ...rest }
    newRest.className = rest.className + ' ' + css.home
    return (
        <ActivityPanels id={spotlightId} index={homeIndex}
            {...rest} onSelectBreadcrumb={handleBreadcrumb}
            onApplicationClose={closeApp}>
            <DevicePanel title={$L('Media Storage')}
                titleBelow={$L('Select Storage')} {...newRest} />
            <FilePanel title={$L('Media Storage')}
                titleBelow={$L('Folder')} {...rest} />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    spotlightId: PropTypes.string,
}

export default HomePanel

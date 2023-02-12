
import { useCallback } from 'react'
import { ActivityPanels } from '@enact/moonstone/Panels'
import $L from '@enact/i18n/$L'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import DevicePanel from './DevicePanel'
import FilePanel from './FilePanel'
import ContactMePanel from './ContactMePanel'
import { homeIndexState } from '../recoilConfig'
import css from './HomePanel.module.less'
import back from '../back'
import utils from '../utils'


const HomePanel = ({ spotlightId, ...rest }) => {
    /** @type {[Number, Function]} */
    const [homeIndex, setHomeIndex] = useRecoilState(homeIndexState)
    const handleBreadcrumb = useCallback(event => {
        if (event.type === 'onSelect') {
            const state = back.popHistory()
            if (homeIndex === 1) {
                setHomeIndex(event.index)
            } else {
                state.doBack()
            }
        }
    }, [setHomeIndex, homeIndex])

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
            <ContactMePanel title={$L('Contact Information')}
                titleBelow={$L('About me')} {...rest}  />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    spotlightId: PropTypes.string,
}

export default HomePanel


import { useCallback } from 'react'
import { ActivityPanels } from '@enact/moonstone/Panels'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import $L from '@enact/i18n/$L'
import DevicePanel from './DevicePanel'
import FilePanel from './FilePanel'
import { homeIndexState } from '../recoilConfig'
import css from './HomePanel.module.less'


const HomePanel = ({ spotlightId, ...rest }) => {
    const [homeIndex, setHomeIndex] = useRecoilState(homeIndexState)
    const handleBreadcrumb = useCallback(({ index }) => {
        setHomeIndex(index)
    }, [setHomeIndex])

    delete rest.hideChildren
    rest.className += ' ' + css.home
    return (
        <ActivityPanels id={spotlightId} index={homeIndex}
            onSelectBreadcrumb={handleBreadcrumb} {...rest}>
            <DevicePanel title={$L('Media Storage')}
                titleBelow="Select Storage" {...rest} />
            <FilePanel title="Media Storage"
                titleBelow="Folder" {...rest} />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    spotlightId: PropTypes.string,
}

export default HomePanel

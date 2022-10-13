
import { useCallback } from 'react'
import { ActivityPanels } from '@enact/moonstone/Panels'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
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
            <DevicePanel title="Storage Media"
                titleBelow="Select Storage" {...rest} />
            <FilePanel title="Storage Media"
                titleBelow="Folder" {...rest} />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    spotlightId: PropTypes.string,
}

export default HomePanel


import { ActivityPanels } from '@enact/moonstone/Panels'
import PropTypes from 'prop-types'
import DevicePanel from './DevicePanel'
import FilePanel from './FilePanel'
import css from './HomePanel.module.less'


const HomePanel = ({ spotlightId, currentIndex, currentDevice, changePanel, handleBreadcrumb, ...rest }) => {
    delete rest.hideChildren
    rest.className += ' ' + css.home
    return (
        <ActivityPanels id={spotlightId} index={currentIndex}
            onSelectBreadcrumb={handleBreadcrumb} {...rest}>
            <DevicePanel title="Storage Media"
                titleBelow="Select Storage" {...rest}
                onClick={changePanel} />
            <FilePanel device={currentDevice} title="Storage Media"
                titleBelow="Folder" {...rest}
                onClick={changePanel} />
        </ActivityPanels>
    )
}

HomePanel.propTypes = {
    currentIndex: PropTypes.number,
    currentDevice: PropTypes.object,
    changePanel: PropTypes.func,
    handleBreadcrumb: PropTypes.func,
}

export default HomePanel

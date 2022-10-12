
import { useCallback, useState } from 'react'
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import { ActivityPanels } from '@enact/moonstone/Panels'

import DevicePanel from '../views/DevicePanel'
import FilePanel from '../views/FilePanel'
import './attachErrorHandler'
import css from './App.module.less';


const App = ({ ...rest }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentDevice, setCurrentDevice] = useState(null)
    const handleSelectBreadcrumb = useCallback(({ index }) => {
        setCurrentIndex(index)
    }, [])
    const changePanel = useCallback(device => {
        setCurrentDevice(device)
        setCurrentIndex(1)
    }, [])
    rest.className += ' ' + css.app
    return (
        <ActivityPanels index={currentIndex} onSelectBreadcrumb={handleSelectBreadcrumb} {...rest}>
            <DevicePanel title="Storage Media"
                titleBelow="Select Storage" {...rest}
                onClick={changePanel}/>
            <FilePanel device={currentDevice} title="Storage Media"
                titleBelow="Folder" {...rest}
                onClick={() => {}} />
        </ActivityPanels>
    )
}

export default MoonstoneDecorator(App)

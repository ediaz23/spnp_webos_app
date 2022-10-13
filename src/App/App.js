
import { useCallback, useState } from 'react'
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import { Panels, Routable, Route } from '@enact/moonstone/Panels'
import HomePanel from '../views/HomePanel'
import PlayerPanel from '../views/PlayerPanel'
import './attachErrorHandler'


const RoutablePanels = Routable({ navigate: 'onBack' }, Panels)

const App = ({ ...rest }) => {
    const [path, setPath] = useState('/home')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentDevice, setCurrentDevice] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)
    const handleBreadcrumb = useCallback(({ index }) => {
        setCurrentIndex(index)
    }, [])
    const changePanel = useCallback(({ device, file }) => {
        if (device) {
            setCurrentDevice(device)
            setCurrentIndex(1)
        } else if (file) {
            setCurrentFile(file)
            setPath('/player')
        } else {
            setPath('/home')
        }
    }, [])
    const props = { currentIndex, currentDevice, changePanel, handleBreadcrumb }
    return (
        <RoutablePanels {...rest} path={path}>
            <Route path='home' component={HomePanel} {...props} {...rest} />
            <Route path='player' component={PlayerPanel} file={currentFile}
                changePanel={changePanel} {...rest} />
        </RoutablePanels>
    )
}

export default MoonstoneDecorator(App)

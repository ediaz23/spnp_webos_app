
import { useEffect, useState, useCallback } from 'react'
import { Header, Panel, Routable, Panels, Route } from '@enact/moonstone/Panels'
import { SlideLeftArranger } from '@enact/ui/ViewManager'
import PropTypes from 'prop-types'
import DeviceList from './DeviceList'
import MessagePanel from './MessagePanel'
import backend from '../api/backend'


const RoutablePanels = Routable({ navigate: 'onBack' }, Panels)

const PANELS = {
    INIT: 0,
    SEARCH_DEVICE: 1,
    EMPTY_DEVICE: 2,
    ERROR: 3,
    DEVICES: 4,
}

const MainPanel = ({ title, titleBelow, spotlightId, path, ...rest }) => {
    /** @type {[devices: Array, setDevices: Function]}  */
    const [devices, setDevices] = useState([])
    const [panelIndex, setPanelIndex] = useState(0)

    const fetchData = useCallback(async () => {
        setPanelIndex(PANELS.SEARCH_DEVICE)

        await backend.startSsdp()
        const { devices: data } = await backend.searchDevices()
        if (data && data.length) {
//            setDevices(data)
            const data2 = []
            const ejemplo = {
                id: "1",
                location: "http://192.168.0.7:8200/rootDesc.xml",
                name: "esteban-pc: minidlna",
            }
            for (let i = 0; i < 10; ++i) {
                const d = {...ejemplo}
                d.id = '' + i
                d.name += ' ' + i
                data2.push(d)
            }
            setDevices(data2)
            setPanelIndex(PANELS.DEVICES)
        } else {
            setPanelIndex(PANELS.EMPTY_DEVICE)
        }
    }, [])

    useEffect(() => {
        fetchData().catch(error => {
            console.error('Error fetching devices')
            console.error(error)
            setPanelIndex(PANELS.ERROR)
        })
    }, [fetchData])
    return (
        <Panel {...rest}>
            <Header title={title} titleBelow={titleBelow} />
            {panelIndex === PANELS.INIT &&
                <MessagePanel message="Hellow" />}
            {panelIndex === PANELS.SEARCH_DEVICE &&
                <MessagePanel message="Searching devices." />}
            {panelIndex === PANELS.EMPTY_DEVICE &&
                <MessagePanel message="No device was found." />}
            {panelIndex === PANELS.ERROR &&
                <MessagePanel message="Error Searching devices." />}
            {panelIndex === PANELS.DEVICES &&
                <DeviceList id={spotlightId} devices={devices}
                        index={rest['data-index']} onClick={() => { }}/>
            }
        </Panel>
    )
}

MainPanel.propTypes = {
    title: PropTypes.string,
    titleBelow: PropTypes.string,
    path: PropTypes.string
}

MainPanel.defaultProps = {
    path: 'devices'
}

export default MainPanel

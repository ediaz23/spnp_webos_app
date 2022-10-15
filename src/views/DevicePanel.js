
import { useEffect, useState, useCallback } from 'react'
import { Header, Panel } from '@enact/moonstone/Panels'
import $L from '@enact/i18n/$L'
import PropTypes from 'prop-types'
import MessagePanel from './MessagePanel'
import backend from '../api/backend'
import DeviceList from '../components/DeviceList'
import wifi0 from '../../assets/img/wifi.png'
import wifi1 from '../../assets/img/wifi1.png'
import wifi2 from '../../assets/img/wifi2.png'
import wifi3 from '../../assets/img/wifi3.png'


const wifiImg = [wifi0, wifi1, wifi2, wifi3]
const PANELS = {
    INIT: 0,
    SEARCHING: 1,
    EMPTY: 2,
    ERROR: 3,
    RESULT: 4,
}

const DevicePanel = ({ spotlightId, title, titleBelow, ...rest }) => {
    /** @type {[devices: Array, setDevices: Function]}  */
    const [devices, setDevices] = useState([])
    const [panelIndex, setPanelIndex] = useState(0)

    const fetchData = useCallback(async () => {
        setPanelIndex(PANELS.SEARCHING)

        await backend.startSsdp()
        const { devices: data } = await backend.searchDevices()
        if (data && data.length) {
            setDevices(data.map((dev, index) => {
                return { ...dev, image: wifiImg[index % wifiImg.length], source: 'wifi' }
            }))
            setPanelIndex(PANELS.RESULT)
        } else {
            setPanelIndex(PANELS.EMPTY)
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
                <MessagePanel message={$L('Hellow')} />}
            {panelIndex === PANELS.SEARCHING &&
                <MessagePanel message={$L('Searching devices.')} />}
            {panelIndex === PANELS.EMPTY &&
                <MessagePanel message={$L('No device was found.')} />}
            {panelIndex === PANELS.ERROR &&
                <MessagePanel message={$L('Error searching devices.')} />}
            {panelIndex === PANELS.RESULT &&
                <DeviceList id={spotlightId} devices={devices}
                    index={rest['data-index']} />
            }
        </Panel>
    )
}

DevicePanel.propTypes = {
    spotlightId: PropTypes.string,
    title: PropTypes.string,
    titleBelow: PropTypes.string,
}

export default DevicePanel

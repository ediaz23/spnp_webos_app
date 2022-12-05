
import { useEffect, useState, useCallback } from 'react'
import Spinner from '@enact/moonstone/Spinner'
import Popup from '@enact/moonstone/Popup'
import { Header, Panel } from '@enact/moonstone/Panels'
import $L from '@enact/i18n/$L'
import IconButton from '@enact/moonstone/IconButton'
import PropTypes from 'prop-types'
import backend from '../api/backend'
import DeviceList from '../components/DeviceList'
import wifi0 from '../../assets/img/wifi.png'
import wifi1 from '../../assets/img/wifi1.png'
import wifi2 from '../../assets/img/wifi2.png'
import wifi3 from '../../assets/img/wifi3.png'


const wifiImg = [wifi0, wifi1, wifi2, wifi3]


const DevicePanel = ({ spotlightId, title, titleBelow, ...rest }) => {
    /** @type {[Array, Function]}  */
    const [devices, setDevices] = useState([])
    /** @type {[Boolean, Function]}  */
    const [isLoading, setIsLoading] = useState(true)
    /** @type {[String, Function]}  */
    const [message, setMessage] = useState('')

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            await backend.startSsdp()
            const { devices: data } = await backend.searchDevices()
            if (data && data.length) {
                setDevices(data.map((dev, index) => {
                    return { ...dev, image: wifiImg[index % wifiImg.length], source: 'wifi' }
                }))
            } else {
                setDevices([])
                setMessage($L('No device was found.'))
            }
        } catch (error) {
            console.error('Error fetching devices')
            console.error(error)
            setMessage($L('Error searching devices.'))
        } finally { setIsLoading(false) }
    }, [])

    const handleOnClose = useCallback(() => { setMessage('') }, [])
    const refreshData = useCallback(() => { fetchData() }, [fetchData,])
    useEffect(() => { fetchData() }, [fetchData])

    return (
        <Panel {...rest}>
            <Header title={title} titleBelow={titleBelow}>
                <IconButton size="small" onClick={refreshData}>refresh</IconButton>
            </Header>
            {isLoading &&
                <Spinner transparent centered>{$L('Loading...')}</Spinner>
            }
            {!isLoading && devices.length > 0 &&
                <DeviceList id={spotlightId} devices={devices}
                    index={rest['data-index']} />
            }
            <Popup onClose={handleOnClose} open={!!message} showCloseButton>
                {message}
            </Popup>
        </Panel>
    )
}

DevicePanel.propTypes = {
    spotlightId: PropTypes.string,
    title: PropTypes.string,
    titleBelow: PropTypes.string,
}

export default DevicePanel

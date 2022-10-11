
import { useCallback } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import GridListImageItem from '@enact/moonstone/GridListImageItem'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import wifiImage from '../../assets/img/wifi.jpg'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<import('../types').Device>} obj.devices
 * @param {Function} obj.onClick
 * @param {Object} obj.rest
 */
const DeviceList = ({ id, devices, onClick, ...rest }) => {

    const renderItem = useCallback(({ index, ...restProps }) => (
        <GridListImageItem
            {...restProps}
            caption={devices[index].name}
            onClick={onClick}
            subCaption={'wifi'}
            source={wifiImage}
        />
    ), [onClick])

    return (
        <VirtualGridList
            {...rest}
            dataSize={devices.length}
            focusableScrollbar
            id={id}
            itemRenderer={renderItem}
            itemSize={{ minWidth: ri.scale(300), minHeight: ri.scale(270) }}
            spotlightId={id}
            style={{
                height: '100%'
            }}
        />
    )
}

DeviceList.propTypes = {
    id: PropTypes.string,
    devices: PropTypes.array,
    onClick: PropTypes.func,
}

export default DeviceList

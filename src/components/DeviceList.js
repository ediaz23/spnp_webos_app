
import { useCallback } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import GridListImageItem from '@enact/moonstone/GridListImageItem'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import imageCss from './DeviceList.module.less'
import { deviceState, homeIndexState, filePathState, searchState } from '../recoilConfig'
import back from '../back'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<import('../types').Device>} obj.devices
 * @param {Object} obj.rest
 */
const DeviceList = ({ id, devices, ...rest }) => {

    const setDevice = useSetRecoilState(deviceState)
    const setHomeIndex = useSetRecoilState(homeIndexState)
    const setFilePath = useSetRecoilState(filePathState)
    const setSearch = useSetRecoilState(searchState)

    const selectItem = useCallback(event => {
        const device = devices[parseInt(event.currentTarget.dataset.index)]
        setDevice(device)
        setFilePath([])
        setSearch('')
        setHomeIndex(1)
        back.pushHistory({ doBack: () => setHomeIndex(0) })
    }, [devices, setDevice, setHomeIndex, setFilePath, setSearch])

    const renderItem = useCallback(({ index, ...restProps }) => (
        <GridListImageItem
            {...restProps}
            caption={devices[index].name}
            onClick={selectItem}
            subCaption={devices[index].source}
            source={devices[index].image}
            index={index}
            css={{ image: imageCss.imageFix }}
        />
    ), [devices, selectItem])

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
}

export default DeviceList

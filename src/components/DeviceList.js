
import { useCallback, useEffect, useRef } from 'react'
import { VirtualGridList } from '@enact/moonstone/VirtualList'
import GridListImageItem from '@enact/moonstone/GridListImageItem'
import ri from '@enact/ui/resolution'
import PropTypes from 'prop-types'
import { useSetRecoilState } from 'recoil'
import imageCss from './DeviceList.module.less'
import { deviceState, homeIndexState, searchState } from '../recoilConfig'
import useSetFilePath from '../hooks/setFilePath'
import back from '../back'


/**
 * @param {Object} obj
 * @param {String} obj.id
 * @param {Array<import('../types').Device>} obj.devices
 * @param {Object} obj.rest
 */
const DeviceList = ({ id, devices, ...rest }) => {
    const scrollToRef = useRef(null)
    /** @type {Function} */
    const setDevice = useSetRecoilState(deviceState)
    /** @type {Function} */
    const setHomeIndex = useSetRecoilState(homeIndexState)
    /** @type {Function} */
    const setFilePath = useSetFilePath()
    /** @type {Function} */
    const setSearch = useSetRecoilState(searchState)

    const getScrollTo = useCallback((scrollTo) => { scrollToRef.current = scrollTo }, [])
    const selectItem = useCallback(event => {
        const index = parseInt(event.currentTarget.dataset.index)
        const device = devices[index]
        setDevice(device)
        setFilePath([])
        setSearch('')
        setHomeIndex(1)
        back.pushHistory({
            doBack: () => {
                setHomeIndex(0)
                scrollToRef.current({ index, animate: false, focus: true })
            }
        })
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

    useEffect(() => { scrollToRef.current({ index: 0, animate: false, focus: true }) })

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
            cbScrollTo={getScrollTo}
        />
    )
}

DeviceList.propTypes = {
    id: PropTypes.string,
    devices: PropTypes.array,
}

export default DeviceList


import { useCallback, useState, useMemo } from 'react'
import RadioItem from '@enact/moonstone/RadioItem'
import Group from '@enact/ui/Group'
import IconButton from '@enact/moonstone/IconButton'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import PropTypes from 'prop-types'
import $L from '@enact/i18n/$L'

const IconButtonWithPopup = ContextualPopupDecorator(IconButton)

const FileTypeSelect = ({ typeSelected, onSelect, ...rest }) => {
    const data = useMemo(() => [
        { key: 'all', value: $L('All'), icon: 'files' },
        { key: 'video', value: $L('Video'), icon: 'play' },
        { key: 'music', value: $L('Music'), icon: 'music' },
        { key: 'music_video', value: $L('Music and Video'), icon: 'audio' },
        { key: 'image', value: $L('Image'), icon: 'image' },
    ], [])
    /** @type {[Boolean, Function]} */
    const [showList, setShowList] = useState(false)
    const onShowList = useCallback(() => { setShowList(oldVar => !oldVar) }, [setShowList])
    const onHideList = useCallback(() => { setShowList(false) }, [setShowList])
    const onSelectItem = useCallback(({ selected }) => {
        onSelect(data[selected].key)
        onHideList()
    }, [onSelect, data, onHideList])
    const selectedIndex = data.findIndex(item => item.key === typeSelected)
    const popComponent = useCallback(() => {
        return (
            <Group
                childComponent={RadioItem}
                defaultSelected={selectedIndex}
                onSelect={onSelectItem}
                select="radio"
                selectedProp="selected"
                {...rest}>
                {data.map(item => item.value)}
            </Group>
        )
    }, [onSelectItem, data, rest, selectedIndex])

    return (
        <IconButtonWithPopup
            backgroundOpacity="translucent"
            open={showList}
            onClick={onShowList}
            onClose={onHideList}
            popupComponent={popComponent}
            direction="up"
            showCloseButton>
            {data[selectedIndex].icon}
        </IconButtonWithPopup>
    )
}

FileTypeSelect.propTypes = {
    typeSelected: PropTypes.string,
    onSelect: PropTypes.func
}

export default FileTypeSelect

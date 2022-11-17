
import { useCallback, useState } from 'react'
import IconButton from '@enact/moonstone/IconButton'
import SubtitleMenu from './SubtitleMenu'
import { PopupBase } from '@enact/moonstone/Popup'
import FloatingLayer from '@enact/ui/FloatingLayer'
import css from './SubtitleSelect.module.less'
import Skinnable from '@enact/moonstone/Skinnable'

const PopupBaseSkin = Skinnable({ defaultSkin: 'dark' }, PopupBase)

const SubtitleSelect = ({ file }) => {
    /** @type {[Boolean, Function]} */
    const [showSubPopup, setShowSubPopup] = useState(false)
    const onShowSubPopup = useCallback(() => { setShowSubPopup(oldVar => !oldVar) }, [setShowSubPopup])
    const onHideSubPopup = useCallback(() => { setShowSubPopup(false) }, [setShowSubPopup])

    return (
        <>
            <FloatingLayer open={showSubPopup} className={css.FloatingLayer}
                onDismiss={onHideSubPopup}>
                <PopupBaseSkin open={showSubPopup}
                    onCloseButtonClick={onHideSubPopup}
                    showCloseButton>
                    <SubtitleMenu file={file} />
                </PopupBaseSkin>
            </FloatingLayer>
            <IconButton
                backgroundOpacity="lightTranslucent"
                onClick={onShowSubPopup}>
                sub
            </IconButton>
        </>
    )
}

export default SubtitleSelect

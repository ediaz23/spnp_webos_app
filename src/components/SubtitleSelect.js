
import { useCallback, useState } from 'react'
import IconButton from '@enact/moonstone/IconButton'
// import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import SubtitleMenu from './SubtitleMenu'
import { PopupBase } from '@enact/moonstone/Popup'
import Popup from '@enact/moonstone/Popup'
import FloatingLayer from '@enact/ui/FloatingLayer'
import css from './SubtitleSelect.module.less'
import Skinnable from '@enact/moonstone/Skinnable'

const PopupBaseSkin = Skinnable({ defaultSkin: 'dark' }, PopupBase)
//const IconButtonWithPopup = ContextualPopupDecorator({
//    noArrow: true,
//    noSkin: true,
//}, IconButton)

/**


            <Popup open={false} skin="dark"
                onClose={onHideSubPopup}
                showCloseButton>
                <SubtitleMenu />
            </Popup>

        <IconButtonWithPopup
            open={true}
            onClick={onShowSubPopup}
            onClose={onHideSubPopup}
            onOpen={onOpenSubPopup}
            backgroundOpacity="lightTranslucent"
            popupComponent={SubtitleMenu}
            popupClassName={css.subtitlePopup}
            className='o_IconButtonWithPopup'
            popupProps={{ className: 'o_popupProps' }}
            containerRef={setRef}
            containerPosition={{ backgroundColor: 'red' }}
            showCloseButton>
            sub
        </IconButtonWithPopup>
 */
const SubtitleSelect = () => {

    /** @type {[Boolean, Function]} */
    const [showSubPopup, setShowSubPopup] = useState(false)
    const onShowSubPopup = useCallback(() => { setShowSubPopup(oldVar => !oldVar) }, [setShowSubPopup])
    const onHideSubPopup = useCallback(() => { setShowSubPopup(false) }, [setShowSubPopup])
    //    const ref = useRef()

    /*
    const setRef = useCallback((node) => {
        ref.current = node
        console.log('element 3')
    }, [])
    */

    /*
    const onOpenSubPopup = useCallback(() => {
        console.log('element 2')
        console.log('onOpenSubPopup')
        console.log(node)
        console.log(ref)
    }, [])
    */

    /**
            if (ref.current) {
                const { containerId } = ref.current.state
                const element = document.querySelector(`[data-spotlight-id="${containerId}"]`)
                console.log(`[data-spotlight-id="${containerId}"]`)
                if (element) {
                    console.log(element)
                    element.style.position = 'relative'
                } else {
                    console.log('no lo encontro')
                }
            }
     */

    return (
        <>
            <FloatingLayer open={showSubPopup} className={css.FloatingLayer}
                onDismiss={onHideSubPopup}>
                <PopupBaseSkin open={showSubPopup}
                    showCloseButton
                    onCloseButtonClick={onHideSubPopup}>
                    <SubtitleMenu />
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


import { useCallback } from 'react'
import Button from '@enact/moonstone/Button'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import { Cell, Row } from '@enact/ui/Layout'
//import Group from '@enact/ui/Group'
//import RadioItem from '@enact/moonstone/RadioItem'
import Toggleable from '@enact/ui/Toggleable'
//import { FloatingLayerDecorator } from '@enact/ui/FloatingLayer'
//import LabeledItem from '@enact/moonstone/LabeledItem'
//import Switch from '@enact/moonstone/Switch'
//import BodyText from '@enact/moonstone/BodyText'
import Marquee from '@enact/moonstone/Marquee'
import Layout from '@enact/ui/Layout'
//import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'


const ContextualButton = Toggleable(
    { prop: 'open', toggle: 'onClick', deactivate: 'onClose' },
    ContextualPopupDecorator(Button)
)


const SubtitleMenu = (rest) => {

    const renderPopup1 = useCallback(() => <div>hola</div>, [])
    return (
        <Layout align="center" {...rest}>
            <Row style={{ width: '100%' }}>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Subtitle</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        Activate
                    </ContextualButton>
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Language</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        Esp
                    </ContextualButton>
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Sincronize</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        0
                    </ContextualButton>
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Position</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        0
                    </ContextualButton>
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Size</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        Pequeño
                    </ContextualButton>
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>Color</Marquee>
                    <ContextualButton
                        direction="down"
                        popupComponent={renderPopup1}
                        showCloseButton
                        spotlightRestrict="self-only">
                        Gris
                    </ContextualButton>
                </Cell>
            </Row>
        </Layout>
    )
}

export default SubtitleMenu

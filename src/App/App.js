
import { useCallback } from 'react'
import { I18nContextDecorator } from '@enact/i18n/I18nDecorator'
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import { Panels, Routable, Route } from '@enact/moonstone/Panels'
import { useRecoilState } from 'recoil'
import HomePanel from '../views/HomePanel'
import PlayerPanel from '../views/PlayerPanel'
import { pathState } from '../recoilConfig'
import '../back'
import './attachErrorHandler'


const RoutablePanels = Routable({ navigate: 'onBack' }, Panels)

const App = ({ ...rest }) => {
    const [path, setPath] = useRecoilState(pathState)
    const backHome = useCallback(() => {
        setPath('/home')
    }, [setPath])
    return (
        <RoutablePanels {...rest} path={path}>
            <Route path='home' component={HomePanel} {...rest} />
            <Route path='player' component={PlayerPanel}
                backHome={backHome} {...rest} />
        </RoutablePanels>
    )
}

export default MoonstoneDecorator(I18nContextDecorator(App))

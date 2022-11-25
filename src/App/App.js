
import { useCallback } from 'react'
import LocaleInfo from 'ilib/lib/LocaleInfo'
import I18nDecorator from '@enact/i18n/I18nDecorator'
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import { Panels, Routable, Route } from '@enact/moonstone/Panels'
import { useRecoilState } from 'recoil'
import HomePanel from '../views/HomePanel'
import PlayerPanel from '../views/PlayerPanel'
import { pathState } from '../recoilConfig'
import languages from '@cospired/i18n-iso-languages'
import useExtractMp4Subtitles from '../hooks/extractMp4Subtitles'
import '../back'
import './attachErrorHandler'


const RoutablePanels = Routable({ navigate: 'onBack' }, Panels)

const App = ({ ...rest }) => {
    /** @type {[String, Function]} */
    const [path, setPath] = useRecoilState(pathState)
    const extractMp4Subtitle = useExtractMp4Subtitles()
    const backHome = useCallback(() => {
        extractMp4Subtitle.postMessage({ action: 'cancel' })
        setPath('/home')
    }, [setPath, extractMp4Subtitle])


    return (
        <RoutablePanels {...rest} path={path} noCloseButton>
            <Route path='home' component={HomePanel} {...rest} />
            <Route path='player' component={PlayerPanel}
                backHome={backHome} {...rest} />
        </RoutablePanels>
    )
}

const AppLocal = I18nDecorator({
    resources: [{
        resource: options => new Promise(res => {
            const localeInfo = new LocaleInfo(options.locale).getLocale()
            import(`@cospired/i18n-iso-languages/langs/${localeInfo.language}.json`)
                .then(val => options.onLoad(val)).then(res).catch(res)
        }),
        onLoad: res => languages.registerLocale(res)
    }]
}, App)

const AppTheme = MoonstoneDecorator(AppLocal)

export default AppTheme

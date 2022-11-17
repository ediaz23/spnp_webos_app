
import RadioItem from '@enact/moonstone/RadioItem'
import Group from '@enact/ui/Group'
import languages from '@cospired/i18n-iso-languages'
import LocaleInfo from 'ilib/lib/LocaleInfo'
import PropTypes from 'prop-types'
import { I18nContextDecorator } from '@enact/i18n/I18nDecorator'
import $L from '@enact/i18n/$L'


const AudioList = ({ audioTracks, locale, onSelectAudio, ...rest }) => {
    const localeInfo = new LocaleInfo(locale).getLocale()

    let selectedAudio = 0
    const audioList = Array.from(audioTracks).map((audio, index) => {
        if (audio.enabled) {
            selectedAudio = index
        }
        return languages.getName(audio.language, localeInfo.language) || ((audio.language || $L('Noname')) + ' ' + index)
    })

    return (
        <Group
            childComponent={RadioItem}
            defaultSelected={selectedAudio}
            onSelect={onSelectAudio}
            select="radio"
            selectedProp="selected"
            {...rest}>
            {audioList}
        </Group>
    )
}

AudioList.propTypes = {
    audioTracks: PropTypes.object,
    locale: PropTypes.string,
    onSelectAudio: PropTypes.func,
}

export default I18nContextDecorator({ localeProp: 'locale' }, AudioList)


import { useCallback, useState, useMemo } from 'react'
import { useRecoilState } from 'recoil'
import Button from '@enact/moonstone/Button'
import ContextualPopupDecorator from '@enact/moonstone/ContextualPopupDecorator'
import { Cell, Row } from '@enact/ui/Layout'
import Toggleable from '@enact/ui/Toggleable'
import Marquee from '@enact/moonstone/Marquee'
import Layout from '@enact/ui/Layout'
import Switch from '@enact/moonstone/Switch'
import RadioItem from '@enact/moonstone/RadioItem'
import Group from '@enact/ui/Group'
import { I18nContextDecorator } from '@enact/i18n/I18nDecorator'
import LocaleInfo from 'ilib/lib/LocaleInfo'
import languages from '@cospired/i18n-iso-languages'
import $L from '@enact/i18n/$L'
import { subtitleConfigState } from '../recoilConfig'
import css from './SubtitleSelect.module.less'


const ContextualButton = Toggleable(
    { prop: 'open', toggle: 'onClick', deactivate: 'onClose' },
    ContextualPopupDecorator(Button)
)

const SubtitleMenu = ({ locale, videoRef, ...rest }) => {
    /** @type {HTMLVideoElement} */
    const video = videoRef.current
    const subtitleSizeData = useMemo(() => [
        { name: $L('Very Small'), value: css.vsmall },
        { name: $L('Small'), value: css.small },
        { name: $L('Normal'), value: css.normal },
        { name: $L('Big'), value: css.big },
        { name: $L('Very Big'), value: css.vbig }
    ], [])
    const subtitleColorData = useMemo(() => [
        { name: $L('White'), value: css.white },
        { name: $L('Gray'), value: css.gray },
        { name: $L('Yellow'), value: css.yellow },
        { name: $L('Green'), value: css.green },
        { name: $L('Blue'), value: css.blue },
        { name: $L('Red'), value: css.red }
    ], [])
    const subtitlePositionData = useMemo(() => [4, 3, 2, 1, 0, -1, -2, -3].map(n => n.toString()), [])
    const [subConfig, setSubConfig] = useRecoilState(subtitleConfigState)
    const subtitles = Array.from(video.textTracks)
    const subtitleIndex = subtitles.findIndex(subtitle => subtitle.mode === 'showing')
    /** @param {[Number, Function]} */
    const [selectedIndex, setSelectedIndex] = useState(Math.max(subtitleIndex, 0))
    /** @param {[Boolean, Function]} */
    const [isSelected, setIsSelected] = useState(subtitleIndex >= 0)
    const subTitle = subtitles[selectedIndex]
    const localeInfo = new LocaleInfo(locale).getLocale()
    const getLanguageName = useCallback((sub, index) => {
        let out = languages.getName(sub.language, localeInfo.language)
        return out || ((sub.language || $L('Noname')) + ' ' + index)
    }, [localeInfo])

    /** disable all subtitles */
    const disableSubs = useCallback(() => {
        subtitles.forEach(sub => { sub.mode = 'hidden' })
    }, [subtitles])

    /** enable index subtitule */
    const enableSub = useCallback((index) => {
        let play = !video.paused
        if (play) { video.pause() }
        const currentTime = video.currentTime - 2
        if (!video.classList.contains(subtitleSizeData[subConfig.sizeIndex].value)) {
            video.classList.add(subtitleSizeData[subConfig.sizeIndex].value)
        }
        if (!video.classList.contains(subtitleColorData[subConfig.colorIndex].value)) {
            video.classList.add(subtitleColorData[subConfig.colorIndex].value)
        }
        subtitles[index].mode = 'showing'
        video.currentTime = Math.max(0, currentTime)
        if (play) { video.play() }
    }, [subtitles, video, subtitleSizeData, subtitleColorData, subConfig])

    /** active / inactive subtitles */
    const toggleSelected = useCallback(() => {
        setIsSelected(subSelected => {
            subSelected = !subSelected
            disableSubs()
            if (subSelected) {
                enableSub(selectedIndex)
            }
            return subSelected
        })
    }, [setIsSelected, disableSubs, enableSub, selectedIndex])

    /** Render list of options to select */
    const RenderList = useCallback(({ defaultIndex, onSelect, list }) => (
        <Group
            childComponent={RadioItem}
            defaultSelected={defaultIndex}
            onSelect={onSelect}
            select="radio"
            selectedProp="selected">
            {list}
        </Group>
    ), [])

    /** language */
    /** change subtitle language */
    const onSelectLanguage = useCallback(({ selected }) => {
        disableSubs()
        enableSub(selected)
        setSelectedIndex(selected)
    }, [setSelectedIndex, enableSub, disableSubs])
    /** render list of language to select */
    const RenderLanguageList = useCallback(() => (
        <RenderList onSelect={onSelectLanguage}
            defaultIndex={selectedIndex}
            list={subtitles.map((sub, index) => getLanguageName(sub, index))} />
    ), [subtitles, selectedIndex, onSelectLanguage, getLanguageName])

    /** size */
    /** change text size */
    const onSelectSize = useCallback(({ selected: sizeIndex }) => {
        setSubConfig(config => {
            video.classList.remove(subtitleSizeData[config.sizeIndex].value)
            video.classList.add(subtitleSizeData[sizeIndex].value)
            return { ...config, sizeIndex }
        })
    }, [setSubConfig, subtitleSizeData, video])
    /** render list of text size to select */
    const RenderSizeList = useCallback(() => (
        <RenderList onSelect={onSelectSize}
            defaultIndex={subConfig.sizeIndex}
            list={subtitleSizeData.map(size => size.name)} />
    ), [subtitleSizeData, subConfig, onSelectSize])

    /** color */
    /** change text color */
    const onSelectColor = useCallback(({ selected: colorIndex }) => {
        setSubConfig(config => {
            video.classList.remove(subtitleColorData[config.colorIndex].value)
            video.classList.add(subtitleColorData[colorIndex].value)
            return { ...config, colorIndex }
        })
    }, [setSubConfig, subtitleColorData, video])
    /** render list of text color to select */
    const RenderColorList = useCallback(() => (
        <RenderList onSelect={onSelectColor}
            defaultIndex={subConfig.colorIndex}
            list={subtitleColorData.map(color => color.name)} />
    ), [subtitleColorData, subConfig, onSelectColor])

    /** position */
    /** change text position */
    const onSelectPosition = useCallback(({ selected: positionIndex }) => {
        for (const cue of subtitles[selectedIndex].cues) {
            cue.line = parseInt(subtitlePositionData[positionIndex])
        }
        for (const cue of subtitles[selectedIndex].activeCues) {
            cue.line = parseInt(subtitlePositionData[positionIndex])
        }
        setSubConfig(config => { return { ...config, positionIndex } })
    }, [setSubConfig, subtitlePositionData, subtitles, selectedIndex])
    /** render list of text position to select */
    const RenderPositionList = useCallback(() => (
        <RenderList onSelect={onSelectPosition}
            defaultIndex={subConfig.positionIndex}
            list={subtitlePositionData} />
    ), [subtitlePositionData, subConfig, onSelectPosition])

    const RenderBtn = ({ renderComp, value }) => (
        <ContextualButton
            direction="down"
            popupComponent={renderComp}
            disabled={!isSelected}
            spotlightRestrict="self-only">
            {value}
        </ContextualButton>
    )

    return (
        <Layout align="center" {...rest}>
            <Row style={{ width: '100%' }}>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>{$L('Subtitle')}</Marquee>
                    <Switch skin="light"
                        onToggle={toggleSelected}
                        selected={isSelected} />
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>{$L('Language')}</Marquee>
                    <RenderBtn renderComp={RenderLanguageList} value={getLanguageName(subTitle, selectedIndex)} />
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>{$L('Position')}</Marquee>
                    <RenderBtn renderComp={RenderPositionList} value={subtitlePositionData[subConfig.positionIndex]} />
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>{$L('Size')}</Marquee>
                    <RenderBtn renderComp={RenderSizeList} value={subtitleSizeData[subConfig.sizeIndex].name} />
                </Cell>
                <Cell style={{ textAlign: 'center' }} >
                    <Marquee alignment='center'>{$L('Color')}</Marquee>
                    <RenderBtn renderComp={RenderColorList} value={subtitleColorData[subConfig.colorIndex].name} />
                </Cell>
            </Row>
        </Layout>
    )
}

export default I18nContextDecorator({ localeProp: 'locale' }, SubtitleMenu)


import React from 'react'
import { atom } from 'recoil'

export const deviceState = atom({
    key: 'deviceState',
    default: null
})

export const fileState = atom({
    key: 'fileState',
    default: null
})

export const pathState = atom({
    key: 'fileSate',
    default: '/home'
})

export const homeIndexState = atom({
    key: 'homeIndexState',
    default: 0
})

export const filePathState = atom({
    key: 'filePathState',
    default: []
})

export const searchState = atom({
    key: 'searchState',
    default: ''
})

export const SettingsContext = React.createContext({
    settings: [
        { id: 1, text: 'Size', value: 'Original' },
        { id: 2, text: 'Transition', value: 'Fade In' },
        { id: 3, text: 'Speed', value: 'Normal' }
    ],
    currentSettings: {
        Size: 'Original',
        Transition: 'Fade In',
        Speed: 'Fast'
    }
})

export const imageSettingState = atom({
    key: 'imageSettingState',
    default: SettingsContext
})


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

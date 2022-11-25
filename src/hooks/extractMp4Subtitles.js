/* global Worker */

const mp4LibUrl = new URL('../../libs/mp4box.all.js', import.meta.url)
const bufferLibUrl = new URL('../../libs/Buffer.js', import.meta.url)
const url2 = new URL('../workers/extractMp4Subtitles.js', import.meta.url)
const worker = new Worker(url2)
worker.postMessage({ action: 'init', data: { mp4Url: mp4LibUrl.pathname, bufferUrl: bufferLibUrl.pathname } })

export default function useExtractMp4Subtitles() {
    return worker
}

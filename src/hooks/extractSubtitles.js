/* global Worker */

const mp4LibUrl = new URL('../../libs/mp4box.all.js', import.meta.url)
const bufferLibUrl = new URL('../../libs/Buffer.js', import.meta.url)
const mkvLibUrl = new URL('../../libs/mkvSubtitles.js', import.meta.url)
const workerUrl = new URL('../workers/extractSubtitles.js', import.meta.url)
const worker = new Worker(workerUrl)

worker.postMessage({ action: 'init', data: { libs: [mp4LibUrl.pathname, bufferLibUrl.pathname, mkvLibUrl.pathname] } })

export default function useExtractSubtitles() {
    return worker
}

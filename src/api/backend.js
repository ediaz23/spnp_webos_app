
import 'webostvjs'
import logger from '../logger'

/** @type {{webOS: import('webostvjs').WebOS}} */
const { webOS } = window  // eslint-disable-line

const serviceURL = 'luna://com.spnp.webos.player.service/'

const devRequest = ({ method, parameters, resolver, rejecter }) => {
    const options = {
        method: 'POST',
        body: { method },
        headers: {
            "Content-Type": "application/json"
        },
    }
    if (parameters) {
        options.body.payload = parameters
    }
    options.body = JSON.stringify(options.body)
    fetch(`http://localhost:8051/webos`, options)
        .then(response => response.json())
        .then(resolver)
        .catch(rejecter)
}

const makeRequest = async ({ url, method, parameters }) => {
    url = url || serviceURL
    logger.info(`req ${url} - ${method}`)
    return new Promise((res, rej) => {
        const resolver = (data) => {
            logger.info('res okey')
            logger.info(data)
            res(data)
        }
        const rejecter = (error) => {
            logger.error('res error')
            logger.error(error)
            rej(error)
        }
        if (!window.plam) {
            webOS.service.request(url, {
                method,
                parameters,
                onSuccess: resolver,
                onFailure: rejecter,
            })
        } else {
            devRequest({ method, parameters, resolver, rejecter })
        }
    })
}


const startSsdp = async () => makeRequest({ method: 'startSsdp' })

const stopSsdp = async () => makeRequest({ method: 'stopSsdp' })

/**
 * @returns {Promise<{devices: Array<Object>}>}
 */
const searchSsdp = async () => makeRequest({ method: 'searchSsdp' })

/**
 * @param {Object} obj
 * @param {String} [obj.id]
 * @param {Number} [obj.start]
 * @param {Number} [obj.count]
 * @param {String} obj.deviceId
 * @returns {Promise<{files: Array<Object>}>}
 */
const browse = async ({ id, start, count, deviceId }) =>
    makeRequest({ method: 'browse', parameters: { id, start, count, deviceId } })

/**
 * @param {Object} obj
 * @param {String} obj.deviceId
 * @returns {Promise<{capabilities: Array<Object>}>}
 */
const searchCapabilities = async ({ deviceId }) =>
    makeRequest({ method: 'searchCapabilities', parameters: { deviceId } })

/**
 * @param {Object} obj
 * @param {String} [obj.id]
 * @param {Number} [obj.start]
 * @param {Number} [obj.count]
 * @param {String} [obj.query]
 * @param {String} obj.deviceId
 * @returns {Promise<{files: Array<Object>}>}
 */
const search = async ({ id, start, count, query, deviceId }) =>
    makeRequest({ method: 'search', parameters: { id, start, count, search: query, deviceId } })

/**
 * @param {Object} obj
 * @param {String} obj.itemId
 * @param {String} obj.deviceId
 * @returns {Promise<{files: Object}>}
 */
const metadata = async ({ itemId, deviceId }) =>
    makeRequest({ method: 'metadata', parameters: { deviceId, itemId } })

const mediaTest = async () =>
    makeRequest({ url: 'com.webos.service.mediaindexer', method: 'getDeviceList' })

export default {
    startSsdp,
    stopSsdp,
    searchSsdp,
    browse,
    searchCapabilities,
    search,
    metadata,
    mediaTest,
}

//com.webos.service.mediaindexer

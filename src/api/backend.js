
import 'webostvjs'
import logger from '../logger'
import utils from '../utils'


/** @type {{webOS: import('webostvjs').WebOS}} */
const { webOS } = window

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
    if (utils.isTv()) {
        logger.info(`req plam ${url} - ${method}`)
    } else {
        logger.info(`req ${url} - ${method}`)
    }
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
        if (utils.isTv()) {
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

/**
 * @returns {Promise}
 */
const startSsdp = async () => makeRequest({ method: 'startSsdp' })

/**
 * @returns {Promise}
 */
const stopSsdp = async () => makeRequest({ method: 'stopSsdp' })

/**
 * @returns {Promise<{devices: Array<import('../types').Device>}>}
 */
const searchDevices = async () => makeRequest({ method: 'searchSsdp' })

/**
 * @param {Object} obj
 * @param {String} [obj.id]
 * @param {Number} [obj.start]
 * @param {Number} [obj.count]
 * @param {Object} obj.device
 * @returns {Promise<{files: Array<Object>}>}
 */
const browse = async ({ id, start, count, device }) =>
    makeRequest({ method: 'browse', parameters: { id, start, count, deviceData: device } })

/**
 * @param {Object} obj
 * @param {Object} obj.device
 * @returns {Promise<{capabilities: Array<Object>}>}
 */
const searchCapabilities = async ({ device }) =>
    makeRequest({ method: 'searchCapabilities', parameters: { deviceData: device } })

/**
 * @param {Object} obj
 * @param {String} [obj.id]
 * @param {Number} [obj.start]
 * @param {Number} [obj.count]
 * @param {String} [obj.query]
 * @param {Object} obj.device
 * @returns {Promise<{files: Array<Object>}>}
 */
const search = async ({ id, start, count, query, device }) =>
    makeRequest({ method: 'search', parameters: { id, start, count, search: query, deviceData: device } })

/**
 * @param {Object} obj
 * @param {String} obj.itemId
 * @param {Object} obj.device
 * @returns {Promise<{files: Object}>}
 */
const metadata = async ({ itemId, device }) =>
    makeRequest({ method: 'metadata', parameters: { deviceData: device, itemId } })

const mediaTest = async () =>
    makeRequest({ url: 'com.webos.service.mediaindexer', method: 'getDeviceList' })

export default {
    startSsdp,
    stopSsdp,
    searchDevices,
    browse,
    searchCapabilities,
    search,
    metadata,
    mediaTest,
}

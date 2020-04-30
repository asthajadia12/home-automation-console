
/**
 * Service to communicate with machine level API.
 * Currently mimicking the API through setTimeout
 * calls
 */
const getDeviceData = require('./getDeviceData')
const getDeviceDataByID = require('./getDeviceDataByID')
const installDevice = require('./installDevice')
const performActionOnDevice = require('./performActionOnDevice')
const uninstallDevice = require('./uninstallDevice')

module.exports = {
    getDeviceData,
    getDeviceDataByID,
    installDevice,
    performActionOnDevice,
    uninstallDevice,
};
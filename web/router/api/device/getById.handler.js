const { getDeviceDetailsById } = require('./device.getters');
const { getDeviceDataByID } = rootRequire('services')

async function logic({ params }) {
  try {
    const serial_number = params.serial_number;
    const device = await getDeviceDetailsById(serial_number);
    // calling device API
    device.metadata = await getDeviceDataByID(serial_number);
    return device;
  } catch (e) {
    throw e;
  }
}

function handler(req, res, next) {
  logic(req).then((data) => {
    res.json(data);
  }).catch(err => next(err));
}
module.exports = handler;
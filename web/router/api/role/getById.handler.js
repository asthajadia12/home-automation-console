const { getDevicedetailsById } = require('./device.getters');

async function logic({ params }) {
  try {
    const id = params.id;
    const device = await getDeviceDetailsById(id);
    // device.menus = [1, 2, 3];
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
const Joi = require('joi');
const { update } = rootRequire('db').pg;
const { performActionOnDevice } = rootRequire('services')

// device state updation
async function deviceStateUpdation({body, params}) {
  const updateObj = { device_state: body.device_state };

  const whereClause = {};
  whereClause.text = `WHERE 1=1 AND serial_number = $2`;
  whereClause.values = [params.serial_number];

  const deviceExists = await update({ tableName: 'devices', data: updateObj, whereClause, returnClause: ['*'] });
  return deviceExists.rows[0];
}

async function logic(req) {
  try {
    if(!req.body.device_state)  throw new Error('please provide device state');
    if(!req.params.serial_number)  throw new Error('please provide serial number');

    const device = await deviceStateUpdation(req);

    // calling device API
    device.metadata = await performActionOnDevice(req.params.serial_number);

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
const Joi = require('joi');
const Boom = require('boom');

const { deviceSchema } = rootRequire('joi');
const { trimObject, getErrorMessages } = rootRequire('utils');
const { installDevice } = rootRequire('services')
const { insert, query } = rootRequire('db').pg;
const moment = require('moment');

async function enrichDeviceObj(body){
  return {
    "device_type": body.device_type,
    "device_name": body.device_name,
    "serial_number": body.serial_number,
    "device_state": 'INSTALLING',
    "is_active": body.is_active,
    "created_on": moment(),
  }
} 

// new device creation reqeust
async function newDeviceCreation(req) {
  const deviceExists = await query('SELECT exists(SELECT * FROM devices WHERE serial_number = $1 )', [req.body.serial_number]);
  if (deviceExists.rows[0].exists) throw Boom.badRequest('Device already exists');

  const deviceObj = trimObject(await enrichDeviceObj(req.body));

  const devices = await insert({ tableName: 'devices', data: deviceObj, returnClause: ['*'] });

  return devices.rows[0];
}

async function logic(req) {
  try {
    let device;
    const { error } = Joi.validate(req.body, deviceSchema.deviceSchema, { abortEarly: false });
    if (error) throw Boom.badRequest(getErrorMessages(error));

    // calling device API
    device = await installDevice(device);

    device.log = await newDeviceCreation(req);

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
const Boom = require('boom');

const { query } = rootRequire('db').pg;

function getDeviceColoumn() {
  // 'd.action',
  return ['d.device_id', 'd.device_type', 'd.device_name', 'd.serial_number', 'd.is_active'
  ].join(' , ');
}

async function getDeviceDetailsById(id) {
  let text = `SELECT ${getDeviceColoumn()}`;
  text = `${text} FROM devices d`;
  text = `${text} WHERE d.serial_number = $1`;
  const device = await query(text, [id]);

  if (!device.rows[0]) {
    throw Boom.badRequest('Device not found');
  }
  return device.rows[0];
}

module.exports = {
  getDeviceColoumn,
  getDeviceDetailsById,
};
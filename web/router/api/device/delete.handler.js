const { pgDelete } = rootRequire('db').pg;
const { uninstallDevice } = rootRequire('services')

async function logic({ params }) {
  try {
    const serial_number = params.serial_number;

    const whereClause = {};
    whereClause.text = `WHERE 1=1 AND serial_number = $1`;
    whereClause.values = [params.serial_number];

    const device = await pgDelete({ tableName: 'devices', whereClause, returnClause: ['*'] })

    // calling device API
    device.metadata = await uninstallDevice(serial_number);

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
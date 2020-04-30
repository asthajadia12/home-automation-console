const { pg } = rootRequire('db');
const { QueryBuilder } = rootRequire('utils');

const columns = {
  device_id: 'd.device_id',
  device_name: 'd.device_name',
  serial_number: 'd.serial_number',
  device_type: 'd.device_type',
  device_state: 'd.device_state',
  created_on: {
    name: 'd.created_on',
    format: "to_char(d.created_on,'dd-mm-YYYY HH:MI:SS') as created_on",
  },
};

async function logic({ query }) {
  try {
    // No need to call external service as for every action we update database store
    const qb = new QueryBuilder({ buildTotalQuery: true });
    qb.select(columns)
      .selectTotal('count(*)')
      .from('devices d')
      // .where();
    qb.orderBy(query.sortColumn || columns.created_on.name);
    qb.order(query.sortOrder || 'DESC');
    qb.limit(query.limit);
    qb.page(query.page);
    
    const result = await qb.paginateQuery(pg);
    return result;
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
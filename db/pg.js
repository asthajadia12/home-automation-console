const { Pool, types } = require('pg');
const Boom = require('boom');

// Fix for parsing of numeric fields
types.setTypeParser(1700, 'text', parseFloat);

const {
  getCommaSeparatedColumns,
  getObjectValues,
  getCommaSeparatedParamSubtitute,
  getUpdateSetClause,
} = rootRequire('utils');

const envsWithQueryLoggingEnabled = ['production', 'staging'];

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: process.env.PGMAXCONNECTION,
  idleTimeoutMillis: process.env.PGIDLETIMEOUT,
  connectionTimeoutMillis: process.env.PGCONNECTIONTIMEOUT,
});

pool.on('error', (err) => {
  logger.error(`Postgres connection error on client - ${err.message}`);
  throw err;
});

/**
 * Notice in the example below no releaseCallback was necessary.
 * The pool is doing the acquiring and releasing internally.
 * I find pool.query to be a handy shortcut in a lot of situations.
 * Do not use pool.query if you need transactional integrity:
 * the pool will dispatch every query passed to pool.query on the first available idle client.
 * Transactions within PostgreSQL are scoped to a single client.
 * so dispatching individual queries within a single transaction across
 * multiple, random clients will cause big problems in your app and not work.
 */
/**
 * @param  {string} text
 * @param  {array} params
 */
function query(text, params) {
  if (envsWithQueryLoggingEnabled.indexOf(process.env.NODE_ENV) >= 0) {
    logger.info(text);
    logger.info(params);
  }
  return pool.query(text, params);
}

/** Use this for transactional integrity */
function getClient() {
  return pool.connect();
}


function insert({ client, tableName, data, returnClause }) {
  let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(data)})
                VALUES(${getCommaSeparatedParamSubtitute(data)})`;
  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  const values = getObjectValues(data);
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, values);
  /** If client is not provide then use client from connection pool */
  return query(text, values);
}

function bulkInsert({ client, tableName, data, returnClause, constraint }) {
  if (data.constructor !== Array && data.length === 0) {
    throw Boom.badRequest('Please provide array of values for bulk insert operation');
  }
  let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(data[0])}) VALUES`;
  const values = [];
  const paramsClause = data.map((element, index) => {
    const size = ((Object.keys(element).length) * index) + 1;
    Array.prototype.push.apply(values, getObjectValues(element));
    return `(${getCommaSeparatedParamSubtitute(element, size)})`;
  }).join(', ');
  text = `${text} ${paramsClause}`;

  /** If need to handle cases when the constraint fails for some and other entries should be committed to database */
  if (constraint) {
    text = `${text} ON CONFLICT ON CONSTRAINT ${constraint} DO NOTHING`;
  }

  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, values);
  /** If client is not provide then use client from connection pool */
  return query(text, values);
}

function bulkUpsert({ client, tableName, insertData, updateData, indexColumns, conflictClause, returnClause }) {
  if (insertData.constructor !== Array && insertData.length === 0) {
    throw Boom.badRequest('Please provide array of values for bulk insert operation');
  }
  if (indexColumns.constructor !== Array && indexColumns.length === 0) {
    throw Boom.badRequest('Please provide array of index columns for upsert operation');
  }
  let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(insertData[0])}) VALUES`;
  const values = [];
  const paramsClause = insertData.map((element, index) => {
    const size = ((Object.keys(element).length) * index) + 1;
    Array.prototype.push.apply(values, getObjectValues(element));
    return `(${getCommaSeparatedParamSubtitute(element, size)})`;
  }).join(', ');
  text = `${text} ${paramsClause}`;
  /** Update clause for Bulk Upsert Operation */
  const updateClause = Object.keys(updateData).map((key) => {
    const pair = `${key} = excluded.${key}`;
    return pair;
  }).join(',');

  text = `${text} ON CONFLICT(${indexColumns.join(',')})`;
  text = `${text} DO`;

  if (conflictClause && conflictClause.toUpperCase() === 'UPDATE') {
    text = `${text}  UPDATE SET ${updateClause}`;
  } else {
    text = `${text} NOTHING`;
  }

  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, values);
  /** If client is not provide then use client from connection pool */
  return query(text, values);
}

function update({ client, tableName, data, whereClause, returnClause }) {
  /** Enriching the update clause params */
  const values = getObjectValues(data);
  Array.prototype.push.apply(values, whereClause.values);
  /** Enriching the update clause */
  let text = `UPDATE ${tableName} SET ${getUpdateSetClause(data)} ${whereClause.text}`;
  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  logger.debug('query is: ', text, values);
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, values);
  /** If client is not provide then use client from connection pool */
  return query(text, values);
}

function upsert({ client, tableName, data, indexColumns, returnClause }) {
  if (indexColumns.constructor !== Array && indexColumns.length === 0) {
    throw Boom.badRequest('Please provide array of index columns for upsert operation');
  }
  let text = `INSERT INTO ${tableName}(${getCommaSeparatedColumns(data)})
  VALUES(${getCommaSeparatedParamSubtitute(data)})`;

  const values = getObjectValues(data);
  const counter = Object.keys(data).length;
  /** Created by field must be removed for update operation */
  if (data.created_by) {
    delete data.created_by;
    Array.prototype.push.apply(values, getObjectValues(data));
  } else {
    Array.prototype.push.apply(values, values);
  }

  text = `${text} ON CONFLICT(${indexColumns.join(',')})`;
  text = `${text} DO UPDATE SET ${getUpdateSetClause(data, counter + 1)}`;
  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, values);
  /** If client is not provide then use client from connection pool */
  return query(text, values);
}

/** Cannot name delete since it's a keyword in javascript */
function pgDelete({ client, tableName, whereClause, returnClause }) {
  if (!(whereClause && typeof whereClause === 'object' && Object.keys(whereClause).length > 0)) {
    throw Boom.badRequest('Please provide valid where clause for delete operation');
  }
  let text = `DELETE FROM ${tableName}`;
  text = `${text} ${whereClause.text}`;
  if (returnClause && returnClause.constructor === Array && returnClause.length > 0) {
    text = `${text} RETURNING ${returnClause.join(',')}`;
  }
  /** If client is provided in argument then use client for atomicity */
  if (client) return client.query(text, whereClause.values);
  /** If client is not provide then use client from connection pool */
  return query(text, whereClause.values);
}

module.exports = {
  pool,
  query,
  getClient,
  insert,
  bulkInsert,
  bulkUpsert,
  update,
  upsert,
  pgDelete,
};
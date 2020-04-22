const moment = require('moment');

// logger.info(LOGIN_LINK);

function getCommaSeparatedColumns(obj) {
  return Object.keys(obj).join(',');
}

function getObjectValues(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}

function getCommaSeparatedParamSubtitute(obj, counter) {
  let _counter = counter || 1;
  const params = [];
  Object.keys(obj).forEach(() => {
    params.push(`$${_counter}`);
    _counter += 1;
  }, this);
  return params.join(',');
}

function getUpdateSetClause(obj, counter) {
  let _counter = counter || 1;
  const result = Object.keys(obj).map((key) => {
    const pair = `${key}=$${_counter}`;
    _counter += 1;
    return pair;
  });
  return result.join(',');
}

module.exports = (obj) => {
  obj.getCommaSeparatedColumns = getCommaSeparatedColumns;
  obj.getObjectValues = getObjectValues;
  obj.getCommaSeparatedParamSubtitute = getCommaSeparatedParamSubtitute;
  obj.getUpdateSetClause = getUpdateSetClause;
};
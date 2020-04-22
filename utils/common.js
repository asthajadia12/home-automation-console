const axios = require('axios');

function trimObject(obj) {
  let value;
  Object.keys(obj).forEach((key) => {
    value = obj[key];
    if (value && typeof value === 'string') {
      obj[key] = value.trim();
    } else if (value && value.constructor === Object && typeof value === 'object') {
      obj[key] = trimObject(value);
    }
  });
  return obj;
}

function getErrorMessages(error) {
  if (error.details && error.details.length > 0) {
    return error.details.reduce((p, v) => {
      return `${p}${v.message} </br>`;
    }, '');
  }
  return error.message;
}

function sanitizeObj(obj) {
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val !== 'boolean') {
      if (val) {
        obj[key] = val || '';
      } else {
        delete obj[key];
      }
    }
  });
  return obj;
}

function getJoiErrors(error) {
  if (error && error.isJoi) {
    const errors = error.details.map((error) => {
      return error.message;
    });
    return errors.join(',');
  }
  return '';
}

module.exports = function (obj) {
  obj.trimObject = trimObject;
  obj.getErrorMessages = getErrorMessages;
  obj.sanitizeObj = sanitizeObj;
  obj.getJoiErrors = getJoiErrors;
};
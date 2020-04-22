// list of all the properties binded to Global Scope
const path = require('path');

global.rootRequire = function (name) {
  const module = require(path.join(__dirname, name)); // eslint-disable-line
  return module;
};

global.logger = require('./config/logger');
global._ = require('lodash');

global.PROJECT_ROOT_DIRECTORY = path.resolve(__dirname);
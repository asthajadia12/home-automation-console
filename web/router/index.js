const { sanitizeRequestObj } = require('../middleware');
const router = require('express').Router();

sanitizeRequestObj(router);

/** Secured routes */
require('./api/device')(router);

/**
 * Mounting respective paths.
 * @param {object} app Express instance
 */
module.exports = (app) => {
  app.use('/api/v1', router);
};
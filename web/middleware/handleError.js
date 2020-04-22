const Boom = require('boom');

const { getJoiErrors } = rootRequire('utils');

module.exports = function(app) {
  // Error: 404
  app.use((req, res, next) => {
    next(Boom.notFound('Invalid endpoint'));
  });

  app.use((err, req, res, next) => {
    // Convert if error does not belong to Boom object
    const _err = err.isBoom ? err : Boom.boomify(err, { statusCode: 500 });
    _err.message = err.isJoi ? getJoiErrors(err) : _err.message;
    /** Boom error */
    const payload = {
      error: _err.output.payload.error,
      message: _err.message,
      statusCode: _err.output.payload.statusCode,
    };
    if (process.env.NODE_ENV === 'development') logger.error(`Stack: ${_err.stack}`);
    logger.error(`Name: ${payload.error} | message: ${payload.message} | status: ${payload.statusCode}`);
    res.status(payload.statusCode || 500).json(payload);
  });
};
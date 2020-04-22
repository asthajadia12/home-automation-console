
function requestLogger(router) {
  router.use((req, res, next) => {
      logger.info(message);
    next();
  });
}

module.exports = requestLogger;
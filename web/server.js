// Starting an API Server to expose functinalities
const { express } = rootRequire('config');
const app = express();

const appServer = require('http').Server(app);

// mounting middlewares
const { basic, handleError } = require('./middleware');

basic(app);

// mounting routes
require('./router')(app);

handleError(app);

appServer.listen(process.env.PORT, (err) => {
  if (err) {
    logger.error(`Error while starting server at port ${process.env.PORT} | Error: ${err.message}`);
  }
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Express Server Up and Running @PORT: ${process.env.PORT} | at localhost`);
});

module.exports = { app, appServer };
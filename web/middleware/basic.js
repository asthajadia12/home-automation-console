const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

function basicMiddlewares(app) {
  app.use(helmet());
  app.use(helmet.xssFilter({ setOnOldIE: true }));

  // throws 400 error to next, if JSON is not valid
  app.use(bodyParser.json({
    limit: '50mb',
    strict: true,
  }));

  // parses the url encoded strings
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }));

  // logs incoming request in dev pattern
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: logger.stream,
  }));
  // CORS enabled
  app.use(cors());
}

module.exports = basicMiddlewares;
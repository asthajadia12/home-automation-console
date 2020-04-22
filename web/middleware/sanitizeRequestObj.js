const { trimObject, sanitizeObj } = rootRequire('utils');

function sanitizeRequestObj(router) {
  router.use((req, res, next) => {
    /*
    recursive trimming and removal of falsy key-value pairs
    */
    if (req.body && req.body !== {}) req.body = trimObject(sanitizeObj(req.body));
    if (req.query && req.query !== {}) req.query = trimObject(sanitizeObj(req.query));
    next();
  });
}

module.exports = sanitizeRequestObj;
// Exporting
const obj = {};

// mounting utility functions
require('./common')(obj);

// mounting database functions
require('./database')(obj);

require('./paginator')(obj);

require('./query.builder')(obj);

module.exports = obj;
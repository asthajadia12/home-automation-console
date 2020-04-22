const path = require('path');
/**
 *
 * This is the main entry point of the application.
 * It will load configurations, initialize the app and start the express server
 */
require('dotenv').config({ path: path.join(__dirname, '/.env') });

// Set globals
require('./globals');

// Initaializing config
const { pool } = require('./db').pg;

pool.connect(() => {
});

// Running the required scripts
/** Updatingn the database for logging the IP informations */
const { createFolders } = require('./scripts');

createFolders.init([
  'log',
]);

// Start server
const { appServer } = require('./web/server');
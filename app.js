let express = require('express');
let app = express();
let errorHelper = require('./App/Error Helper/errorHelpers');
let routes = require('./App/Router/routes');

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

// Configure router so all routes are prefixed with /api/v1
app.use('/api', routes);

// Configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
// Configure exception logger to file
app.use(errorHelper.logErrorsToFile);
// Configure client error handler
app.use(errorHelper.clientErrorHandler);
// Configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

module.exports = app;
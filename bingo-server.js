(function () {
    'use strict';
    var express = require ('express');
    var bodyParser = require('body-parser');
    var logging = require('./core/logging');
    var userLoginMiddleware = require('./express-middleware/user-login-middleware');
    var gameMiddleware = require('./express-middleware/game-middleware');
    var cors = require('./express-middleware/cors');
    var app = express();


    app.use(bodyParser.json());
    app.all('/*', cors);
    logging(app);
    userLoginMiddleware(app);
    gameMiddleware(app);

    app.listen(30069, function(){
        console.log("express-winston demo listening on port %d in %s mode", this.address().port, app.settings.env);
    });
})();
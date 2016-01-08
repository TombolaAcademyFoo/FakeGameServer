(function () {
    'use strict';
    var express = require ('express'),
        bodyParser = require('body-parser'),
        logging = require('./core/logging'),
        userLoginMiddleware = require('./express-middleware/user-login-middleware'),
        gameMiddleware = require('./express-middleware/game-middleware'),
        cors = require('./express-middleware/cors'),
        connection = require('./express-middleware/http-connections'),
        app = express();

    app.use(bodyParser.json());
    app.all('/*', cors);
    logging(app);
    userLoginMiddleware(app);
    gameMiddleware(app);
    connection.auth({username:'ta', password:'tombola123'}).then(function (response) {
        connection.token = response.token;
    }).catch(function (error) {
        console.log(error);
    });

    app.listen(30069, function(){
        console.log("express-winston demo listening on port %d in %s mode", this.address().port, app.settings.env);
    });
})();
(function () {
    'use strict';
    var express = require ('express'),
        bodyParser = require('body-parser'),
        logging = require('./core/logging'),
        userLoginMiddleware = require('./express-middleware/user-login-middleware'),
        gameMiddleware = require('./express-middleware/game-middleware'),
        cors = require('./express-middleware/cors'),
        mysql = require('mysql'),
        connection = mysql.createConnection({
            host: process.env.taApiDBHost,
            user: process.env.taApiDBUser,
            password: process.env.taApiDBPassword,
            database: process.env.taApiDBName
        }),
        app = express();

    app.use(bodyParser.json());
    app.all('/*', cors);
    logging(app);
    userLoginMiddleware(app);
    gameMiddleware(app);
    connection.connect();

    app.listen(30069, function(){
        console.log("express-winston demo listening on port %d in %s mode", this.address().port, app.settings.env);
    });
})();
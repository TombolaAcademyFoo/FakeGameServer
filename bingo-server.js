(function () {
    'use strict';
    var express = require ('express'),
        bodyParser = require('body-parser'),
        logging = require('./logging'),
        userLogin = require('./user-login'),
        cors = require('./cors'),
        app = express();

    app.use(bodyParser.json());
    app.all('/*', cors);
    logging(app);
    userLogin(app);

    app.listen(30069, function(){
        console.log("express-winston demo listening on port %d in %s mode", this.address().port, app.settings.env);
    });
})();
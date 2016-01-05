(function () {
    'use strict';
    module.exports = function(app){
        var responseSenders = require('./response-senders'),
            databaseMiddleware = require('./database-middleware');


        app.get('/', function(req, res) {
            responseSenders.send(res, 'hello world');
        });

        app.post('/users/login', function(req, res) {
            if (req.body.username && req.body.password) {
                var sql = 'SELECT * FROM fakebingousers WHERE username = ' + databaseMiddleware.connection.escape(req.body.username);
                databaseMiddleware.connection.query(sql, function (err, response) {
                    if(req.body.username === response[0].username && req.body.password === response[0].password){
                        responseSenders.send(res, 'LoginSuccess',
                            {user: {
                                username: response[0].username,
                                balance: response[0].balance,
                                token: response[0].token
                            }});
                    }
                    else {
                        responseSenders.sendError(res, 401);
                    }
                });
            }
            else {
                responseSenders.sendError(res, 401);
            }
        });

        app.post('/users/logout', function(req, res) {
            if (req.get('x-token')) {
                var sql = 'SELECT * FROM fakebingousers WHERE token = ' + databaseMiddleware.connection.escape(req.get('x-token'));
                databaseMiddleware.connection.query(sql, function (err, response) {
                    if (req.get('x-token') === response[0].token) {
                        responseSenders.send(res, 'LogoutSuccess');
                    } else {
                        responseSenders.sendError(res, 400, 'Error logging out');
                    }
                });
            }
            else {
                responseSenders.sendError(res, 400, 'Error logging out');
            }

        });
    };
})();
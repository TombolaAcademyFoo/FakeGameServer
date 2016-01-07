(function () {
    'use strict';
    module.exports = function(app){
        var config = require('./../config');
        var responseSenders = require('./response-senders');
        var httpConnections = require('./http-connections');

        app.get('/', function(req, res) {
            responseSenders.send(res, 'hello world');
        });

        app.post('/users/login', function(req, res) {
            var i;
            if (req.body.username && req.body.password) {
                httpConnections.getAll('fakebingousers', '').then(function (response) {
                    console.log(response);
                    for (i=0;i<response.length; i++) {
                        if(response[i].username === req.body.username) {
                            responseSenders.send(res, 'LoginSuccess', {user: {
                                username: response[i].username,
                                balance: response[i].balance,
                                token: response[i].token
                            }});
                        }
                        else {
                            responseSenders.sendError(res, 401);
                        }
                    }
                }).catch(function (error){
                    console.log(error);
                });
            }
            else {
                responseSenders.sendError(res, 401);
            }
        });

        app.post('/users/logout', function(req, res) {
            if (req.get('x-token') === config.user.token) {
                responseSenders.send(res, 'LogoutSuccess');
            } else {
                responseSenders.sendError(res, 400, 'Error logging out');
            }
        });
    };
})();
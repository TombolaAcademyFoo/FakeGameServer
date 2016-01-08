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
            if (req.body.username && req.body.password) {
                httpConnections.getByData('fakebingousers', {username:req.body.username}).then(function (response) {
                    if(response[0].username === req.body.username && response[0].password === req.body.password) {
                        responseSenders.send(res, 'LoginSuccess', {user: {
                            id: response[0].id,
                            username: response[0].username,
                            balance: response[0].balance,
                            token: response[0].token
                        }});
                    }
                    else {
                        responseSenders.sendError(res, 401);
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
            if (req.get('x-token')) {
                httpConnections.getByData('fakebingousers', {token:req.get('x-token')}).then(function (response) {
                    if (req.get('x-token') === response[0].token) {
                        responseSenders.send(res, 'LogoutSuccess');
                    } else {
                        responseSenders.sendError(res, 400, 'Error logging out');
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    };
})();
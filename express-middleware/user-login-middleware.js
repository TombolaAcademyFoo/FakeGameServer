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
            httpConnections.getAllFakeBingoUsers();
            if(req.body.username === config.userLogin.username && req.body.password === config.userLogin.password){
                responseSenders.send(res, 'LoginSuccess', {user: config.user});
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
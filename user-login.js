(function () {
    'use strict';
    module.exports = function(app){
        var config = require('./config');
        var responseSenders = require('./response-senders');

        app.get('/', function(req, res) {
            responseSenders.send(res, 'hello world');
        });

        app.post('/users/login', function(req, res) {
            if(req.body.username === config.userLogin.username && req.body.password === config.userLogin.password){
                responseSenders.send(res, 'LoginSuccess', {user: config.user});
            }
            else {
                responseSenders.sendError(res, 401);
            }
        });

        app.post('/users/logout', function(req, res) {
            if (req.body.token === config.user.token) {
                responseSenders.send(res, 'LogoutSuccess');
            } else {
                responseSenders.sendError(res, 400, 'Error logging out');
            }
        });
    };
})();
(function () {
    'use strict';
    var config = require('./config'),
        sendError = function(res, code, content){
            if(!code){
                code = 400;
            }
            if(content){
                res.status(code).send({message:'Error', payload: content});
            }
            else{
                res.sendStatus(code);
            }
        },
        send = function(res, message, content){
            if(content){
                res.send({message:message, payload: content});
            }
            else {
                res.send({message:message});
            }
        },
        sendSecured = function (req, res, message, content){
            if (req.get('x-token') === config.user.token) {
                send(res, message, content);
            }
            else {
                sendError(res, 401);
            }
        };

    module.exports = {
        sendError: sendError,
        send: send,
        sendSecured : sendSecured
    };
})();
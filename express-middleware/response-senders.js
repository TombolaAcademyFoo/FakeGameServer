(function () {
    'use strict';
    var userToken = require('../config').user.token;
    module.exports = {
        sendError: function(res, code, content){
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
        send: function(res, message, content){
            if(content){
                res.send({message:message, payload: content});
            }
            else {ƒ
                res.send({message:message});
            }
        },
        sendSecured: function (req, res, message, content){
            if (req.get('x-token') === userToken) {
                this.send(res, message, content);
            }
            else {
                this.sendError(res, 401);
            }
        },
        send400Error: function(res, content){
            this.sendError(res, 400, content);
        }
    };
})();
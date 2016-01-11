(function () {
    'use strict';
    var httpConnections = require('./http-connections');
    module.exports = {
        me: this,
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
            else {
                res.send({message:message});
            }
        },
        sendSecured: function (req, res, message, content){
            var me = this;
            if (req.get('x-token')) {
                httpConnections.getByData('fakebingousers', {token:req.get('x-token')}).then(function (response) {
                    if (req.get('x-token') === response[0].token) {
                        me.send(res, message, content);
                    }
                    else {
                        me.sendError(res, 401);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
        send400Error: function(res, content){
            this.sendError(res, 400, content);
        }
    };
})();
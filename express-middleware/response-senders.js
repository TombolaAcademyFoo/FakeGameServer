(function () {
    'use strict';
    var databaseMiddleware = require('./database-middleware');
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
            else {
                res.send({message:message});
            }
        },
        sendSecured: function (req, res, message, content){
            var me = this;
            if (req.get('x-token') && content) {
                var sql = 'SELECT * FROM fakebingousers WHERE token = ' + databaseMiddleware.connection.escape(req.get('x-token'));
                databaseMiddleware.connection.query(sql, function (err, response) {
                    if (req.get('x-token') === response[0].token) {
                        me.send(res, message, content);
                    }
                    else {
                        me.sendError(res, 401);
                    }
                });
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
(function () {
    'use strict';
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
        }
    };
})();
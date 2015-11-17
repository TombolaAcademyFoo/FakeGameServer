(function () {
    'use strict';
    var config = require('../config');
    var responseSenders = require('./response-senders');

    Number.isInteger = Number.isInteger || function(value) {
            return typeof value === "number" &&
                isFinite(value) &&
                Math.floor(value) === value;
        };

    module.exports ={
        required: function(res, value, name){
            if(typeof value === 'undefined' || value === null){
                responseSenders.send400Error(res, 'Required information missing: ' + name);
                return false;
            }
            return true;
        },
        integer: function(res, value, name){
            var valueAsNumber;
            if(!this.required(res,value, name)){
                return false;
            }
            valueAsNumber = Number(value);
            if(!Number.isInteger(valueAsNumber)){
                responseSenders.send400Error(res, 'Value expected to be an integer: ' + name);
                return false;
            }
            return true;
        },
        validGameId: function(res, value, name){
            var valueAsNumber;
            if(!this.integer(res,value, name)){
                return false;
            }
            valueAsNumber = Number(value);
            if(valueAsNumber !== config.game.id){
                responseSenders.send400Error(res, 'Invalid Game Id');
                return false;
            }
            return true;
        },
        username : function(res, value, name){
            if(!this.required(res,value, name)){
                return false;
            }
            if(value !== config.user.username){
                responseSenders.send400Error(res, 'Invalid User Id');
                return false;
            }
            return true;
        },
        callNumber: function(res, value, name){
            if(!this.integer(res,value, name)){
                return false;
            }
            if(value < 1){
                responseSenders.send400Error(res, 'callnumber must be greater than 0');
                return false;
            }
            if(value > 90){
                responseSenders.send400Error(res, 'callnumber must be not be greater than 90');
                return false;
            }
            return true;
        }
    };
})();
(function () {
    'use strict';
    module.exports = function(app){
        var responseSenders = require('./response-senders'),
            validator = require('./validator'),
            game = require('../model/responses/game'),
            databaseMiddleware = require('./database-middleware');

        app.get('/game/next', function(req, res) {
            var sql = 'SELECT * FROM bingogames';
            databaseMiddleware.connection.query(sql, function (err, response) {
                var gameToPlay = Math.floor((Math.random() * response.length) + 1);
                game.getNext(gameToPlay, req, res)
            });
        });

        app.post('/game/buyticket', function(req, res) {
            var gameId = req.body.gameId,
                balance = req.body.balance,
                username = req.body.userId;

            if(!validator.validGameId(res, gameId, 'gameId')){
                return;
            }

            if(!validator.integer(res, balance, 'balance')){
                return;
            }

            if(!validator.username(res, username, 'userId')){
                return;
            }

            game.buyTicket(username, balance, gameId, req, res);
        });

        app.post('/game/getcall', function(req, res) {
            var gameId = req.body.gameId,
                callNumber = req.body.callnumber,
                balance = req.body.balance,
                username = req.body.userId,
                lineFound = req.body.lineFound,
                fullHouseFound = req.body.fullHouseFound;

            if(!validator.validGameId(res, gameId, 'gameId')){
                return;
            }

            if(!validator.callNumber(res, callNumber, 'callnumber')){
                return;
            }

            if(!validator.username(res, username, 'userId')){
                return;
            }

            if(!validator.integer(res, balance, 'balance')){
                return;
            }

            var response = game.getCall(gameId, callNumber, username, balance, lineFound, fullHouseFound);

            if(response.winnerInfo){
                if(response.winnerInfo.housewinnername){
                    responseSenders.sendSecured(req, res, 'Winner', response );
                }
                else {
                    responseSenders.sendSecured(req, res, 'Line', response );
                }
            }
            else{
                responseSenders.sendSecured(req, res, 'Call', response );
            }
        });
    };
})();
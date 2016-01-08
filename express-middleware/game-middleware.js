(function () {
    'use strict';
    module.exports = function(app){
        var config = require('./../config');
        var responseSenders = require('./response-senders');
        var validator = require('./validator');
        var game = require('../model/responses/game');
        var httpConnections = require('./http-connections');

        app.get('/game/next', function(req, res) {
            var gameToPlay;
            httpConnections.getAll('bingogames').then(function (response) {
                gameToPlay = Math.floor((Math.random() * response.length)+1);
                httpConnections.getById('bingogames', gameToPlay).then(function (response) {
                    console.log(response);
                    console.log(game.getNext(response));
                    responseSenders.sendSecured(req, res, 'NextGame', game.getNext(response));
                }).catch(function (error){
                    console.log(error);
                });
            }).catch(function (error) {
                console.log(error);
            });
        });

        app.post('/game/buyticket', function(req, res) {
            var gameId = req.body.gameId;
            var balance = req.body.balance;
            var username = req.body.userId;

            if(!validator.validGameId(res, gameId, 'gameId')){
                return;
            }

            if(!validator.integer(res, balance, 'balance')){
                return;
            }

            if(!validator.username(res, username, 'userId')){
                return;
            }

            responseSenders.sendSecured(req, res, 'TicketBought', game.buyTicket(username, balance));
        });

        app.post('/game/getcall', function(req, res) {
            var gameId = req.body.gameId;
            var callNumber = req.body.callnumber;
            var balance = req.body.balance;
            var username = req.body.userId;

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

            var response = game.getCall(gameId, callNumber, username, balance);

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
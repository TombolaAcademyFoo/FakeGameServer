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
            if (req.body.gameId && req.body.balance && req.body.userId) {
                var gameId = req.body.gameId;
                var balance = req.body.balance;
                var username = req.body.userId;


                httpConnections.getById('bingogames', gameId).then(function (gameResponse) {
                    if(!validator.validGameId(res, gameId, gameResponse, 'gameId')){
                        return;
                    }

                    if(!validator.integer(res, balance, 'balance')){
                        return;
                    }

                    httpConnections.getByData('fakebingousers', {username:username}).then(function (accountResponse) {
                        if(!validator.username(res, username, accountResponse, 'userId')){
                            return;
                        }

                        httpConnections.getById('bingotickets', gameResponse[0].id).then(function (ticketResponse) {
                            responseSenders.sendSecured(req, res, 'TicketBought', game.buyTicket(username, balance, gameResponse, accountResponse, ticketResponse));
                        }).catch(function (error) {
                            console.log(error);
                        });

                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });

        app.post('/game/getcall', function(req, res) {
            if (req.body.gameId && req.body.callnumber && req.body.balance && req.body.userId) {
                var gameId = req.body.gameId;
                var callNumber = req.body.callnumber;
                var balance = req.body.balance;
                var username = req.body.userId;
                var lineFound = req.body.lineFound;
                var fullHouseFound = req.body.fullHouseFound;

                httpConnections.getById('bingogames', gameId).then(function (gameResponse) {
                    if(!validator.validGameId(res, gameId, gameResponse, 'gameId')){
                        return;
                    }

                    if(!validator.callNumber(res, callNumber, 'callnumber')){
                        return;
                    }
                    httpConnections.getByData('fakebingousers', {username:username}).then(function (accountResponse) {
                        if(!validator.username(res, username, accountResponse, 'userId')){
                            return;
                        }

                        if(!validator.integer(res, balance, 'balance')){
                            return;
                        }

                        var response = game.getCall(gameId, callNumber, username, balance, lineFound, fullHouseFound, accountResponse);

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
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        });
    };
})();
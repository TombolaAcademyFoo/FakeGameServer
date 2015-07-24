(function () {
    'use strict';
    module.exports = function(app){
        var config = require('./config');
        var responseSenders = require('./response-senders');

        app.get('/game/next', function(req, res) {
            var nextGameTime = new Date();
            nextGameTime.setSeconds(nextGameTime.getSeconds() + 10);
            responseSenders.sendSecured(req, res, 'NextGame', {gameId: config.game.gameId, start:nextGameTime, ticketPrice: config.game.ticketPrice} );
        });

        app.post('/game/buyticket', function(req, res) {
            var player = config.user;
            //No real checking at this point...
            if(req.body.gameId && req.body.userId && req.body.balance )
            {
                player.balance = req.body.balance - config.game.ticketPrice;
                responseSenders.sendSecured(req, res, 'TicketBought', {gameId: config.game.gameId, card: config.game.card, user: player } );
            }
            else{
                responseSenders.sendError(res,  400, 'Missing information')
            }

        });

        app.post('/game/getcall', function(req, res) {
            var response = {gameId: config.game.gameId, callnumber: 0, call: 89, user: config.user };
                response.user.balance = req.body.balance;

            //No real checking at this point...
            if(req.body.gameId && req.body.userId && req.body.balance, req.body.callnumber)
            {
                response.callnumber = req.body.callnumber;
                response.call = config.game.calls[req.body.callnumber -1]; //1-->0 based
                if(response.callnumber === config.game.lineCall){
                    response.user.balance += config.game.linePrize;
                    responseSenders.sendSecured(req, res, 'Line', response );
                }
                else if(response.callnumber === config.game.houseCall){
                    response.user.balance += config.game.housePrize;
                    responseSenders.sendSecured(req, res, 'Winner', response );
                }
                else{
                    responseSenders.sendSecured(req, res, 'Call', response );
                }

            }
            else{
                responseSenders.sendError(res,  400, 'Missing information')
            }

        });

    };
})();
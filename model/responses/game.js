(function () {
    'use strict';
    var config = require('../../config'),
        databaseMiddleware = require('../../express-middleware/database-middleware');

    var createUserResponse = function(username, balance){
        var sql = 'SELECT * FROM fakebingousers WHERE username = ' + databaseMiddleware.connection.escape(username);
        databaseMiddleware.connection.query(sql, function (err, response) {
            return {username:username, balance: balance, token: response.token}
        });
    };

    var createLineWinner = function(){
        return {linewinnername: config.game.lineWinner, lineprize: config.game.linePrize};
    };

    var createHouseWinner = function(){
        var winnerInfo = createLineWinner();
        winnerInfo.housewinnername = config.game.houseWinner;
        winnerInfo.houseprize = config.game.housePrize;
        return winnerInfo;
    };

    module.exports.getNext = function(gameToPlay){
        var sql = 'SELECT * FROM bingogames WHERE id = ' + databaseMiddleware.connection.escape(gameToPlay);
        databaseMiddleware.connection.query(sql, function (err, response) {
            return {gameId: response.id, ticketPrice: config.game.ticketPrice, start: config.game.startTime()};
        });
    };

    module.exports.buyTicket = function(username, currentBalance, gameId){
        if (username && currentBalance) {
            var sql = 'SELECT * FROM bingotickets WHERE id = ' + databaseMiddleware.connection.escape(gameId);
            databaseMiddleware.connection.query(sql, function (err, response) {
                var newBalance = currentBalance - config.game.ticketPrice;
                return {gameId: gameId, card: response.card, user: createUserResponse(username, newBalance)};
            });
        }
        else
        {
            return null;
        }
    };

    module.exports.getCall = function(gameId, callNumber, username, balance){
        var response = {gameId: gameId, callnumber: callNumber, call: config.game.getCall(callNumber), user: createUserResponse(username, balance)};
        if(response.callnumber === config.game.lineCall){
            response.winnerInfo= createLineWinner();
            response.user.balance += response.winnerInfo.lineprize;
        }
        else if(response.callnumber === config.game.houseCall){
            response.winnerInfo= createHouseWinner();
            response.user.balance += response.winnerInfo.houseprize;
        }
        return response;
    };
})();
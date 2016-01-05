(function () {
    'use strict';
    var config = require('../../config'),
        databaseMiddleware = require('../../express-middleware/database-middleware');

    var createUserResponse = function(username, balance){
        var sql = 'SELECT * FROM fakebingousers WHERE username = ' + databaseMiddleware.connection.escape(username);
        databaseMiddleware.connection.query(sql, function (err, response) {
            return {username:username, balance: balance, token: response[0].token}
        });
    };

    var createLineWinner = function(username){
        return {linewinnername: username, lineprize: config.game.linePrize};
    };

    var createHouseWinner = function(username){
        var winnerInfo = createLineWinner();
        winnerInfo.housewinnername = username.houseWinner;
        winnerInfo.houseprize = config.game.housePrize;
        return winnerInfo;
    };

    var splitNumbersString = function (stringToSplit) {

    };

    module.exports.getNext = function(gameToPlay){
        var sql = 'SELECT * FROM bingogames WHERE id = ' + databaseMiddleware.connection.escape(gameToPlay);
        databaseMiddleware.connection.query(sql, function (err, response) {
            config.game.calls = splitNumbersString(response[0].ordertocall);
            return {gameId: response[0].id, ticketPrice: config.game.ticketPrice, start: config.game.startTime()};
        });
    };

    module.exports.buyTicket = function(username, currentBalance, gameId){
        if (username && currentBalance) {
            var sql = 'SELECT * FROM bingotickets WHERE id = ' + databaseMiddleware.connection.escape(gameId);
            databaseMiddleware.connection.query(sql, function (err, response) {
                var newBalance = currentBalance - config.game.ticketPrice;
                return {gameId: gameId, card: response[0].card, user: createUserResponse(username, newBalance)};
            });
        }
        else
        {
            return null;
        }
    };

    module.exports.getCall = function(gameId, callNumber, username, balance, lineFound, fullHouseFound){

        var response = {gameId: gameId, callnumber: callNumber, call: config.game.getCall(callNumber), user: createUserResponse(username, balance)};
        if(lineFound){
            response.winnerInfo= createLineWinner(username);
            response.user.balance += response.winnerInfo.lineprize;
        }
        else if(fullHouseFound){
            response.winnerInfo= createHouseWinner(username);
            response.user.balance += response.winnerInfo.houseprize;
        }
        return response;
    };
})();
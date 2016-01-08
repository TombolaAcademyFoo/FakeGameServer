(function () {
    'use strict';
    var config = require('../../config');
    var httpConnections = require('../../express-middleware/http-connections');

    var createUserResponse = function(username, balance, accountData){
        return {username:username, balance: balance, token:accountData[0].token}
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

    module.exports.getNext = function(data){
        return {gameId: data[0].id, ticketPrice: config.game.ticketPrice, start: config.game.startTime()};
    };

    module.exports.buyTicket = function(username, currentBalance, gameData, accountData, ticketData){
            var newBalance = currentBalance - config.game.ticketPrice;
            return {gameId: gameData[0].id, card: ticketData[0].ticket, user: createUserResponse(username, newBalance, accountData)};
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
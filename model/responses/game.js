(function () {
    'use strict';
    var config = require('../../config');

    var createUserResponse = function(username, balance){
        return {username:username, balance: balance, token:config.user.token}
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

    module.exports.getNext = function(){
        return {gameId: config.game.id, ticketPrice: config.game.ticketPrice, start: config.game.startTime()};
    };

    module.exports.buyTicket = function(username, currentBalance){
        var newBalance = currentBalance - config.game.ticketPrice;
        return {gameId: config.game.id, card: config.game.card, user: createUserResponse(username, newBalance)};
    };

    module.exports.getCall = function(gameId, callNumber, username, balance){
        var response = {gameId: gameId, callnumber: callNumber, call: config.game.getCall(callNumber), user: createUserResponse(username, balance)};
        if(response.callnumber === config.game.lineCall){
            response.winnerInfo= createLineWinner();
            response.user.balance += response.winnerInfo.lineprize;
        }
        else if(response.callnumber === config.game.houseCall){
            response.winnerInfo= createHouseWinner()
            response.user.balance += response.winnerInfo.houseprize;
        }
        return response;
    };
})();
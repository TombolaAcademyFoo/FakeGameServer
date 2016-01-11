(function () {
    'use strict';
    var config = require('../../config');

    var createUserResponse = function(username, balance, accountData){
        return {username:username, balance: balance, token:accountData[0].token}
    };

    var createLineWinner = function(username){
        return {linewinnername: username, lineprize: config.game.linePrize};
    };

    var createHouseWinner = function(username){
        var winnerInfo = createLineWinner();
        winnerInfo.housewinnername = username;
        winnerInfo.houseprize = config.game.housePrize;
        return winnerInfo;
    };

    var splitString = function(stringToSplit) {
        var i;
        config.game.calls = [];
        for (i = 0; i < stringToSplit.length; i+=2) {
            config.game.calls.push(stringToSplit[i] + stringToSplit[i+1]);
        }
    };

    module.exports.getNext = function(data){
        return {gameId: data[0].id, ticketPrice: config.game.ticketPrice, start: config.game.startTime()};
    };

    module.exports.buyTicket = function(username, currentBalance, gameData, accountData, ticketData){
        splitString(gameData[0].ordertocall);
        var newBalance = currentBalance - config.game.ticketPrice;
        return {gameId: gameData[0].id, card: ticketData[0].ticket, user: createUserResponse(username, newBalance, accountData)};
    };

    module.exports.getCall = function(gameId, callNumber, username, balance, lineFound, fullHouseFound, accountData){
        var response = {gameId: gameId, callnumber: callNumber, call: config.game.getCall(callNumber), user: createUserResponse(username, balance, accountData)};
        if(lineFound){
            response.winnerInfo= createLineWinner(username);
            console.log(lineFound);
            response.user.balance += response.winnerInfo.lineprize;
        }
        else if(fullHouseFound){
            response.winnerInfo= createHouseWinner(fullHouseFound);
            console.log(response.winnerInfo);
            response.user.balance += response.winnerInfo.houseprize;
        }
        return response;
    };
})();
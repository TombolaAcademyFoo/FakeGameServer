(function () {
    'use strict';
    module.exports = {
        userLogin:{
            username:'drwho',
            password:'tardis123!',
        },
        user: {
            username:'drwho', balance: 20000, token:'f36bb73b-83cc-4539-aac0-893914bc73ec'
        },
        //bingo 90 game
        //https://en.wikipedia.org/wiki/Bingo_card#75-ball_Bingo_Cards
        game : {
            gameId : 1,
            ticketPrice: 10,
            card : '054963758028345266770611596982',
            calls: [ 54, 55, 82, 38, 75,
                     37, 73, 45, 12, 13,
                     41, 21, 61, 52, 9,
                     83, 70, 34, 3,  78,
                     19, 18, 44, 48, 2,
                     57, 58, 76, 51, 20,
                     86, 87, 25, 40, 4,
                     79, 60, 16, 11, 17,
                      7, 46, 47, 32, 89,
                     90, 63, 23, 85, 68,
                     26, 24, 69, 84, 80,
                     42, 49, 53, 62, 15,
                     36, 29, 74, 67, 59,
                     88, 35, 43, 1,  50,
                     77, 71, 8,  30, 33,
                     64, 72, 31, 10, 27,
                     14, 65, 56, 66, 5,
                     28, 81, 22, 6, 39 ],
            //calls 1-based (as opposed to 0-based)
            lineCall: 85,
            linePrize: 1,
            houseCall: 89,
            housePrize: 5
        }
    };
})();
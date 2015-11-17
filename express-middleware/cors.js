(function () {
    'use strict';
    module.exports =  function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('origin')); //Mahoosive security hole IRL
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Requested-With, X-Access-Token, X-Key, X-Token');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    };
})();
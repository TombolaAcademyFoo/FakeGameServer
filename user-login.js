(function () {
    'use strict';
    module.exports = function(app){
        app.get('/', function(req, res) {
            res.send({message: 'hello world'});
        });
        app.post('/users/login', function(req, res) {
            if(req.body.username === 'drwho' && req.body.password === 'tardis'){
                res.send({username:'drwho', balance: 20000, token:'f36bb73b-83cc-4539-aac0-893914bc73ec'});
            }
            else {
                res.sendStatus(401);
            }
        });
    };
})();
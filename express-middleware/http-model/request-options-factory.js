(function () {
    'use strict';
    module.exports = function(method, endpointPath, token){
        var options =  {
            //TODO: get from env variables or config file or something...
            port: 3000,
            host:'eutaveg-01.tombola.emea',
            path: endpointPath,
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if(token){
            options.headers['x-access-token'] = token;
        }
        return options
    };
})();
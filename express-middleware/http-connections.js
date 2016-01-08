(function () {
    'use strict';
    var https = require('https');
    var requestOptionsFactory = require('./http-model/request-options-factory');
    var Q = require('q');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; //TODO: look into proper certs

    var performRequest = function (method, endpoint, token, data) {

        var deferred = Q.defer();
        var request = https.request(requestOptionsFactory(method, endpoint, token), function (response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('error', function(err){
               deferred.reject(err);
            });

            response.on('end', function () {
                if(response.statusCode===200){
                    if(endpoint !== '/authenticate'){
                        deferred.resolve(JSON.parse(str).json);
                    }
                    else{
                        deferred.resolve(JSON.parse(str));
                    }
                }
                else{
                    deferred.reject(str);
                }
            });
        });
        if (data) {
            request.write(JSON.stringify(data));
        }
        request.end();
        return deferred.promise;
    };

    module.exports = {
        getAll: function(tableName){
            return performRequest('GET', '/api/' + tableName, this.token);
        },
        getById: function(tableName, id){
            return performRequest('GET', '/api/' + tableName + '/' + id, this.token);
        },
        add: function(tableName, data){
            return performRequest('POST', '/api/' + tableName, this.token, data);
        },
        delete: function(tableName, id){
            return performRequest('DELETE', '/api/' + tableName + '/' + id, this.token);
        },
        update: function(tableName, id, data){
            return performRequest('PUT', '/api/' + tableName + '/' + id, this.token, data);
        },
        auth: function(data) {
            return performRequest('POST', '/authenticate', null, data);
        },
        token: ''
    }
})();
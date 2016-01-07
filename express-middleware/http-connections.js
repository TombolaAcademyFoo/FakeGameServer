(function () {
    'use strict';
    var https = require('https'),
        querystring = require('querystring'),
        q = require('q'),
        options = {
            port: 3000,
            host: 'eutaveg-01.tombola.emea'
        },
        performRequest = function (connectionMethod, token, endpoint, data) {
            options.path = endpoint;
            options.method = connectionMethod;
            options.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length,
                'x-access-token': token
            };

            var request,
                deferred = q.defer();

            request = https.request(options, function (response) {
                var str = '';

                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    this.token = JSON.parse(str).token;
                });
            });

            if (data && options.method === 'POST') {
                request.write(data);
            }

            request.end();

        };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    module.exports = {
        token: '',
        authenticate: function () {
            var postData = querystring.stringify({
                'username': 'ta',
                'password': 'tombola123'
            });

            return performRequest('POST', '', '/authenticate', postData);
        },

        getAllFakeBingoUsers: function () {
            return performRequest('GET', this.token, '/api/fakebingousers');
        }
    };
})();
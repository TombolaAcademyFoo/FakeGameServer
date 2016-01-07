(function () {
    'use strict';
    var https = require('https'),
        querystring = require('querystring'),
        options = {
            port: 3000,
            host: 'eutaveg-01.tombola.emea'
        };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    module.exports = {
        token: '',

        authenticate: function () {
            var postData = querystring.stringify({
                'username': 'ta',
                'password': 'tombola123'
            });
            options.path = '/authenticate';
            options.method = 'POST';
            options.headers = {'Content-Type': 'application/x-www-form-urlencoded','Content-Length': postData.length};

            var request = https.request(options, function (response) {
                var str = '';

                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    this.token = JSON.parse(str).token;
                });
            });

            request.write(postData);
            request.end();
        },

        getAllFakeBingoUsers: function () {
            options.path = '/api/fakebingousers';
            options.method = 'GET';
            options.headers = {
                'x-access-token': this.token
            };

            var request = https.request(options, function (response) {
                var str = '';

                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    console.log(JSON.parse(str).json);
                });
            });

            request.end();
        }
    };
})();
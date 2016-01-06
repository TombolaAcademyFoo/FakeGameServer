(function () {
    'use strict';
    var mysql = require('mysql');
    module.exports = {
        connection: mysql.createConnection({
            host: process.env.taApiDBHost,
            user: process.env.taApiDBUser,
            password: process.env.taApiDBPassword,
            database: process.env.taApiDBName
        })
    };
})();
require('dotenv').config();
var mysql = require('mysql');

var dbConn = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
    
});

module.exports = dbConn;
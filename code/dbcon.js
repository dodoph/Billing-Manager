var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_zouch',
    password        : '1119',
    database        : 'cs340_zouch'
});
module.exports.pool = pool;

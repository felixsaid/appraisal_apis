const mysql = require("mysql");

const dbconnect = new mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Kiambasaid123*",
    database : "appraisaldb"
});

dbconnect.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
});

module.exports = dbconnect;
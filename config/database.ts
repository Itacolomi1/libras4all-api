export {};

declare global {
    var conn: any;
    var collection: any;
}

var config = require('config/appSettings.json');



var services: any = {}
services.connect = connect;
services.ObjectID = ObjectID;

module.exports = services;


function connect() { 
    var connection = process.env.CUSTOMCONNSTR_connectionStringV2 || config.connectionStringV2;
    var database = process.env.databaseV2 || config.databaseV2;
    const mongo = require('mongodb').MongoClient;
    mongo.connect(connection, { useUnifiedTopology: true })
    .then((conn: any) => global.conn = conn.db(database))
    .catch((err: any) => console.log(err));
}

function ObjectID(){
    return require('mongodb').ObjectID;
}
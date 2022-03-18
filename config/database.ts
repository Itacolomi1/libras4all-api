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

function connect(){
    var connection = process.env.CUSTOMCONNSTR_connectionStringV2 || config.connectionStringV2;
    const mongoClient = require('mongodb').MongoClient;
    const client = new mongoClient(connection);
    return client;
}

async function close(conexao: any) {
    conexao.close();
}

function ObjectID(){
    return require('mongodb').ObjectID;
}
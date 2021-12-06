// import { Jogo } from './../models/jogo';

// declare global{
//     var conn: any;
//     var collection: any;
// }

// var Q = require('q');
// var lodash = require('lodash');
// var mongoDB = require('config/database.js');
// const ObjectID = mongoDB.ObjectID();
// mongoDB.connect();

// var service: any = {};
// service.create = create;
// service.listJogos = listJogos;
// service.getById = getById;
// service.update = update;
// service.delete = _delete;


// module.exports = service;



// function create(jogo: Jogo) {
//     var deferred = Q.defer();
//     var jogoMongo = global.conn.collection("Jogo");

//     jogoMongo.insertOne(
//         jogo,
//             function (err: any, doc: any) {
//                 if (err) deferred.reject(err.name + ': ' + err.message);

//                 deferred.resolve();
//             });
   

//     return deferred.promise;
// }

// function listJogos() {
//     var deferred = Q.defer();
//     var jogoMongo = global.conn.collection("Jogo");

//     jogoMongo.find().toArray(function (err: any, jogo1: any) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (jogo1) {            
//             deferred.resolve(jogo1);
//         } else {
//             // user not found
//             deferred.resolve();
//         }
//     });
//     return deferred.promise;
// }

// function update(jogo: Jogo) {
//     var deferred = Q.defer();
//     var jogoMongo = global.conn.collection("Jogo");
//     // validation
//     jogoMongo.findOne({ _id: new ObjectID.createFromHexString(jogo._id)}, function (err: any, person: any) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (person) {
//             updateJogo();
//         }
//     });

//     function updateJogo() {
//         // fields to update
//         var set = lodash.omit(jogo, '_id');

//         jogoMongo.updateOne(
//             { _id:new ObjectID.createFromHexString( jogo._id)},
//             { $set: set },
//             function (err: any, doc: any) {
//                 if (err) {
//                     deferred.reject(err.name + ': ' + err.message);
//                 }

//                 deferred.resolve();
//             });
//     }

//     return deferred.promise;
// }

// function getById(_id: string) {
//     var deferred = Q.defer();
//     var jogoMongo = global.conn.collection("Jogo");
//     jogoMongo.findOne({ _id: new ObjectID.createFromHexString(_id) }, function (err: any, jogo: any) {
//         if (err) deferred.reject(err.name + ': ' + err.message);

//         if (jogo) {
//             // return user (without hashed password)
//             let jogoN = Object.assign(new Jogo(),jogo);                                       
//             deferred.resolve(jogoN);
//         } else {
//             // user not found
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// }

// function _delete(_id:string) {
//     var deferred = Q.defer();
//     var people = global.conn.collection("Jogo");
//     people.deleteOne(
//         { _id: new ObjectID.createFromHexString(_id) },
//         function (err: any) {
//             if (err) {
//                 deferred.reject(err.name + ': ' + err.message);
//             }

//             deferred.resolve();
//         });

//     return deferred.promise;
// }


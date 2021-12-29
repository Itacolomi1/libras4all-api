import { IBaseDAO } from "../contratcs/ibaseDAO.contract";


export abstract class BaseDao<T> implements IBaseDAO<T> {

    public Q = require('q');
    public lodash = require('lodash');    
    

    public readonly _collection: any;
    public readonly _objectID: any;

    constructor(db: any,collection: string) {
        this._objectID = db.ObjectID();
        db.connect();
        this._collection = global.conn.collection(collection);
    }

    create(item: T): Promise<boolean> {
        var deferred = this.Q.defer();        
    
        this._collection.insertOne(
            item,
                function (err: any, doc: any) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
    
                    deferred.resolve();
                });
       
    
        return deferred.promise;
    }

    update(id: string,item: T): Promise<boolean> {
        var deferred = this.Q.defer();       
        // validation
        this._collection.findOne({ _id: new this._objectID.createFromHexString(id)},  (err: any, person: any) => {
            if (err) deferred.reject(err.name + ': ' + err.message);                
            if (person) {
                // fields to update
                var set = this.lodash.omit(item, '_id');

                this._collection.updateOne(
                    { _id:new this._objectID.createFromHexString(id)},
                    { $set: set },
                    function (err: any, doc: any) {
                        
                        if (err) {
                            deferred.reject(err.name + ': ' + err.message);
                        }   

                    deferred.resolve();
            });
                               
            }
        });        
    
        return deferred.promise;
    }

   
    delete(id: string): Promise<boolean> {
        var deferred = this.Q.defer();
      
        this._collection.deleteOne(
            { _id: new this._objectID.createFromHexString(id) },
            function (err: any) {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }
    
                deferred.resolve();
            });
    
        return deferred.promise;
    }

    list(item: T): Promise<T[]> {
        var deferred = this.Q.defer();        
    
        this._collection.find().toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);                
            if (objeto) {            
                deferred.resolve(objeto);
            } else {
                // user not found
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    getById(_id: string): Promise<T> {
        var deferred = this.Q.defer();
        
        this._collection.findOne({ _id: new this._objectID.createFromHexString(_id) }, function (err: any, jogo: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
    
            if (jogo) {                                                      
                deferred.resolve(jogo);
            } else {
                // user not found
                deferred.resolve();
            }
        });
    
        return deferred.promise;
    }
    
    listAll(): Promise<T[]> {
        var deferred = this.Q.defer();        
    
        this._collection.find().toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);                
            if (objeto) {            
                deferred.resolve(objeto);
            } else {
                // user not found
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}
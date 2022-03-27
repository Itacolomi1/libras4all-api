import { IBaseDAO } from "../contratcs/ibaseDAO.contract";

export abstract class BaseDao<T> implements IBaseDAO<T> {
    public Q = require('q');
    public lodash = require('lodash');    
    
    public readonly _collection: any;
    public readonly _objectID: any;

    constructor(db: any,collection: string) {
        this._objectID = require('mongodb').ObjectID;
        const database = db.db("LIBRAS4ALL_DB");       
        this._collection = database.collection(collection);
    }

    criar(item: T): Promise<boolean> {
        var deferred = this.Q.defer();        
        this._collection.insertOne(
            item,
            function (err: any, obj: any) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                if (obj) {                 
                    deferred.resolve(obj.ops);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    }

    atualizar(id: string,item: T): Promise<boolean> {
        var deferred = this.Q.defer();       
        this._collection.findOne({ _id: new this._objectID.createFromHexString(id)},  (err: any, obj: any) => 
        {
            if (err) deferred.reject(err.name + ': ' + err.message);                
            if (obj) {
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

    excluir(id: string): Promise<boolean> {
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

    obterPeloId(_id: string): Promise<T> {
        var deferred = this.Q.defer();
        
        this._collection.findOne({ _id: new this._objectID.createFromHexString(_id) }, function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (obj) {                 
                deferred.resolve(obj);
            } else {
                deferred.resolve();
            }
        });  
        return deferred.promise;
    }
    
    listar(): Promise<T[]>{
        var deferred = this.Q.defer();        
        this._collection.find().toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);                
            if (objeto) {            
                deferred.resolve(objeto);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    autenticar(email: any, senha: any){
        var deferred = this.Q.defer(); 
        var jwt = require('jsonwebtoken');
        var config = require('config/appSettings.json');

        this._collection.findOne({ email: email }, function (err: any, usuario: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);   

            if (usuario && (senha === usuario.senha)) {
                deferred.resolve({_id: usuario._id, token :jwt.sign({ id: usuario._id }, config.secret)});
            } else {
                deferred.resolve({erro: "Login Inválido!"});
            }
        });   
        return deferred.promise;
    }

    obterPeloEmail(email: string): Promise<T> {
        var deferred = this.Q.defer();
        
        this._collection.findOne({ email: email }, function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (obj) {                                                      
                deferred.resolve(obj);
            } else {
                deferred.resolve();
            }
        });  
        return deferred.promise;
    }

    obterPeloNickname(nickname: string): Promise<T> {
        var deferred = this.Q.defer();
        
        this._collection.findOne({ nickname: nickname }, function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (obj) {                                                      
                deferred.resolve(obj);
            } else {
                deferred.resolve();
            }
        });  
        return deferred.promise;
    }

    obterPeloItem(idSala: any) {
        var deferred = this.Q.defer();
        this._collection.findOne({ idSala: idSala }, function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (obj) {                                                
                deferred.resolve(obj);
            } else {
                deferred.resolve();
            }
        });  
        return deferred.promise;
    }    


}
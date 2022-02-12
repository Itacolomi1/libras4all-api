import { Meteoro } from './../models/meteoro';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class MeteoroDAO extends BaseDao<Meteoro>{

    obterMeteoroPorSala(idSala: string) {
        var deferred = this.Q.defer();
        this._collection.find({ idSala: idSala }).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                deferred.resolve(objeto);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }    

    obterSinaisAleatorias() {
        var deferred = this.Q.defer();
        var idSinais = new Array();

        this._collection.aggregate([
            { $sample: { size: 5} }
        ]).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                objeto.forEach((element: any) => { 
                    idSinais.push(element._id);           
                });
                deferred.resolve(idSinais);   
            }          
             else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}



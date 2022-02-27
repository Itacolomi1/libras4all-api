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
}



import { Historico } from './../models/historico';
import { BaseDao } from "../core/baseDAO.core";

declare global{
    var conn: any;
    var collection: any;
}

export class HistoricoDAO extends BaseDao<Historico>{
    
    obterPorcentagemPorItem(idSala: string, idItem: string) {
        var deferred = this.Q.defer();
        this._collection.find({ $and: [
            {'idSala': idSala},
            {'idItem': idItem}
        ]})
        .toArray(function (err: any, objeto: any) {
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



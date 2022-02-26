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

    obterPorcentagemPorAluno(idSala: string, idUsuario: string) {
        var deferred = this.Q.defer();
        this._collection.find({ $and: [
            {'idSala': idSala},
            {'idUsuario': idUsuario}
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

    obterMelhoresAlunos(idSala:string) {
        var deferred = this.Q.defer();
        this._collection.aggregate([
            { $match: { idSala: idSala, acerto: "true"} },
            {
                $group: {
                    _id: "$idUsuario",
                    quantidadeAcertos: { $sum: 1 }
                }
            },
            { $sort:{"quantidadeAcertos": -1} },
            { $limit: 3 }
        ]).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                deferred.resolve(objeto);
            }          
             else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}


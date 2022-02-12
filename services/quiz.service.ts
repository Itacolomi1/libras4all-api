import { BaseDao } from "../core/baseDAO.core";
import { Quiz } from "../models/quiz";

export class QuizDAO extends BaseDao<Quiz> {
    
    obterQuizPorSala(idSala: string) {
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
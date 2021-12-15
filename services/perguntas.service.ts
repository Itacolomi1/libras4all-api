import { BaseDao } from "../core/baseDAO.core";
import { Perguntas } from "../models/perguntas";

export class QuizDAO extends BaseDao<Perguntas> {

    getQuestionsbyClass(classe_pergunta: string) {

        var deferred = this.Q.defer();        
    
        this._collection.find({ classe:classe_pergunta }).toArray(function (err: any, objeto: any) {
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
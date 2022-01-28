import { Sala } from './../models/sala';
import { BaseDao } from "../core/baseDAO.core";

export class ServiceSalaDAO extends BaseDao<Sala>{
    
    adicionarAluno(idSala: string, idAluno: string){
        console.log('2')
        var deferred = this.Q.defer();

        this._collection.findOneAndUpdate(
            { "_id": new this._objectID.createFromHexString(idSala) },
            {$push: {"alunos": {_id: idAluno, pontuacao: 0}}}, 
            function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);    
            if (obj) {                                                      
                deferred.resolve(obj.value);
            } else {
                // user not found
                deferred.resolve();
            }
        });   
        
        return deferred.promise;

    }  
    

}


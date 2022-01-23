import { BaseDao } from "../core/baseDAO.core";
import { Aluno } from "../models/aluno";

export class AlunoDAO extends BaseDao<Aluno>{

    alunosPorProfessor(professor: string){
        var deferred = this.Q.defer();        
    
        this._collection.find({listaSalas:{$elemMatch:{idProfessor: professor}}}).toArray(function (err: any, objeto: any) {
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

    rendimentoJogoAluno(idAluno: string,idSala: string){
        // lógica aqui
        var deferred = this.Q.defer();
        
        this._collection.findOne({ 
            _id: new this._objectID.createFromHexString(idAluno),
            listaSalas: { $elemMatch:{id:idSala}}
         }, function (err: any, jogo: any) {
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

}
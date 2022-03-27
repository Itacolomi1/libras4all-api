import { Sala } from './../models/sala';
import { BaseDao } from "../core/baseDAO.core";

export class ServiceSalaDAO extends BaseDao<Sala>{
    
    adicionarAluno(idSala: string, idAluno: string, nomeAluno: string, email: string, nickname: string){
        var deferred = this.Q.defer();

        this._collection.findOneAndUpdate(
            { 
                "_id": new this._objectID.createFromHexString(idSala) 
            },
            {
                $push: 
                {
                    "alunos": 
                    {
                        _id: idAluno,
                        nome: nomeAluno,
                        email: email,
                        nickname: nickname
                    }
                }
            }, 
            function (err: any, obj: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);    
            if (obj) {                                                      
                deferred.resolve(obj.value);
            } else {
                deferred.resolve();
            }
        });   
        
        return deferred.promise;
    }  

    listarSalasProfessor(idProfessor: string) {
        var deferred = this.Q.defer();
        this._collection.find({ idProfessor: idProfessor }).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                deferred.resolve(objeto);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
    
    obterPeloCodigo(codigoEnviado: string) {
        var deferred = this.Q.defer();
        this._collection.findOne({ codigo: Number(codigoEnviado) }, function (err: any, obj: any) {
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


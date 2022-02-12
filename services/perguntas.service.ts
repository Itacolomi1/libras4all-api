import { BaseDao } from "../core/baseDAO.core";
import { Perguntas } from "../models/perguntas";
import { PerguntasQuiz } from "../models/perguntasQuiz";

export class PerguntasDAO extends BaseDao<Perguntas> {

    obterPerguntasPorClasse(classe_pergunta: string) {
        var deferred = this.Q.defer();
        this._collection.find({ classe: classe_pergunta }).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                deferred.resolve(objeto);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    obterPerguntasAleatorias(element: any) {
        var deferred = this.Q.defer();
        var idPerguntas = new Array();

        this._collection.aggregate([
            { $match: { classe: element.classe } },
            { $sample: { size: element.quantidade} }
        ]).toArray(function (err: any, objeto: any) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                objeto.forEach((element: any) => { 
                    var x = element._id
                    idPerguntas.push(x);           
                });
                deferred.resolve(idPerguntas);   
            }          
             else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    obterPerguntasEmLote(perguntasQuiz: any) {
        var deferred = this.Q.defer();
        let perguntasQuizDAO: Array<PerguntasQuiz> = [];
        let tempClasses = perguntasQuiz.perguntas.map((element: any) => {
            return element.classe
        });
        this._collection.find({ classe: { $in: tempClasses } }).toArray((err: any, objeto: any) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (objeto) {
                tempClasses.forEach((element: any) => {
                    let pergunta = new PerguntasQuiz();
                    pergunta.classe = element;
                    pergunta.perguntas = this.obterIdArray(objeto, element);
                    perguntasQuizDAO.push(pergunta);
                    
                });
                deferred.resolve(perguntasQuizDAO);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }

    obterIdArray(array: any, classe: string) {
        let tempArray = array.filter((element: any) => {
            if (element.classe === classe) {
                return element._id
            }
        });
        return tempArray.filter(Boolean);
    }
}
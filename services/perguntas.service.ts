import { BaseDao } from "../core/baseDAO.core";
import { Perguntas } from "../models/perguntas";
import { PerguntasQuiz } from "../models/perguntasQuiz";

export class PerguntasDAO extends BaseDao<Perguntas> {

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

    getQuestionsBatch(perguntasQuiz: any) {

        var deferred = this.Q.defer();
        let perguntasQuizDao: Array<PerguntasQuiz>;



        perguntasQuiz.perguntas.array.forEach((element: any) => {
            let pergunta = new PerguntasQuiz();
            pergunta.classe = element.classe;
            
            let perguntasClasse = this.getQuestionsbyClass(element.classe);
            pergunta.perguntasClasseId = perguntasClasse

        });
    
      

        return deferred.promise;
    }

}
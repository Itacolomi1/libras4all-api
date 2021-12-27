import { BaseDao } from "../core/baseDAO.core";
import { Alternativa } from "../models/alternativa";
import { Perguntas } from "../models/perguntas";
import { PerguntasQuiz } from "../models/perguntasQuiz";

export class PerguntasDAO extends BaseDao<Perguntas> {

    getQuestionsbyClass(classe_pergunta: string) {

        var deferred = this.Q.defer();

        this._collection.find({ classe: classe_pergunta }).toArray(function (err: any, objeto: any) {
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
        let perguntasQuizDao: Array<PerguntasQuiz> = [];

        let tempClasses = perguntasQuiz.perguntas.map((element: any) => {
            return element.classe
        });

        this._collection.find({ classe: { $in: tempClasses } }).toArray((err: any, objeto: any) => {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (objeto) {

                tempClasses.forEach((element: any) => {
                    let pergunta = new PerguntasQuiz();
                    pergunta.classe = element;
                    pergunta.perguntas = this.getIdArray(objeto, element);
                    perguntasQuizDao.push(pergunta);
                });
                deferred.resolve(perguntasQuizDao);

            } else {
                // user not found
                deferred.resolve();
            }
        });



        return deferred.promise;
    }

    getIdArray(array: any, classe: string) {

        let tempArray = array.filter((element: any) => {

            if (element.classe === classe) {
                return element._id
            }

        });

        return tempArray.filter(Boolean);
    }

    getAlternativas(array: any) {

        let alternativas = Array<Alternativa>();

        array.forEach((element: any) => {
            let alternativa = new Alternativa();
            alternativa.descricao = element.texto;
            alternativa.isRight = element.isRight;
            alternativas.push(alternativa);
        });

        return alternativas;

    }



}
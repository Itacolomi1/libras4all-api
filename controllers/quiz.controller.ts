//#region Importações

import { Quiz } from "../models/quiz";
import { PerguntasDAO } from "../services/perguntas.service";
import { QuizDAO } from "../services/quiz.service";

var express = require('express');
var router = express.Router();
var mongoDB = require('config/database.ts');
const ObjectID = mongoDB.ObjectID();
mongoDB.connect();

declare global{
    var conn: any;
    var collection: any;
}

//#endregion

//#region Rotas
router.get('/obterQuizPorSala/:idSala', obterQuizPorSala);
router.post('/', criar);

module.exports = router;

//#endregion

//#region Requisições GET

async function obterQuizPorSala(req: any, res: any) { 
    try{
        console.log(req.params.idSala)
        const dao = new QuizDAO(mongoDB, "Quiz");
        let resultado = await dao.obterQuizPorSala(req.params.idSala);
        res.send(resultado);
    }
    catch(ex){
        res.status(500).send(ex);
    }  
}

//#endregion

//#region Requisições POST
async function criar(req: any, res: any) {
    const dao = new QuizDAO(mongoDB,'Quiz');
    const perguntasDAO = new PerguntasDAO(mongoDB,'Perguntas');

    let quiz = new Quiz();
    quiz.idSala = req.body.idSala;
    quiz.perguntasQuiz = await perguntasDAO.obterPerguntasEmLote(req.body);

    let result = await dao.criar(quiz);
    res.send(result);
}
//#endregion








